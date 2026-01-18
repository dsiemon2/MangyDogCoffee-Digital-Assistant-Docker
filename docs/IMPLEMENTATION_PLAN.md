# Implementation Plan - Mangy Dog Coffee Digital Voice Assistant

## Goal

Deploy a production voice assistant that allows callers to:
1. Get product information (coffee blends, equipment)
2. Learn about store hours and location
3. Get subscription information
4. Ask general questions via FAQ
5. Leave voicemails or transfer to humans

---

## Milestone 0: Project Setup & Infrastructure

### Tasks
- [ ] Initialize Node.js + TypeScript project
- [ ] Set up ESLint, Prettier, and TypeScript config
- [ ] Create Express server with `/healthz` endpoint
- [ ] Add Docker Compose (Postgres, Redis)
- [ ] Configure Prisma ORM with initial schema
- [ ] Create `.env.example` with all required variables
- [ ] Set up ngrok or public URL configuration

### Acceptance Criteria
- `GET /healthz` returns 200
- Database migrations run successfully
- Docker containers start without errors

---

## Milestone 1: Twilio Integration & Basic IVR

### Tasks
- [ ] Purchase/configure Twilio voice number
- [ ] Implement `/voice` webhook → TwiML greeting
- [ ] Implement `/voice/route` for DTMF menu:
  - Press 1: Product information
  - Press 2: Store hours
  - Press 3: Subscription info
  - Press 0: Speak to someone
- [ ] Implement `/voice/voicemail` callback
- [ ] Set up Twilio status callbacks

### Acceptance Criteria
- Call the number → hear greeting
- DTMF routes work correctly
- Voicemail records and stores transcript

---

## Milestone 2: OpenAI Realtime Voice Integration

### Tasks
- [ ] Enable Twilio Media Streams
- [ ] Implement WebSocket bridge (`/media` endpoint)
- [ ] Configure OpenAI Realtime client:
  - Audio format: μ-law ↔ PCM16/16k conversion
  - Voice: Configure TTS voice
  - Turn detection: Server VAD
- [ ] Wire up basic tools:
  - `getProductInfo()` - Return product details
  - `getStoreHours()` - Return store hours
  - `getSubscriptionInfo()` - Return subscription options
  - `transferToHuman()` - Transfer to live agent
  - `takeVoicemail()` - Record voicemail

### Acceptance Criteria
- Natural voice conversation works
- Tools execute and return correct information
- Barge-in (interruption) works smoothly

---

## Milestone 3: Knowledge Base & FAQ

### Tasks
- [x] Create Prisma models: `KnowledgeDoc`, `KnowledgeChunk`, `SupportedLanguage`
- [x] Build knowledge base indexer (OpenAI text-embedding-3-small)
- [x] Create FAQ markdown files:
  - `products.md` - Coffee blends, equipment
  - `store.md` - Hours, location
  - `subscriptions.md` - Subscription options
  - `about.md` - Company information
  - `contact.md` - Contact information
- [x] Implement `answerQuestion()` tool with retrieval
- [x] Add spoken citations ("According to our FAQ...")
- [x] Multi-language support: 24 languages with translated KB content
- [x] Language detection using native names for greeting

### Acceptance Criteria
- FAQ questions answered with context
- Citations spoken for grounded answers
- Unknown questions handled gracefully
- Multi-language responses supported

---

## Milestone 4: Admin UI

### Tasks
- [x] Create EJS views with Bootstrap styling
- [x] Implement admin routes (token-gated):
  - `/admin` - Dashboard (stats, recent calls)
  - `/admin/calls` - Call logs (caller name, phone, duration, outcome)
  - `/admin/kb` - Knowledge base management
  - `/admin/voices` - Voice selection (8 OpenAI voices) and language management (24 languages)
  - `/admin/greeting` - Greeting configuration with preview
  - `/admin/analytics` - Usage analytics
  - `/admin/settings` - Business configuration
  - `/admin/about` - System information
- [x] Add CRUD operations for knowledge base
- [x] Add call analytics dashboard
- [x] Add voice selection UI with male/female grouping and avatars
- [x] Add greeting config with character counter and browser TTS preview

### Acceptance Criteria
- Admin can manage knowledge base
- Call logs show conversation history with caller name and duration
- Analytics display useful metrics
- Admin can select assistant voice and enable/disable languages
- Admin can customize greeting message

---

## Milestone 5: Background Jobs & Notifications

### Tasks
- [ ] Set up BullMQ queues:
  - `kb-index` - Knowledge base indexing
  - `transcription` - Voicemail STT
  - `notifications` - SMS sending
- [ ] Implement workers for each queue
- [ ] Add Slack/email notifications for:
  - New voicemails
  - Inquiries
- [ ] Add job retry logic and dead-letter handling

### Acceptance Criteria
- KB articles indexed automatically
- Voicemails transcribed in background
- Notifications sent reliably
- Failed jobs visible in admin

---

## Milestone 6: Testing & QA

### Tasks
- [ ] Unit tests for tools and services
- [ ] Integration tests for Twilio webhooks
- [ ] End-to-end call testing:
  - Product inquiry flow
  - Store hours inquiry flow
  - Subscription inquiry flow
  - Transfer to human flow
  - Voicemail flow
- [ ] Edge case testing:
  - Noisy environments
  - Unclear speech
  - Interruptions
  - Timeouts
- [ ] Load testing with synthetic calls

### Acceptance Criteria
- All unit tests pass
- E2E scenarios complete successfully
- Edge cases handled gracefully
- Performance meets latency targets (<600ms)

---

## Data Model (Prisma Schema)

```prisma
model CallLog {
  id          String   @id @default(cuid())
  callSid     String   @unique
  fromNumber  String
  toNumber    String
  startedAt   DateTime @default(now())
  endedAt     DateTime?
  duration    Int?
  callerName  String?
  outcome     String?  // completed, voicemail, transferred
  intents     IntentLog[]
  messages    Message[]
  createdAt   DateTime @default(now())
}

model IntentLog {
  id          String   @id @default(cuid())
  callLogId   String
  callLog     CallLog  @relation(fields: [callLogId], references: [id])
  intent      String
  confidence  Float?
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Message {
  id          String   @id @default(cuid())
  callLogId   String
  callLog     CallLog  @relation(fields: [callLogId], references: [id])
  type        String   // voicemail, inquiry, general
  subject     String?
  body        String
  transcript  String?
  notified    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model KnowledgeDoc {
  id          String   @id @default(cuid())
  title       String
  content     String
  language    String   @default("en")
  chunks      KnowledgeChunk[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model KnowledgeChunk {
  id          String   @id @default(cuid())
  docId       String
  doc         KnowledgeDoc @relation(fields: [docId], references: [id])
  content     String
  embedding   Float[]
  createdAt   DateTime @default(now())
}

model BusinessConfig {
  id              String   @id @default(cuid())
  greeting        String?
  selectedVoice   String   @default("alloy")
  businessHours   Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SupportedLanguage {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  nativeName  String
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

---

## Non-Functional Requirements

### Performance
- Voice response latency: < 600ms end-to-end
- KB retrieval: < 500ms

### Reliability
- Graceful degradation: DTMF fallback if AI fails
- Queue-based processing for resilience

### Security
- HTTPS everywhere
- Secrets in environment variables
- Recording disclosure announcement
- PII minimization in logs

### Compliance
- "This call may be recorded" disclosure
- Caller consent for data collection
- Data retention policies

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Caller accent/noise issues | Use OpenAI VAD, confirm critical details verbally |
| API outages | Fallback to DTMF menu, queue for retry |
| High call volume | Auto-scaling, queue management, capacity limits |

---

## Definition of Done

- [ ] Phone number accepts calls and converses naturally
- [ ] Callers can hear product information
- [ ] Callers can hear store hours
- [ ] Callers can get subscription info
- [ ] Callers can leave voicemail or transfer
- [ ] Admin can manage knowledge base and view analytics
- [ ] All documentation complete
