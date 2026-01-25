/**
 * Tool Registry Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../../src/db/prisma.js';

// Mock the services
vi.mock('../../../src/services/kb.js', () => ({
  askKB: vi.fn().mockResolvedValue({
    context: 'Test context',
    sources: [{ title: 'Test Doc', score: 0.9, confidence: 1.0 }],
  }),
}));

vi.mock('../../../src/services/booking.js', () => ({
  createBookingLink: vi.fn().mockResolvedValue({
    booked: false,
    mode: 'link',
    link: 'https://booking.example.com/test',
  }),
}));

vi.mock('../../../src/services/sms.js', () => ({
  sendSMS: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('../../../src/services/notifications.js', () => ({
  notifyTransferRequest: vi.fn().mockResolvedValue(undefined),
}));

describe('Tool Registry - Tool Specifications', () => {
  it('should have required tools defined', async () => {
    const { toolSpecs } = await import('../../../src/realtime/toolRegistry.js');

    const toolNames = toolSpecs.map((t: { name: string }) => t.name);

    expect(toolNames).toContain('getAboutInfo');
    expect(toolNames).toContain('transferToHuman');
    expect(toolNames).toContain('bookAppointment');
    expect(toolNames).toContain('takeMessage');
    expect(toolNames).toContain('answerQuestion');
    expect(toolNames).toContain('sendTextMessage');
  });

  it('should have valid tool schemas', async () => {
    const { toolSpecs } = await import('../../../src/realtime/toolRegistry.js');

    for (const spec of toolSpecs) {
      expect(spec).toHaveProperty('name');
      expect(spec).toHaveProperty('description');
      expect(spec).toHaveProperty('input_schema');
      expect(spec.input_schema).toHaveProperty('type', 'object');
    }
  });

  it('answerQuestion should require question parameter', async () => {
    const { toolSpecs } = await import('../../../src/realtime/toolRegistry.js');
    const answerTool = toolSpecs.find((t: { name: string }) => t.name === 'answerQuestion');

    expect(answerTool?.input_schema.required).toContain('question');
  });

  it('sendTextMessage should require to and message parameters', async () => {
    const { toolSpecs } = await import('../../../src/realtime/toolRegistry.js');
    const smsTool = toolSpecs.find((t: { name: string }) => t.name === 'sendTextMessage');

    expect(smsTool?.input_schema.required).toContain('to');
    expect(smsTool?.input_schema.required).toContain('message');
  });
});

describe('Tool Registry - getAboutInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return organization info', async () => {
    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.getAboutInfo();

    expect(result).toHaveProperty('ok', true);
    expect(result).toHaveProperty('organization', 'Mangy Dog Coffee');
    expect(result).toHaveProperty('beneficiary', 'AKT Foundation');
    expect(result).toHaveProperty('mission');
    expect(result.mission).toContain('10%');
  });
});

describe('Tool Registry - setLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set language and return ok', async () => {
    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.setLanguage({ lang: 'es' });

    expect(result).toHaveProperty('ok', true);
    expect(result).toHaveProperty('lang', 'es');
  });

  it('should default to en if no language provided', async () => {
    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.setLanguage({ lang: '' });

    expect(result.lang).toBe('en');
  });

  it('should truncate long language codes', async () => {
    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.setLanguage({ lang: 'en-US-extra' });

    expect(result.lang.length).toBeLessThanOrEqual(5);
  });
});

describe('Tool Registry - getPolicy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default policy when no config exists', async () => {
    vi.mocked(prisma.businessConfig.findFirst).mockResolvedValue(null);

    const { tools } = await import('../../../src/realtime/toolRegistry.js');
    const result = await tools.getPolicy();

    expect(result).toHaveProperty('kbMinConfidence', 0.55);
    expect(result).toHaveProperty('lowConfidenceAction', 'ask_clarify');
  });

  it('should return configured policy values', async () => {
    vi.mocked(prisma.businessConfig.findFirst).mockResolvedValue({
      id: 'default',
      organizationName: 'Test',
      hoursJson: '{}',
      address: '',
      selectedVoice: 'alloy',
      greeting: '',
      kbMinConfidence: 0.7,
      lowConfidenceAction: 'transfer',
    } as any);

    const { tools } = await import('../../../src/realtime/toolRegistry.js');
    const result = await tools.getPolicy();

    expect(result.kbMinConfidence).toBe(0.7);
    expect(result.lowConfidenceAction).toBe('transfer');
  });
});

describe('Tool Registry - takeMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a message ticket', async () => {
    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.takeMessage({
      subject: 'Test Subject',
      details: 'Test details',
      contact: '+15551234567',
    });

    expect(result).toHaveProperty('ok', true);
    expect(result).toHaveProperty('ticketId');
    expect(result.ticketId).toMatch(/^MSG-/);
    expect(result).toHaveProperty('captured');
    expect(result.captured.subject).toBe('Test Subject');
  });
});

describe('Tool Registry - handleToolCall', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute known tools', async () => {
    const { handleToolCall } = await import('../../../src/realtime/toolRegistry.js');

    const result = await handleToolCall('getAboutInfo', {});

    expect(result).toHaveProperty('ok', true);
    expect(result).toHaveProperty('organization');
  });

  it('should return error for unknown tools', async () => {
    const { handleToolCall } = await import('../../../src/realtime/toolRegistry.js');

    const result = await handleToolCall('unknownTool', {});

    expect(result).toHaveProperty('error');
    expect(result.error).toContain('Unknown tool');
  });
});

describe('Tool Registry - transferToHuman', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return transfer action without callSid', async () => {
    vi.mocked(prisma.transferConfig.findFirst).mockResolvedValue(null);

    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.transferToHuman({
      reason: 'Customer requested',
      callerPhone: '+15551234567',
    });

    expect(result).toHaveProperty('ok', true);
    expect(result).toHaveProperty('action', 'TRANSFER');
    expect(result).toHaveProperty('reason', 'Customer requested');
  });

  it('should return error when no transfer number configured', async () => {
    vi.mocked(prisma.transferConfig.findFirst).mockResolvedValue(null);

    // Clear the env var for this test
    const originalEnv = process.env.TWILIO_AGENT_TRANSFER_NUMBER;
    delete process.env.TWILIO_AGENT_TRANSFER_NUMBER;

    const { tools } = await import('../../../src/realtime/toolRegistry.js');

    const result = await tools.transferToHuman({
      reason: 'Test',
      callSid: 'CA123',
    });

    // Restore env var
    process.env.TWILIO_AGENT_TRANSFER_NUMBER = originalEnv;

    expect(result).toHaveProperty('ok', false);
    expect(result).toHaveProperty('error');
  });
});
