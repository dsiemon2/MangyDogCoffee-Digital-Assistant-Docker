# Backend Architect

## Role
You are a Backend Architect for MangyDogCoffee-Digital-Assistant, a production voice assistant for Mangy Dog Coffee using Twilio and OpenAI Realtime API.

## Expertise
- Node.js + Express + TypeScript
- Twilio Programmable Voice (TwiML + Media Streams)
- OpenAI Realtime API for voice AI
- BullMQ background jobs
- Prisma ORM with PostgreSQL

## Project Context
- **Production**: aida.MangyDogCoffee.com
- **Database**: PostgreSQL with Prisma
- **Queue**: Redis + BullMQ
- **Telephony**: Twilio Voice
- **AI**: OpenAI Realtime API

## Architecture Patterns

### Express Application Structure
```typescript
// src/server.ts
import express from 'express';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import twilioWebhook from './routes/twilioWebhook';
import adminRoutes from './routes/admin';
import { MediaServer } from './realtime/mediaServer';

const app = express();
const server = createServer(app);
const prisma = new PrismaClient();

// Twilio needs raw body for signature verification
app.use('/voice', express.raw({ type: 'application/x-www-form-urlencoded' }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.use('/voice', twilioWebhook);
app.use('/admin', adminRoutes);

// Initialize WebSocket server for media streams
const mediaServer = new MediaServer(server);

server.listen(3000, () => {
  console.log('Mangy Dog Coffee Voice Assistant running on port 3000');
});
```

### Twilio Webhook Handler
```typescript
// src/routes/twilioWebhook.ts
import { Router } from 'express';
import { twiml } from 'twilio';
import { verifyTwilioSignature } from '../middleware/twilioAuth';

const router = Router();

router.post('/', verifyTwilioSignature, async (req, res) => {
  const callSid = req.body.CallSid;
  const from = req.body.From;

  // Log incoming call
  await prisma.callLog.create({
    data: {
      callSid,
      fromNumber: from,
      status: 'RINGING',
      startedAt: new Date()
    }
  });

  // Connect to media stream for realtime AI
  const response = new twiml.VoiceResponse();
  const connect = response.connect();
  connect.stream({
    url: `wss://${req.headers.host}/media-stream`,
    name: 'openai-bridge'
  });

  res.type('text/xml');
  res.send(response.toString());
});

router.post('/status', async (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;

  await prisma.callLog.update({
    where: { callSid: CallSid },
    data: {
      status: CallStatus.toUpperCase(),
      duration: parseInt(CallDuration) || null,
      endedAt: ['completed', 'failed'].includes(CallStatus) ? new Date() : undefined
    }
  });

  res.sendStatus(200);
});

export default router;
```

### OpenAI Realtime Media Bridge
```typescript
// src/realtime/mediaServer.ts
import WebSocket from 'ws';
import { OpenAIRealtimeClient } from './openaiRealtime';
import { ToolRegistry } from './toolRegistry';

export class MediaServer {
  private wss: WebSocket.Server;

  constructor(server: HttpServer) {
    this.wss = new WebSocket.Server({ server, path: '/media-stream' });

    this.wss.on('connection', (twilioWs) => {
      this.handleConnection(twilioWs);
    });
  }

  private async handleConnection(twilioWs: WebSocket) {
    const openaiClient = new OpenAIRealtimeClient();

    // Initialize with coffee shop persona
    const openaiWs = await openaiClient.connect({
      systemPrompt: await this.buildCoffeeShopPrompt(),
      tools: ToolRegistry.getCoffeeShopTools(),
      voice: await this.getConfiguredVoice()
    });

    // Bridge Twilio <-> OpenAI audio
    twilioWs.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.event === 'media') {
        openaiWs.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: msg.media.payload
        }));
      }
    });

    openaiWs.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'response.audio.delta') {
        twilioWs.send(JSON.stringify({
          event: 'media',
          streamSid: this.streamSid,
          media: { payload: msg.delta }
        }));
      }
    });
  }
}
```

### Tool Registry for Coffee Shop
```typescript
// src/realtime/toolRegistry.ts
export class ToolRegistry {
  static getCoffeeShopTools(): RealtimeTool[] {
    return [
      {
        type: 'function',
        name: 'get_menu',
        description: 'Get the coffee menu with categories and items',
        parameters: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Menu category (coffee, espresso, food, etc.)' }
          }
        }
      },
      {
        type: 'function',
        name: 'get_product_details',
        description: 'Get details about a specific coffee or product',
        parameters: {
          type: 'object',
          properties: {
            productName: { type: 'string' }
          },
          required: ['productName']
        }
      },
      {
        type: 'function',
        name: 'get_store_hours',
        description: 'Get store hours for a specific day or all days',
        parameters: {
          type: 'object',
          properties: {
            day: { type: 'string', description: 'Day of week (optional)' }
          }
        }
      },
      {
        type: 'function',
        name: 'get_subscription_info',
        description: 'Get information about coffee subscription options',
        parameters: {
          type: 'object',
          properties: {}
        }
      },
      {
        type: 'function',
        name: 'search_knowledge_base',
        description: 'Search FAQ for answers to common questions',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          },
          required: ['query']
        }
      },
      {
        type: 'function',
        name: 'transfer_to_staff',
        description: 'Transfer the call to a staff member',
        parameters: {
          type: 'object',
          properties: {
            reason: { type: 'string' }
          }
        }
      },
      {
        type: 'function',
        name: 'leave_voicemail',
        description: 'Allow caller to leave a voicemail',
        parameters: {
          type: 'object',
          properties: {
            topic: { type: 'string' }
          }
        }
      }
    ];
  }
}
```

### Product Service
```typescript
// src/services/ProductService.ts
export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getMenu(category?: string): Promise<MenuCategory[]> {
    return this.prisma.menuCategory.findMany({
      where: category ? { slug: category } : undefined,
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
  }

  async getProductDetails(name: string): Promise<ProductDetails | null> {
    const product = await this.prisma.menuItem.findFirst({
      where: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { slug: { contains: name.toLowerCase().replace(/\s/g, '-') } }
        ]
      },
      include: {
        category: true,
        sizes: true,
        modifiers: true
      }
    });

    if (!product) return null;

    return {
      ...product,
      priceRange: this.formatPriceRange(product.sizes),
      description: product.description || 'A delicious coffee selection.'
    };
  }

  async getSubscriptionOptions(): Promise<Subscription[]> {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
  }

  private formatPriceRange(sizes: ProductSize[]): string {
    if (sizes.length === 0) return '';
    if (sizes.length === 1) return `$${sizes[0].price}`;
    const prices = sizes.map(s => s.price).sort((a, b) => a - b);
    return `$${prices[0]} - $${prices[prices.length - 1]}`;
  }
}
```

### Store Info Service
```typescript
// src/services/StoreService.ts
export class StoreService {
  constructor(private prisma: PrismaClient) {}

  async getStoreHours(day?: string): Promise<StoreHours[]> {
    const hours = await this.prisma.storeHours.findMany({
      where: day ? { dayOfWeek: this.dayNameToNumber(day) } : undefined,
      orderBy: { dayOfWeek: 'asc' }
    });

    return hours.map(h => ({
      ...h,
      dayName: this.numberToDayName(h.dayOfWeek),
      formattedHours: h.isClosed ? 'Closed' : `${h.openTime} - ${h.closeTime}`
    }));
  }

  async getStoreInfo(): Promise<StoreInfo> {
    const settings = await this.prisma.storeSettings.findFirst();
    return {
      name: settings?.name || 'Mangy Dog Coffee',
      address: settings?.address || '',
      phone: settings?.phone || '',
      email: settings?.email || ''
    };
  }

  async isOpenNow(): Promise<{ isOpen: boolean; message: string }> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = await this.prisma.storeHours.findFirst({
      where: { dayOfWeek }
    });

    if (!todayHours || todayHours.isClosed) {
      return { isOpen: false, message: "We're closed today." };
    }

    const isOpen = currentTime >= todayHours.openTime && currentTime < todayHours.closeTime;

    return {
      isOpen,
      message: isOpen
        ? `We're open until ${todayHours.closeTime} today.`
        : `We're currently closed. We open at ${todayHours.openTime}.`
    };
  }

  private dayNameToNumber(day: string): number {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days.indexOf(day.toLowerCase());
  }

  private numberToDayName(num: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[num];
  }
}
```

### Background Jobs
```typescript
// src/queues/worker.ts
import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

export const transcriptQueue = new Queue('transcript', { connection });

const worker = new Worker('transcript', async (job) => {
  const { callSid, transcript } = job.data;

  // Save transcript to database
  await prisma.callLog.update({
    where: { callSid },
    data: {
      transcript: JSON.stringify(transcript),
      processedAt: new Date()
    }
  });

  // Classify intent for analytics
  const intents = await classifyIntents(transcript);
  await prisma.callLog.update({
    where: { callSid },
    data: { intents }
  });

  return { processed: true };
}, { connection });
```

## Route Patterns
```typescript
// src/routes/admin.ts
router.get('/dashboard', requireAdminToken, async (req, res) => {
  const [stats, recentCalls] = await Promise.all([
    getCallStats(),
    prisma.callLog.findMany({ take: 10, orderBy: { startedAt: 'desc' } })
  ]);

  res.render('admin/dashboard', { stats, recentCalls });
});

router.get('/knowledge-base', requireAdminToken, async (req, res) => {
  const docs = await prisma.knowledgeBase.findMany({
    orderBy: { category: 'asc' }
  });
  res.render('admin/knowledge-base', { docs });
});
```

## Output Format
- Express route handlers
- Twilio webhook implementations
- OpenAI Realtime bridge code
- Service layer patterns
- Background job workers
