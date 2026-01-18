# Mangy Dog Coffee Digital Voice Assistant

**Production Domain:** aida.MangyDogCoffee.com

A production-ready **digital voice assistant** for Mangy Dog Coffee. Callers can ask about products, coffee subscriptions, store hours, learn about the coffee roasting process, and more - all through natural voice conversation.

## About Mangy Dog Coffee

Mangy Dog Coffee is a specialty coffee roaster dedicated to sourcing and roasting the finest coffee beans from around the world. We offer whole bean and ground coffee, brewing equipment, subscriptions, and merchandise.

---

## Features

### Core Voice Capabilities
- **Product Information**: "What coffee blends do you offer?" / "Tell me about your dark roast"
- **Store Hours**: "What are your hours?" / "Are you open on Sunday?"
- **Subscription Info**: Learn about coffee subscription options and benefits
- **Ordering Help**: Information about ordering online or in-store
- **FAQ Answering**: Knowledge base retrieval with spoken citations
- **Human Transfer**: Connect to a live person when needed
- **Voicemail**: Leave a message if no one is available

### Technical Features
- **Telephony**: Twilio Programmable Voice (TwiML + Media Streams)
- **Voice AI**: OpenAI Realtime API (low-latency STT <-> LLM <-> TTS)
- **Multi-Language**: 24 languages with translated knowledge base content
- **Voice Selection**: 8 OpenAI voices (male/female) configurable via admin UI
- **Knowledge Base**: Embedded FAQ with retrieval and citations
- **Admin UI**: Manage products, FAQ, voices, languages, view analytics
- **Background Jobs**: BullMQ for async processing
- **Stack**: Node.js 20+, TypeScript, Express, Prisma/Postgres, Redis

---

## Voice Commands Supported

### Product Inquiries
- "What coffee blends do you offer?"
- "Tell me about your dark roast"
- "Do you have decaf?"
- "What's your most popular coffee?"
- "Do you sell brewing equipment?"

### Store Information
- "What are your hours?"
- "Where are you located?"
- "Are you open today?"
- "What time do you close?"

### Subscriptions
- "Tell me about subscriptions"
- "How does the coffee subscription work?"
- "Can I pause my subscription?"
- "What subscription options are available?"

### General
- "How can I contact you?"
- "I'd like to speak to someone"
- "Leave a message"

---

## Prerequisites

- **Twilio Account** with Voice-enabled phone number
- **OpenAI API Key** with Realtime API access
- **Docker** (recommended) OR Node.js 20+ with PostgreSQL + Redis
- **ngrok** or public server for Twilio webhooks

---

## Quick Start

```bash
# Clone and setup
cd C:\MangyDogCoffee-Digital-Assistant
cp .env.example .env
# Fill in your API keys (see SETUP_GUIDE.md)

# Start services with Docker
docker compose --profile db --profile redis up -d

# Install and migrate
npm install
npx prisma migrate dev
npm run seed

# Run application
npm run dev          # Web server (terminal 1)
npm run worker       # Background jobs (terminal 2)

# Expose webhooks (terminal 3)
ngrok http 3000
```

Configure your Twilio number:
- **Voice Webhook (POST)**: `https://<ngrok-url>/voice`
- **Status Callback (POST)**: `https://<ngrok-url>/voice/status`

---

## Environment Variables

See `.env.example` for full list. Key variables:

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_VOICE_NUMBER=+1xxxxxxxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview
OPENAI_TTS_VOICE=alloy

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mangydogcoffee
REDIS_URL=redis://localhost:6379

# Admin
ADMIN_TOKEN=your-secure-token
PUBLIC_BASE_URL=https://your-ngrok-url
```

---

## Supported Languages

The assistant supports 24 languages with translated knowledge base content:

| Language | Native Name | Flag |
|----------|-------------|------|
| English | English | US |
| Spanish | Espanol | ES |
| German | Deutsch | DE |
| Chinese (Mandarin) | Zhongwen | CN |
| Vietnamese | Tieng Viet | VN |
| French | Francais | FR |
| Italian | Italiano | IT |
| Portuguese | Portugues | BR |
| Japanese | Nihongo | JP |
| Korean | Hangugeo | KR |
| Arabic | Arabi | SA |
| Hindi | Hindi | IN |
| Russian | Russkiy | RU |
| Polish | Polski | PL |
| Dutch | Nederlands | NL |
| Dutch (Belgium) | Nederlands (Belgie) | BE |
| Ukrainian | Ukrainska | UA |
| Filipino | Filipino | PH |
| Tagalog | Tagalog | PH |
| Nepali | Nepali | NP |
| Persian | Farsi | IR |
| Galician | Galego | ES |
| Hebrew | Ivrit | IL |
| Serbian | Srpski | RS |

---

## Admin Interface

Access at: `https://<host>/admin?token=YOUR_TOKEN`

- **Dashboard**: Overview stats, recent calls
- **Call Logs**: View call history, caller info, duration, transcripts
- **Knowledge Base**: Add/edit FAQ content (across 24 languages)
- **Voices & Languages**: Select from 8 OpenAI voices, enable/disable 24 languages
- **Greeting Config**: Customize the AI assistant's greeting message with preview
- **Analytics**: Call volume, popular intents
- **Settings**: Business configuration, confidence thresholds
- **About**: System information

---

## Project Structure

```
mangydogcoffee-assistant/
├── src/
│   ├── server.ts              # Express bootstrap
│   ├── routes/
│   │   ├── twilioWebhook.ts   # /voice endpoints
│   │   └── admin.ts           # Admin UI routes
│   ├── realtime/
│   │   ├── mediaServer.ts     # Twilio <-> OpenAI bridge
│   │   ├── openaiRealtime.ts  # OpenAI client
│   │   └── toolRegistry.ts    # Voice assistant tools
│   ├── services/
│   │   ├── kb.ts              # Knowledge base
│   │   └── ...
│   ├── queues/
│   │   └── worker.ts          # Background jobs
│   └── db/
│       └── schema.prisma      # Database schema
├── kb/                        # Knowledge base markdown files
├── views/                     # Admin UI templates
├── docs/                      # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Documentation

- [README.md](README.md) - This file
- [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) - Step-by-step implementation guide
- [ROADMAP.md](docs/ROADMAP.md) - Future features and phases
- [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) - Twilio, OpenAI setup instructions
- [KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md) - FAQ content for voice assistant
- [Q&A_RECOMMENDATIONS.md](docs/Q&A_RECOMMENDATIONS.md) - Recommended Q&A pairs

---

## Support

- **Website**: https://mangydogcoffee.com
- **Contact**: https://mangydogcoffee.com/contact

---

## License

MIT License - Built for Mangy Dog Coffee

---

## Acknowledgments

Built using the Digital Voice Receptionist framework.
