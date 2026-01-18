# Agent Implementation - MangyDogCoffee Digital Assistant

## Project Overview

**Type**: Voice Receptionist (Twilio + OpenAI Realtime)
**Purpose**: Coffee shop voice assistant for inbound calls, menu info, and routing

## Tech Stack

```
Backend:     Node.js + Express + TypeScript
Database:    PostgreSQL + Prisma ORM
Queue:       BullMQ (background jobs)
Cache:       Redis
Telephony:   Twilio Programmable Voice
Voice AI:    OpenAI Realtime API
Frontend:    EJS templates + Bootstrap 5
Container:   Docker + Docker Compose
```

## Key Components

- `src/realtime/toolRegistry.ts` - Voice assistant tools
- `src/realtime/mediaServer.ts` - Media streaming bridge
- `src/routes/` - Admin API routes
- `prisma/schema.prisma` - Database schema

---

## Recommended Agents

### MUST IMPLEMENT (Priority 1)

| Agent | File | Use Case |
|-------|------|----------|
| **Backend Architect** | engineering/backend-architect.md | WebSocket architecture, API design, Twilio webhook handling |
| **DevOps Automator** | engineering/devops-automator.md | Docker, Redis, BullMQ, PostgreSQL container management |
| **AI Engineer** | engineering/ai-engineer.md | OpenAI Realtime API integration, voice tool implementation |
| **Database Admin** | data/database-admin.md | PostgreSQL optimization, Prisma migrations, call logging schema |
| **Security Auditor** | security/security-auditor.md | Twilio webhook validation, API authentication, Redis security |
| **Bug Debugger** | quality/bug-debugger.md | Real-time call debugging, WebSocket issues, audio problems |

### SHOULD IMPLEMENT (Priority 2)

| Agent | File | Use Case |
|-------|------|----------|
| **API Tester** | testing/api-tester.md | Twilio callback testing, admin API validation |
| **Performance Benchmarker** | testing/performance-benchmarker.md | Real-time latency optimization, Redis caching |
| **Infrastructure Maintainer** | studio-operations/infrastructure-maintainer.md | BullMQ monitoring, Redis health, container health |
| **Code Reviewer** | quality/code-reviewer.md | TypeScript best practices, async patterns |
| **UI Designer** | design/ui-designer.md | Admin dashboard improvements |

### COULD IMPLEMENT (Priority 3)

| Agent | File | Use Case |
|-------|------|----------|
| **Workflow Optimizer** | testing/workflow-optimizer.md | Call flow optimization |
| **Analytics Reporter** | studio-operations/analytics-reporter.md | Call analytics, usage metrics |
| **Content Creator** | marketing/content-creator.md | Knowledge base content, FAQ updates |

---

## Agent Prompts Tailored for This Project

### Backend Architect Prompt Addition
```
Project Context:
- Voice receptionist for coffee shop
- Twilio handles inbound calls, streams audio to OpenAI Realtime API
- BullMQ processes background jobs (transcription, logging)
- Redis caches session state and knowledge base
- Key files: src/realtime/toolRegistry.ts, src/realtime/mediaServer.ts
```

### AI Engineer Prompt Addition
```
Project Context:
- OpenAI Realtime API for voice interaction
- Tool registry pattern for voice commands (get_menu, transfer_call, take_message)
- Media streaming via WebSocket bridge
- 24-language knowledge base support
- Voice configuration stored in database
```

### DevOps Prompt Addition
```
Project Context:
- Services: app, postgres, redis, bullmq-worker
- Twilio webhook endpoints need HTTPS (use ngrok for dev)
- BullMQ dashboard available for job monitoring
- Redis used for sessions and caching
```

---

## Marketing & Growth Agents (When Production Ready)

Add these when the project is ready for public release/marketing:

### Social Media & Marketing

| Agent | File | Use Case |
|-------|------|----------|
| **TikTok Strategist** | marketing/tiktok-strategist.md | Coffee shop content, behind-the-scenes |
| **Instagram Curator** | marketing/instagram-curator.md | Coffee aesthetics, shop vibes |
| **Twitter/X Engager** | marketing/twitter-engager.md | Local community engagement |
| **Reddit Community Builder** | marketing/reddit-community-builder.md | r/coffee, local subreddits |
| **Content Creator** | marketing/content-creator.md | Menu descriptions, knowledge base |
| **SEO Optimizer** | marketing/seo-optimizer.md | Local SEO, "coffee shop near me" |
| **Visual Storyteller** | design/visual-storyteller.md | Coffee photography, shop ambiance |

### Growth & Analytics

| Agent | File | Use Case |
|-------|------|----------|
| **Growth Hacker** | marketing/growth-hacker.md | Local customer acquisition |
| **Trend Researcher** | product/trend-researcher.md | Coffee industry trends |
| **Finance Tracker** | studio-operations/finance-tracker.md | Call volume ROI, cost per call |
| **Analytics Reporter** | studio-operations/analytics-reporter.md | Call metrics, customer satisfaction |

---

## Not Recommended for This Project

| Agent | Reason |
|-------|--------|
| Mobile App Builder | No mobile app |
| Frontend Developer | Minimal frontend (admin only) |

---

## Implementation Commands

```bash
# Invoke agents from project root
claude --agent engineering/backend-architect
claude --agent engineering/devops-automator
claude --agent engineering/ai-engineer
claude --agent data/database-admin
claude --agent security/security-auditor
claude --agent quality/bug-debugger
```
