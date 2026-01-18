import { Router } from 'express';
import twilio from 'twilio';
import { prisma } from '../db/prisma.js';
import { enqueueTranscription } from '../queues/enqueue.js';

const router = Router();
const { VoiceResponse } = twilio.twiml;

// Main voice entry point
router.post('/voice', async (_req, res) => {
  const twiml = new VoiceResponse();

  twiml.say({ voice: 'Polly.Joanna' },
    'Thank you for calling Mangy Dog Coffee! This call may be recorded. How can I help you today?'
  );

  const gather = twiml.gather({
    input: ['speech', 'dtmf'],
    numDigits: 1,
    speechTimeout: 'auto',
    action: '/voice/route',
    method: 'POST',
  });

  gather.say({ voice: 'Polly.Joanna' },
    'Press 1 for information about our coffee products. ' +
    'Press 2 for brewing tips and recommendations. ' +
    'Press 0 to speak with someone. ' +
    'Or press 9 for our voice assistant.'
  );

  res.type('text/xml').send(twiml.toString());
});

// Route based on DTMF or speech input
router.post('/voice/route', async (req, res) => {
  const twiml = new VoiceResponse();
  const { Digits, SpeechResult } = req.body || {};
  const slot = (Digits || '').trim();
  const speech = (SpeechResult || '').toLowerCase();

  // Voice Assistant (AI conversation)
  if (slot === '9' || /assistant|ai|voice|help/i.test(speech)) {
    const connect = twiml.connect();
    const baseUrl = process.env.PUBLIC_BASE_URL?.replace(/\/$/, '') || '';
    connect.stream({ url: `${baseUrl}/media` });
    twiml.say({ voice: 'Polly.Joanna' },
      'Connecting you to our voice assistant. One moment please.'
    );
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Coffee Products Information
  if (slot === '1' || /coffee|products|menu|buy|order|shop/i.test(speech)) {
    twiml.say({ voice: 'Polly.Joanna' },
      'Mangy Dog Coffee offers a wide variety of premium coffees including single origin beans from Peru, Kenya, Guatemala, and more. ' +
      'We also have delicious flavored coffees, specialty blends, and teas. ' +
      'Ten percent of all sales goes to the A K T Foundation, helping families in need. ' +
      'To shop online, visit mangy dog coffee dot com. ' +
      'Press 9 to speak with our assistant for more details.'
    );
    twiml.redirect('/voice');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Brewing Tips
  if (slot === '2' || /brew|brewing|how to|tips|recommend|grind/i.test(speech)) {
    twiml.say({ voice: 'Polly.Joanna' },
      'For the best cup of coffee, we recommend using 2 tablespoons of ground coffee per 6 ounces of water. ' +
      'Water temperature should be between 195 and 205 degrees Fahrenheit. ' +
      'For brewing method recommendations based on your coffee type, press 9 to speak with our voice assistant.'
    );
    twiml.redirect('/voice');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Transfer to Human
  if (slot === '0' || /human|person|agent|talk|speak|someone|transfer/i.test(speech)) {
    twiml.say({ voice: 'Polly.Joanna' }, 'Transferring you now. Please hold.');
    if (process.env.TWILIO_AGENT_TRANSFER_NUMBER) {
      twiml.dial(process.env.TWILIO_AGENT_TRANSFER_NUMBER);
    } else {
      twiml.say({ voice: 'Polly.Joanna' },
        'I\'m sorry, no one is available right now. ' +
        'Please leave a message after the tone, or contact us at mangy dog coffee dot com.'
      );
      twiml.record({
        maxLength: 120,
        playBeep: true,
        transcribe: true,
        transcribeCallback: '/voice/voicemail',
        finishOnKey: '#'
      });
    }
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Voicemail
  if (/message|voicemail|leave/i.test(speech)) {
    twiml.say({ voice: 'Polly.Joanna' },
      'Please leave your message after the tone. Press pound when finished.'
    );
    twiml.record({
      maxLength: 120,
      playBeep: true,
      transcribe: true,
      transcribeCallback: '/voice/voicemail',
      finishOnKey: '#'
    });
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Default - didn't understand
  twiml.say({ voice: 'Polly.Joanna' }, 'Sorry, I didn\'t catch that.');
  twiml.redirect('/voice');
  res.type('text/xml').send(twiml.toString());
});

// Voicemail callback
router.post('/voice/voicemail', async (req, res) => {
  console.log('Voicemail received:', req.body?.TranscriptionText);

  try {
    await enqueueTranscription({
      recordingUrl: req.body?.RecordingUrl,
      callSid: req.body?.CallSid
    });
  } catch (err) {
    console.error('Failed to enqueue transcription:', err);
  }

  const twiml = new VoiceResponse();
  twiml.say({ voice: 'Polly.Joanna' },
    'Thank you! Your message has been received. We\'ll get back to you soon.'
  );
  twiml.hangup();
  res.type('text/xml').send(twiml.toString());
});

// Call status webhook
router.post('/voice/status', async (req, res) => {
  const { CallSid, From, To, CallStatus } = req.body || {};

  // Upsert call log
  let call = await prisma.callLog.findUnique({
    where: { callSid: CallSid || '' }
  });

  if (!call) {
    try {
      call = await prisma.callLog.create({
        data: {
          callSid: CallSid || 'unknown',
          fromNumber: From || 'unknown',
          toNumber: To || 'unknown',
        }
      });
    } catch (err) {
      console.error('Failed to create call log:', err);
    }
  }

  // Update on call end
  const endedStatuses = new Set(['completed', 'busy', 'no-answer', 'canceled', 'failed']);
  if (CallStatus && endedStatuses.has(String(CallStatus))) {
    await prisma.callLog.update({
      where: { callSid: CallSid },
      data: { endedAt: new Date(), outcome: String(CallStatus) }
    }).catch(() => {});
  }

  res.status(204).end();
});

export default router;
