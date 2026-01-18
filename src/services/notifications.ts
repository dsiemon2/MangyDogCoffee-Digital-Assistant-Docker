import pino from 'pino';

const logger = pino();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export interface SlackMessage {
  text: string;
  channel?: string;
  username?: string;
  icon_emoji?: string;
  attachments?: SlackAttachment[];
}

export interface SlackAttachment {
  color?: string;
  title?: string;
  text?: string;
  fields?: { title: string; value: string; short?: boolean }[];
  footer?: string;
  ts?: number;
}

/**
 * Send a notification to Slack
 */
export async function sendSlackNotification(message: SlackMessage): Promise<{ success: boolean; error?: string }> {
  if (!SLACK_WEBHOOK_URL) {
    logger.debug('Slack webhook not configured, skipping notification');
    return { success: true }; // Don't fail if not configured
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message.text,
        username: message.username || 'Mangy Dog Coffee Bot',
        icon_emoji: message.icon_emoji || ':coffee:',
        attachments: message.attachments
      })
    });

    if (!response.ok) {
      throw new Error(`Slack returned ${response.status}`);
    }

    logger.info('Slack notification sent');
    return { success: true };
  } catch (err: any) {
    logger.error({ err }, 'Failed to send Slack notification');
    return { success: false, error: err.message };
  }
}

/**
 * Notify about a new call
 */
export async function notifyNewCall(options: {
  callSid: string;
  fromNumber: string;
  callerName?: string;
}): Promise<void> {
  await sendSlackNotification({
    text: `New call received`,
    attachments: [{
      color: '#0dcaf0',
      fields: [
        { title: 'From', value: options.fromNumber, short: true },
        { title: 'Caller', value: options.callerName || 'Unknown', short: true },
        { title: 'Call SID', value: options.callSid.substring(0, 20) + '...', short: false }
      ],
      footer: 'Mangy Dog Coffee Voice Assistant',
      ts: Math.floor(Date.now() / 1000)
    }]
  });
}

/**
 * Notify about a new voicemail
 */
export async function notifyVoicemail(options: {
  fromNumber: string;
  duration: number;
  transcript?: string;
}): Promise<void> {
  await sendSlackNotification({
    text: `New voicemail received!`,
    icon_emoji: ':mailbox_with_mail:',
    attachments: [{
      color: '#6c757d',
      title: 'Voicemail',
      fields: [
        { title: 'From', value: options.fromNumber, short: true },
        { title: 'Duration', value: `${options.duration} seconds`, short: true },
        { title: 'Transcript', value: options.transcript?.substring(0, 500) || 'Transcription pending...', short: false }
      ],
      footer: 'Mangy Dog Coffee Voice Assistant',
      ts: Math.floor(Date.now() / 1000)
    }]
  });
}

/**
 * Notify about a call transfer request
 */
export async function notifyTransferRequest(options: {
  fromNumber: string;
  callerName?: string;
  reason?: string;
}): Promise<void> {
  await sendSlackNotification({
    text: `Call transfer requested - caller wants to speak with a human`,
    icon_emoji: ':telephone_receiver:',
    attachments: [{
      color: '#dc3545',
      title: 'Transfer Request',
      fields: [
        { title: 'Caller', value: options.callerName || 'Unknown', short: true },
        { title: 'Phone', value: options.fromNumber, short: true },
        { title: 'Reason', value: options.reason || 'Not specified', short: false }
      ],
      footer: 'Mangy Dog Coffee Voice Assistant',
      ts: Math.floor(Date.now() / 1000)
    }]
  });
}

/**
 * Notify about an error/alert
 */
export async function notifyError(options: {
  title: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  context?: Record<string, string>;
}): Promise<void> {
  const colors = {
    warning: '#ffc107',
    error: '#dc3545',
    critical: '#7c0a02'
  };

  const emojis = {
    warning: ':warning:',
    error: ':x:',
    critical: ':rotating_light:'
  };

  const fields = Object.entries(options.context || {}).map(([key, value]) => ({
    title: key,
    value,
    short: true
  }));

  await sendSlackNotification({
    text: `${emojis[options.severity]} ${options.title}`,
    icon_emoji: emojis[options.severity],
    attachments: [{
      color: colors[options.severity],
      title: options.title,
      text: options.message,
      fields,
      footer: 'Mangy Dog Coffee Voice Assistant',
      ts: Math.floor(Date.now() / 1000)
    }]
  });
}

/**
 * Send daily summary notification
 */
export async function notifyDailySummary(options: {
  date: string;
  totalCalls: number;
  voicemails: number;
  transferRequests: number;
}): Promise<void> {
  await sendSlackNotification({
    text: `Daily Summary for ${options.date}`,
    icon_emoji: ':bar_chart:',
    attachments: [{
      color: '#0d6efd',
      title: 'Daily Summary',
      fields: [
        { title: 'Total Calls', value: options.totalCalls.toString(), short: true },
        { title: 'Voicemails', value: options.voicemails.toString(), short: true },
        { title: 'Transfer Requests', value: options.transferRequests.toString(), short: true }
      ],
      footer: 'Mangy Dog Coffee Voice Assistant',
      ts: Math.floor(Date.now() / 1000)
    }]
  });
}

export default {
  sendSlackNotification,
  notifyNewCall,
  notifyVoicemail,
  notifyTransferRequest,
  notifyError,
  notifyDailySummary
};
