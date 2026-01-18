import twilio from 'twilio';
import pino from 'pino';

const logger = pino();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = process.env.TWILIO_VOICE_NUMBER;
const MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID;

export interface SMSOptions {
  to: string;
  body: string;
  mediaUrl?: string[];
}

/**
 * Send an SMS message using Twilio
 */
export async function sendSMS(options: SMSOptions): Promise<{ success: boolean; sid?: string; error?: string }> {
  const { to, body, mediaUrl } = options;

  // Validate phone number format
  const cleanPhone = to.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { success: false, error: 'Invalid phone number' };
  }

  const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`;

  try {
    const messageOptions: any = {
      to: formattedPhone,
      body,
    };

    // Use messaging service if configured, otherwise use from number
    if (MESSAGING_SERVICE_SID) {
      messageOptions.messagingServiceSid = MESSAGING_SERVICE_SID;
    } else if (FROM_NUMBER) {
      messageOptions.from = FROM_NUMBER;
    } else {
      return { success: false, error: 'No SMS sender configured' };
    }

    // Add media URL if provided (for MMS)
    if (mediaUrl && mediaUrl.length > 0) {
      messageOptions.mediaUrl = mediaUrl;
    }

    const message = await twilioClient.messages.create(messageOptions);

    logger.info({ sid: message.sid, to: formattedPhone }, 'SMS sent successfully');
    return { success: true, sid: message.sid };
  } catch (err: any) {
    logger.error({ err, to: formattedPhone }, 'Failed to send SMS');
    return { success: false, error: err.message };
  }
}

/**
 * Send voicemail notification SMS
 */
export async function sendVoicemailNotification(options: {
  to: string;
  callerPhone: string;
  transcript?: string;
  timestamp: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  const { to, callerPhone, transcript, timestamp } = options;

  let body = `New voicemail received at Mangy Dog Coffee!

From: ${callerPhone}
Time: ${timestamp}`;

  if (transcript) {
    body += `\n\nTranscript:\n"${transcript.substring(0, 300)}${transcript.length > 300 ? '...' : ''}"`;
  }

  body += `\n\nCheck the admin dashboard for full details.`;

  return sendSMS({ to, body });
}

export default {
  sendSMS,
  sendVoicemailNotification
};
