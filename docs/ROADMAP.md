# Roadmap - Mangy Dog Coffee Digital Voice Assistant

## Phase 1: MVP (v0.1)

### Core Features
- Twilio webhook + DTMF fallback menu
- OpenAI Realtime voice conversation
- Product information queries
- Store hours and location
- Subscription information
- Voicemail with transcription
- Human transfer capability
- Basic knowledge base with FAQ

### Admin Features
- Token-protected admin UI
- Product management (CRUD)
- Call log viewing
- Basic analytics

### Success Metrics
- 80%+ of common inquiries resolved without human intervention
- < 600ms average voice response latency
- Zero data loss on voicemails

---

## Phase 2: Enhanced Knowledge & Analytics (v0.2)

### Features
- Expanded knowledge base
- Product catalog integration
- Subscription inquiry capture
- Improved intent detection
- Confidence thresholds with fallback behavior
- Spoken source citations

### Admin Features
- KB article management with auto-indexing
- Intent analytics (top questions, resolution rates)
- Deflection rate tracking
- Citation confidence display
- A/B testing for responses

### Success Metrics
- 90%+ FAQ deflection rate
- Reduced transfer rate to < 20%
- Improved caller satisfaction

---

## Phase 3: Multi-Channel & Notifications (v0.3)

### Features
- SMS bot (text-based assistant)
- Web chat widget for website
- Email autoresponder integration
- [x] Slack notifications for staff
- Subscription reminders

### Admin Features
- Unified inbox for all channels
- Notification preferences
- Automated workflow triggers

### Success Metrics
- 50%+ inquiries via non-voice channels
- < 4 hour response time for all inquiries

---

## Phase 4: Advanced Integrations (v0.4)

### Features
- CRM integration (HubSpot/Salesforce)
- Email marketing integration (Mailchimp)
- Social media auto-posting
- E-commerce integration

### Admin Features
- CRM sync dashboard
- Marketing automation triggers
- Order management

### Success Metrics
- 30%+ increase in repeat customers
- Reduced manual data entry by 80%

---

## Phase 5: Production Hardening (v1.0)

### Security & Compliance
- Data encryption at rest
- Secret rotation automation
- Audit logging
- GDPR/CCPA compliance tools
- Recording consent management

### Reliability
- High availability setup (multi-region)
- Automated failover
- Disaster recovery procedures
- Monitoring and alerting (Datadog/Grafana)
- Synthetic call testing

### Performance
- Auto-scaling for peak times
- CDN for static assets
- Database read replicas
- Redis cluster mode

### Success Metrics
- 99.9% uptime SLA
- < 1% call drop rate
- Zero security incidents

---

## Completed Features (Recent)

### Multi-Language Support (Done)
- [x] 24 languages supported: English, Spanish, German, Chinese (Mandarin), Vietnamese, French, Italian, Portuguese, Japanese, Korean, Arabic, Hindi, Russian, Polish, Dutch, Dutch (Belgium), Ukrainian, Filipino, Tagalog, Nepali, Persian, Galician, Hebrew, Serbian
- [x] Knowledge base content translated for all languages (77+ docs, 90+ chunks)
- [x] SupportedLanguage model in Prisma for language management
- [x] Admin can enable/disable languages per-language
- [x] Language detection uses native names for greeting

### Voices & Languages Admin Page (Done)
- [x] Voice selection UI with 8 OpenAI Realtime voices
- [x] Male/Female voice grouping with avatars (DiceBear avataaars/lorelei)
- [x] Voice descriptions (warm, crisp, smooth, etc.)
- [x] American English accent badge on all voices
- [x] Languages grid showing enabled/disabled status
- [x] KB document count per language
- [x] Persist selectedVoice in BusinessConfig
- [x] Voice selection now used in actual phone calls (mediaServer.ts integration)

### Call Logs Admin Page (Done)
- [x] Separate Caller and Phone columns
- [x] Duration display (Xm Ys format)
- [x] Caller name tracking for test calls
- [x] Proper phone number format (+1XXXXXXXXXX)

### Test Page Improvements (Done)
- [x] Caller name input field (defaults to "Daniel Siemon")
- [x] "(Via AI)" suffix automatically appended
- [x] Duration calculated and saved on call end
- [x] No emojis in AI responses (voice-appropriate)
- [x] Chat window clears on Connect for fresh conversation

### Greeting Config (Done)
- [x] Admin page to configure the AI greeting message
- [x] Greeting stored in BusinessConfig table
- [x] Test page uses greeting from database
- [x] Preview button with OpenAI TTS (same voice as calls)
- [x] Character counter with recommendations

### SMS & Notifications (Done)
- [x] Twilio SMS service (`src/services/sms.ts`)
  - [x] Send ticket confirmation SMS after purchase
  - [x] Send sponsor follow-up SMS after inquiry
  - [x] Event reminder SMS support
  - [x] Voicemail notification SMS support
- [x] Slack notifications (`src/services/notifications.ts`)
  - [x] Notify on ticket purchases
  - [x] Notify on sponsor inquiries
  - [x] Notify on transfer requests
  - [x] Error/alert notifications
  - [x] Daily summary support
- [x] AI `sendTextMessage` tool - AI can send SMS on request
- [x] Non-blocking async notifications (don't slow down calls)

### Dashboard Improvements (Done)
- [x] Phone numbers displayed correctly (not "Unknown")
- [x] Greeting Config link added to sidebar

---

## Future Ideas / Stretch Goals

### Voice & AI Enhancements
- [x] Multi-language support (24 languages!)
- [ ] Voice authentication for returning callers
- [ ] Sentiment analysis during calls
- [ ] Proactive outbound calling (subscription reminders)
- [ ] AI-generated post-call summaries
- [ ] British/regional accent support (requires ElevenLabs or PlayHT)

### Product Enhancements
- [ ] Real-time inventory updates
- [ ] Personalized recommendations based on past orders
- [ ] Seasonal product highlights
- [ ] Subscription management via voice

### Technical Improvements
- [ ] WebRTC browser calling (skip PSTN)
- [ ] Voice cloning for branded sound
- [ ] On-device voice processing
- [ ] Mobile app for staff

---

## Cost Estimates (Monthly)

### Phase 1 (MVP)
- Twilio Voice: ~$50-100 (based on call volume)
- OpenAI API: ~$50-200 (based on usage)
- Hosting (Render/Railway): ~$25-50
- **Total: ~$125-350/month**

### Phase 2+ (With Payments)
- Stripe fees: 2.9% + $0.30 per transaction
- Additional infrastructure: ~$50-100
- **Total: ~$175-500/month + payment fees**

### Phase 6 (Production)
- Multi-region hosting: ~$200-500
- Monitoring tools: ~$50-100
- Security tools: ~$50-100
- **Total: ~$500-1000/month**

---

## Exit Criteria for Each Phase

### MVP → Enhanced Knowledge
- [ ] 100+ successful test calls
- [ ] All FAQ intents working
- [ ] Admin can manage products
- [ ] Stakeholder sign-off

### Enhanced → Multi-Channel
- [ ] 85%+ FAQ resolution rate
- [ ] Analytics dashboard operational
- [ ] KB management workflow tested

### Multi-Channel → Advanced
- [ ] SMS and web chat operational
- [ ] Notification system reliable
- [ ] Cross-channel analytics working

### Advanced → Production
- [ ] CRM integration complete
- [ ] Marketing automation working

### Production (v1.0)
- [ ] 99.9% uptime for 30 days
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Staff training complete

---

## Timeline (Suggested)

| Phase | Duration | Target |
|-------|----------|--------|
| Phase 1 (MVP) | 2-3 weeks | ASAP |
| Phase 2 (Analytics) | 2 weeks | Q1 |
| Phase 3 (Multi-Channel) | 3-4 weeks | Q2 |
| Phase 4 (Integrations) | 4-6 weeks | Q3 |
| Phase 5 (Production) | Ongoing | Q4 |

*Timeline is flexible and depends on resource availability*
