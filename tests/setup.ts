/**
 * Vitest global setup
 *
 * This file runs before all tests.
 * Use it to set up mocks, global state, etc.
 */

import { vi } from 'vitest';

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.TWILIO_ACCOUNT_SID = 'test-account-sid';
process.env.TWILIO_AUTH_TOKEN = 'test-auth-token';
process.env.TWILIO_PHONE_NUMBER = '+15551234567';
process.env.ADMIN_TOKEN = 'test-admin-token';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock Prisma client
vi.mock('../src/db/prisma.js', () => ({
  prisma: {
    knowledgeDoc: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      upsert: vi.fn(),
    },
    knowledgeChunk: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    businessConfig: {
      findFirst: vi.fn(),
    },
    transferConfig: {
      findFirst: vi.fn(),
    },
    callLog: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    intentLog: {
      create: vi.fn(),
    },
    citationsLog: {
      create: vi.fn(),
    },
    languageLog: {
      create: vi.fn(),
    },
    storeInfo: {
      findFirst: vi.fn(),
    },
  },
}));

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }],
      }),
    },
  })),
}));

// Mock Twilio
vi.mock('twilio', () => ({
  default: vi.fn().mockImplementation(() => ({
    calls: vi.fn().mockReturnValue({
      update: vi.fn().mockResolvedValue({ sid: 'test-call-sid' }),
    }),
  })),
}));
