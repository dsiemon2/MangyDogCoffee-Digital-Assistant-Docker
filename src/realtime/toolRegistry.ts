import { prisma } from '../db/prisma.js';
import { askKB } from '../services/kb.js';
import { createBookingLink } from '../services/booking.js';
import { sendSMS } from '../services/sms.js';
import { notifyTransferRequest } from '../services/notifications.js';

async function logIntent(intent: string, meta: any = {}) {
  try {
    await prisma.intentLog.create({ data: { intent, meta: JSON.stringify(meta) } });
  } catch {}
}

export const tools = {
  /**
   * Get policy/configuration settings
   */
  async getPolicy() {
    const cfg = await prisma.businessConfig.findFirst();
    return {
      kbMinConfidence: cfg?.kbMinConfidence ?? 0.55,
      lowConfidenceAction: cfg?.lowConfidenceAction ?? 'ask_clarify'
    };
  },

  /**
   * Set conversation language
   */
  async setLanguage(args: { lang: string }) {
    const lang = (args?.lang || 'en').substring(0, 5).toLowerCase();
    try {
      await prisma.languageLog.create({ data: { language: lang } });
    } catch {}
    await logIntent('setLanguage', { lang });
    return { ok: true, lang };
  },


  /**
   * Get information about Mangy Dog Coffee and AKT Foundation
   */
  async getAboutInfo() {
    await logIntent('getAboutInfo');

    return {
      ok: true,
      organization: 'Mangy Dog Coffee',
      beneficiary: 'AKT Foundation',
      mission: 'Mangy Dog Coffee proudly donates 10% of all sales to the AKT Foundation, a 501(c)(3) nonprofit dedicated to providing essential household necessities to families in extreme poverty and those impacted by domestic violence.',
      website: 'mangydogcoffee.com'
    };
  },

  /**
   * Transfer to human agent
   */
  async transferToHuman(args: { reason?: string; callerPhone?: string; callerName?: string }) {
    await logIntent('transferToHuman', args);

    // Send Slack notification about transfer request (async)
    notifyTransferRequest({
      fromNumber: args.callerPhone || 'Unknown',
      callerName: args.callerName,
      reason: args.reason
    }).catch(err => console.error('Slack transfer notification failed:', err));

    return { ok: true, reason: args?.reason || 'unspecified', action: 'TRANSFER' };
  },

  /**
   * Book an appointment
   */
  async bookAppointment(args: {
    dateTime?: string;
    durationMins?: number;
    purpose?: string;
    contact?: string;
    email?: string;
  }) {
    await logIntent('bookAppointment', args);

    const result = await createBookingLink({
      dateTime: args.dateTime,
      durationMins: args.durationMins || 30,
      purpose: args.purpose,
      contact: args.contact,
      email: args.email
    });

    if (result.booked) {
      return {
        ok: true,
        message: `Great! I've booked your appointment. ${args.contact ? 'I\'ve sent you a confirmation text with the details.' : 'You can view it at ' + result.link}`,
        mode: result.mode,
        link: result.link
      };
    } else {
      return {
        ok: true,
        message: `I've sent you a link to book your appointment. ${args.contact ? 'Check your text messages!' : 'Visit ' + result.link + ' to complete booking.'}`,
        mode: result.mode,
        link: result.link
      };
    }
  },

  /**
   * Take a voicemail message
   */
  async takeMessage(args: { subject?: string; details?: string; contact?: string }) {
    await logIntent('takeMessage', args);
    return {
      ok: true,
      ticketId: 'MSG-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      captured: args
    };
  },

  /**
   * Answer general questions using knowledge base
   * Applies confidence thresholds and gating based on BusinessConfig
   */
  async answerQuestion(args: { question: string; language?: string; callSid?: string }) {
    await logIntent('answerQuestion', { question: args.question });

    const lang = (args.language || 'en').substring(0, 5).toLowerCase();
    const res = await askKB(args.question, lang);

    // Get confidence policy
    const cfg = await prisma.businessConfig.findFirst();
    const minConfidence = cfg?.kbMinConfidence ?? 0.55;
    const lowConfidenceAction = cfg?.lowConfidenceAction ?? 'ask_clarify';

    // Log citation
    try {
      const call = args?.callSid
        ? await prisma.callLog.findUnique({ where: { callSid: String(args.callSid) } })
        : null;

      await prisma.citationsLog.create({
        data: {
          callLogId: call?.id || null,
          callSid: args?.callSid || null,
          question: args.question,
          language: lang,
          sources: JSON.stringify(res.sources || [])
        }
      });
    } catch {}

    // Check confidence threshold
    const topConfidence = res.sources[0]?.score ?? 0;

    if (topConfidence < minConfidence) {
      // Below threshold - apply gating action
      await logIntent('lowConfidenceKB', {
        question: args.question,
        confidence: topConfidence,
        action: lowConfidenceAction
      });

      if (lowConfidenceAction === 'transfer') {
        return {
          ok: false,
          lowConfidence: true,
          action: 'TRANSFER',
          message: "I'm not confident I have the right information for that question. Let me transfer you to someone who can help better."
        };
      } else if (lowConfidenceAction === 'voicemail') {
        return {
          ok: false,
          lowConfidence: true,
          action: 'VOICEMAIL',
          message: "I'm not sure I have the right answer for that. Would you like to leave a message and we'll get back to you with the correct information?"
        };
      } else {
        // ask_clarify (default)
        return {
          ok: false,
          lowConfidence: true,
          action: 'CLARIFY',
          message: "I'm not entirely sure about that. Could you rephrase your question or ask about something more specific like our coffee products, brewing recommendations, or our charitable mission?",
          partialContext: res.context,
          sources: res.sources
        };
      }
    }

    // Good confidence - return the answer
    return {
      ...res,
      ok: true,
      confidenceOk: true,
      topConfidence
    };
  },

  /**
   * Send an SMS message to a phone number
   */
  async sendTextMessage(args: {
    to: string;
    message: string;
  }) {
    await logIntent('sendTextMessage', { to: args.to });

    const result = await sendSMS({
      to: args.to,
      body: args.message
    });

    if (result.success) {
      return {
        ok: true,
        message: `I've sent a text message to ${args.to}.`
      };
    } else {
      return {
        ok: false,
        error: result.error || 'Failed to send SMS'
      };
    }
  }
};

// Handle tool calls from OpenAI
export async function handleToolCall(name: string, args: any, callId?: string) {
  const tool = (tools as any)[name];
  if (!tool) {
    return { error: `Unknown tool: ${name}` };
  }

  try {
    const result = await tool(args);
    return result;
  } catch (err: any) {
    return { error: err.message || 'Tool execution failed' };
  }
}

// Tool specifications for OpenAI
export const toolSpecs = [
  {
    name: 'getAboutInfo',
    description: 'Get information about Mangy Dog Coffee and its charitable mission supporting the AKT Foundation',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'transferToHuman',
    description: 'Transfer the caller to a human agent',
    input_schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Reason for transfer' },
        callerPhone: { type: 'string', description: 'Caller phone number for notification' },
        callerName: { type: 'string', description: 'Caller name if known' }
      }
    }
  },
  {
    name: 'bookAppointment',
    description: 'Book an appointment or send a booking link. Use when caller wants to schedule a meeting or callback.',
    input_schema: {
      type: 'object',
      properties: {
        dateTime: { type: 'string', description: 'Requested date/time in ISO format (e.g., 2024-03-15T14:00:00)' },
        durationMins: { type: 'number', description: 'Duration in minutes (default 30)' },
        purpose: { type: 'string', description: 'Purpose of the appointment' },
        contact: { type: 'string', description: 'Caller phone number to send SMS confirmation' },
        email: { type: 'string', description: 'Caller email for calendar invite' }
      }
    }
  },
  {
    name: 'takeMessage',
    description: 'Take a voicemail message from the caller',
    input_schema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        details: { type: 'string' },
        contact: { type: 'string' }
      }
    }
  },
  {
    name: 'answerQuestion',
    description: 'REQUIRED: Look up product information from the knowledge base. You MUST call this tool BEFORE answering ANY question about products, pricing, coffee, tea, pods, roasts, tasting notes, grinds, or availability. Never guess or assume product information - always use this tool first.',
    input_schema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'The question to answer' },
        language: { type: 'string', description: 'Language code (en, es, etc)' }
      },
      required: ['question']
    }
  },
  {
    name: 'sendTextMessage',
    description: 'Send an SMS text message to a phone number. Use this when the caller requests information be texted to them, or to send links that are hard to communicate verbally.',
    input_schema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Phone number to send SMS to' },
        message: { type: 'string', description: 'The text message content to send' }
      },
      required: ['to', 'message']
    }
  }
];
