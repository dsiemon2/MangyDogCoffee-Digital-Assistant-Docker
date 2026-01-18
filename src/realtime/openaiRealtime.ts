import WebSocket from 'ws';
import pino from 'pino';

const logger = pino();

export type ToolSpec = {
  name: string;
  description?: string;
  input_schema: Record<string, any>;
};

export type OpenAIRealtimeOptions = {
  model?: string;
  apiKey?: string;
  voice?: string;
  inputSampleRate?: number;
  outputSampleRate?: number;
  turnDetection?: 'server_vad' | 'none';
  tools?: ToolSpec[];
  instructions?: string;
};

export type ToolCallEvent = {
  id?: string;
  name?: string;
  tool_name?: string;
  arguments?: string | Record<string, any>;
  tool_call_id?: string;
};

export type Handlers = {
  onAudioDelta?: (b64Pcm16_16k: string) => void;
  onTextDelta?: (textChunk: string) => void;
  onResponseCompleted?: () => void;
  onToolCall?: (call: ToolCallEvent) => Promise<any>;
  onError?: (err: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export class OpenAIRealtimeClient {
  private ws?: WebSocket;
  private opts: Required<OpenAIRealtimeOptions>;
  private handlers: Handlers;
  private connected = false;
  private pendingBytes = 0;
  private heartbeatTimer?: NodeJS.Timeout;

  constructor(opts: OpenAIRealtimeOptions = {}, handlers: Handlers = {}) {
    this.opts = {
      model: opts.model || process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview',
      apiKey: opts.apiKey || process.env.OPENAI_API_KEY || '',
      voice: opts.voice || process.env.OPENAI_TTS_VOICE || 'alloy',
      inputSampleRate: opts.inputSampleRate ?? 16000,
      outputSampleRate: opts.outputSampleRate ?? 16000,
      turnDetection: opts.turnDetection || 'server_vad',
      tools: opts.tools || [],
      instructions: opts.instructions || `You are a helpful voice assistant for Mangy Dog Coffee - "Coffee with a bite!" 10% of all sales go to the AKT Foundation, a 501(c)(3) nonprofit.

Your primary functions are:
1. Answer questions about our coffee products (blends, single origins, roasts, tasting notes)
2. Provide pricing information (12oz $19.99, 1LB $28.99, 2LB $49.99, 5LB $89.99)
3. Explain our tea selection (loose leaf teas at $20.99 for 3oz tins)
4. Describe coffee pods (Mexico, Peru, Bali - 12 pack $19.99)
5. Share information about our charitable mission with the AKT Foundation
6. Help with general inquiries about grinds, brewing, and product availability

IMPORTANT: Use the answerQuestion tool to look up product information from the knowledge base. The knowledge base contains detailed information about all our coffees, teas, pricing, and more.

CRITICAL RULE - TOOL USAGE:
You MUST call the answerQuestion tool BEFORE responding to ANY question about:
- Specific products (which coffees, teas, pods we have)
- Product details (tasting notes, origins, roast levels)
- What products we have or don't have

NEVER say "I don't have" or "we don't have" any product without first calling answerQuestion to check. NEVER guess about product availability. Always look it up first.

When answering product questions:
- Use the answerQuestion tool to get accurate information
- Share tasting notes, roast levels, and origins when relevant
- Mention pricing when asked or when helpful
- Available grinds: Whole Bean, Standard, Espresso, Coarse

Be friendly, warm, and helpful - like a knowledgeable barista. If you can't help with something, offer to transfer to a human.
IMPORTANT: Never use emojis in your responses - this is a voice call and emojis cannot be spoken.`,
    };
    this.handlers = handlers;

    if (!this.opts.apiKey) {
      throw new Error('OpenAIRealtimeClient: OPENAI_API_KEY missing.');
    }
  }

  connect() {
    const url = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(this.opts.model)}`;
    this.ws = new WebSocket(url, {
      headers: {
        Authorization: `Bearer ${this.opts.apiKey}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    });

    this.ws.on('open', () => {
      this.connected = true;
      this.send({
        type: 'session.update',
        session: {
          input_audio_format: { type: 'pcm16', sample_rate: this.opts.inputSampleRate },
          output_audio_format: { type: 'pcm16', sample_rate: this.opts.outputSampleRate },
          turn_detection: this.opts.turnDetection === 'server_vad'
            ? { type: 'server_vad' }
            : { type: 'none' },
          voice: this.opts.voice,
          tools: this.opts.tools,
          instructions: this.opts.instructions,
        },
      });
      this.startHeartbeat();
      this.handlers.onOpen?.();
      logger.info('OpenAI Realtime: connected');
    });

    this.ws.on('message', (data: WebSocket.RawData) => {
      try {
        const evt = JSON.parse(data.toString());
        this.routeEvent(evt);
      } catch (e: any) {
        logger.warn({ err: e }, 'OpenAI Realtime: failed to parse message');
      }
    });

    this.ws.on('close', () => {
      this.connected = false;
      this.stopHeartbeat();
      this.handlers.onClose?.();
      logger.info('OpenAI Realtime: closed');
    });

    this.ws.on('error', (err) => {
      this.handlers.onError?.(err as any);
      logger.error({ err }, 'OpenAI Realtime: error');
    });
  }

  close() {
    try {
      this.stopHeartbeat();
      this.ws?.close();
    } catch {}
    this.connected = false;
  }

  updateSession(patch: Record<string, any>) {
    this.send({ type: 'session.update', session: patch });
  }

  appendAudioBase64(b64Pcm16_16k: string) {
    if (!this.connected) return;
    const payload = { type: 'input_audio_buffer.append', audio: b64Pcm16_16k };
    this.pendingBytes += Buffer.byteLength(b64Pcm16_16k, 'base64');
    this.send(payload);
  }

  commitAndRespond(modalities: Array<'text' | 'audio'> = ['text', 'audio']) {
    if (!this.connected) return;
    this.send({ type: 'input_audio_buffer.commit' });
    this.send({ type: 'response.create', response: { modalities } });
    this.pendingBytes = 0;
  }

  maybeAutoFlush(thresholdBytes = 32000) {
    if (this.pendingBytes >= thresholdBytes) {
      this.commitAndRespond(['text', 'audio']);
    }
  }

  private send(obj: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(obj));
  }

  private routeEvent(evt: any) {
    if (evt.type === 'response.audio.delta' && evt.delta) {
      this.handlers.onAudioDelta?.(evt.delta);
      return;
    }

    if (evt.type === 'response.output_text.delta' && evt.delta) {
      this.handlers.onTextDelta?.(evt.delta);
      return;
    }

    if (evt.type === 'response.completed') {
      this.handlers.onResponseCompleted?.();
      return;
    }

    if (evt.type === 'response.function_call' || evt.type === 'tool.call') {
      const call: ToolCallEvent = {
        id: evt.id,
        name: evt.name,
        tool_name: evt.tool_name,
        arguments: evt.arguments,
        tool_call_id: evt.tool_call_id,
      };
      void this.handleToolCall(call);
      return;
    }
  }

  private async handleToolCall(call: ToolCallEvent) {
    const name = call.name || call.tool_name;
    const args = typeof call.arguments === 'string'
      ? safeParseJson(call.arguments)
      : (call.arguments || {});
    const toolCallId = call.tool_call_id || call.id;

    let output: any = { ok: false, error: `Unhandled tool ${name}` };
    try {
      if (this.handlers.onToolCall) {
        output = await this.handlers.onToolCall({ ...call, arguments: args });
      }
    } catch (e: any) {
      output = { ok: false, error: e?.message || String(e) };
    }

    this.send({
      type: 'tool.output',
      tool_call_id: toolCallId,
      output: JSON.stringify(output),
    });
  }

  private startHeartbeat(intervalMs = 20000) {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      try {
        if (this.connected) {
          this.send({ type: 'session.update', session: { keepalive_at: Date.now() } });
        }
      } catch {}
    }, intervalMs);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }
}

function safeParseJson(s?: string) {
  if (!s) return {};
  try { return JSON.parse(s); } catch { return {}; }
}
