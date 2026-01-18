# AI Digital Voice Assistant - "Sell Me A Pen" Mode Toggle

> **Document Purpose:** Detailed specification for the dual-mode "Sell Me A Pen" voice assistant feature, allowing users to either be sold to by AI or practice their sales pitch against AI.

> **Last Updated:** December 2025

---

## Table of Contents

1. [Concept Overview](#concept-overview)
2. [Mode Definitions](#mode-definitions)
3. [Voice AI Technology Options](#voice-ai-technology-options)
4. [True AI vs Scripted Responses](#true-ai-vs-scripted-responses)
5. [User Interface](#user-interface)
6. [Conversation Flows](#conversation-flows)
7. [AI Behavior Specifications](#ai-behavior-specifications)
8. [LLM System Prompts](#llm-system-prompts)
9. [Technical Requirements](#technical-requirements)
10. [Scoring & Feedback (User Sells Mode)](#scoring--feedback-user-sells-mode)
11. [Use Cases](#use-cases)
12. [Future Enhancements](#future-enhancements)

---

## Concept Overview

The "Sell Me A Pen" challenge is a classic sales training exercise made famous by the movie "The Wolf of Wall Street." This feature transforms it into an interactive voice experience with two distinct modes:

| Mode | Who Sells | Who Buys | Purpose |
|------|-----------|----------|---------|
| **AI Sells** | AI Agent | Human User | Entertainment, product discovery, demo AI capabilities |
| **User Sells** | Human User | AI Agent | Sales training, practice, skill development |

### The Toggle

A simple switch allows users to flip between modes before starting a session:

```
┌─────────────────────────────────────────┐
│         SELL ME A PEN                   │
│                                         │
│   ○ AI Sells the Pen                    │
│   ● User Sells the Pen                  │
│                                         │
│         [Start Session]                 │
└─────────────────────────────────────────┘
```

---

## Mode Definitions

### Mode 1: AI Sells the Pen

**Description:** The AI takes on the role of a salesperson attempting to sell a pen (or other product) to the user.

**Flow:**
1. AI delivers greeting
2. AI waits for user to say "Sell me a pen" (or variation)
3. AI performs sales pitch
4. User can interact, object, negotiate
5. Session ends with sale or rejection

**Target Audience:**
- Curious visitors wanting to see AI in action
- Potential customers exploring products
- Entertainment seekers

---

### Mode 2: User Sells the Pen

**Description:** The user takes on the role of salesperson, and the AI becomes a potential customer with varying personalities and objection styles.

**Flow:**
1. AI delivers greeting
2. AI says "Sell me a pen"
3. User performs their sales pitch
4. AI responds as customer (with objections, questions, interest)
5. Session ends with AI "buying" or rejecting
6. AI provides feedback/score on user's performance

**Target Audience:**
- Sales professionals practicing pitches
- Students learning sales techniques
- Job candidates preparing for interviews
- Anyone wanting to improve persuasion skills

---

## Voice AI Technology Options

### Option 1: OpenAI Realtime API (Recommended)

**What it is:** Native voice-to-voice AI - no separate STT/TTS needed. The model hears and speaks directly.

**Pros:**
- Already in your tech stack
- Ultra-low latency (~300ms response time)
- Natural conversation flow with interruption handling
- Native voice understanding (tone, emotion, pace)
- Single API for everything - simpler architecture
- Supports function calling for actions (add to cart, lookup products)

**Cons:**
- Cost: ~$0.06/minute for audio input, ~$0.24/minute for audio output
- Requires WebSocket connection (more complex than REST)
- Limited voice customization (preset voices only)
- OpenAI dependency

**Best For:** Real-time conversational experiences where latency matters

---

### Option 2: Claude + ElevenLabs

**What it is:** Anthropic Claude for intelligence + ElevenLabs for voice synthesis + Deepgram/Whisper for speech recognition.

**Pros:**
- Claude excels at nuanced conversation and roleplay
- ElevenLabs offers highly customizable, natural voices
- Can clone custom brand voices
- More control over each component
- Claude's longer context window for complex conversations

**Cons:**
- Higher latency (STT → LLM → TTS pipeline adds ~1-2 seconds)
- More complex architecture (3 services to manage)
- Higher combined cost
- Interruption handling is harder

**Best For:** When voice quality/branding is critical, or you need Claude's specific capabilities

---

### Option 3: Groq + Deepgram + PlayHT

**What it is:** Groq for ultra-fast LLM inference + Deepgram for STT + PlayHT for TTS.

**Pros:**
- Groq is extremely fast (~10x faster than GPT-4)
- Lower cost than OpenAI
- Deepgram has excellent real-time STT
- PlayHT offers good voice quality

**Cons:**
- Groq models (Llama, Mixtral) less capable than GPT-4/Claude for complex roleplay
- Still a multi-service pipeline
- Less ecosystem maturity

**Best For:** Cost-conscious implementations where speed matters more than sophistication

---

### Option 4: Hume AI

**What it is:** Emotion-aware AI specifically designed for voice conversations.

**Pros:**
- Detects user emotions in real-time (frustration, interest, confusion)
- Can adjust AI tone based on user emotion
- Purpose-built for empathetic conversations
- Great for sales training (can detect when user is losing interest)

**Cons:**
- Newer platform, less mature
- More limited customization
- May be overkill for simple use cases

**Best For:** When emotional intelligence in the conversation matters

---

### Technology Comparison Table

| Feature | OpenAI Realtime | Claude + ElevenLabs | Groq Stack | Hume AI |
|---------|-----------------|---------------------|------------|---------|
| Latency | ~300ms | ~1-2 sec | ~500ms | ~400ms |
| Voice Quality | Good | Excellent | Good | Good |
| Conversation IQ | Excellent | Excellent | Good | Good |
| Emotion Detection | No | No | No | Yes |
| Cost/minute | ~$0.30 | ~$0.40 | ~$0.15 | ~$0.35 |
| Complexity | Low | High | Medium | Low |
| Custom Voices | No | Yes | Yes | Limited |

### Recommendation

**For your use case:** Start with **OpenAI Realtime API** because:
1. Already in your stack - faster to implement
2. Low latency is critical for natural sales conversations
3. Interruption handling works out of the box
4. Single integration vs. managing 3 services

Consider **Hume AI** for future enhancement if you want emotion-aware scoring (detect when user sounds confident vs. nervous).

---

## True AI vs Scripted Responses

> **CRITICAL:** This system must be powered by true conversational AI, NOT scripted tenant/response patterns like basic Alexa skills.

### What This System Is NOT (Alexa/Scripted Approach)

| Scripted Pattern | Why It's Bad |
|------------------|--------------|
| ❌ Keyword matching: "If user says X, respond with Y" | Brittle, can't handle variations |
| ❌ Decision trees: Pre-defined conversation paths | Unnatural, repetitive |
| ❌ Random response selection: Pick from canned replies | Users notice it's fake |
| ❌ Intent classification: Map to "greeting", "objection", "close" | Loses nuance and context |
| ❌ Slot filling: Extract values to fill templates | Robotic interactions |

### What This System IS (True Conversational AI)

| AI Pattern | Why It's Better |
|------------|-----------------|
| ✅ LLM-powered: Every response generated in real-time | Dynamic, never repetitive |
| ✅ Context-aware: Remembers entire conversation | Builds naturally, references earlier points |
| ✅ Adaptive: Adjusts approach based on user | Feels like talking to a human |
| ✅ Understands nuance: Gets subtext, sarcasm, hesitation | Responds appropriately to tone |
| ✅ Creative: Can improvise, joke, pivot | Engaging and unpredictable |

### Architecture: How True AI Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRUE AI CONVERSATION LOOP                         │
└─────────────────────────────────────────────────────────────────────┘

   User speaks
        │
        ▼
┌───────────────────┐
│  Voice Input      │  ← OpenAI Realtime (native) or Deepgram STT
└───────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────┐
│                         LLM PROCESSING                             │
│                                                                    │
│  INPUTS:                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 1. System Prompt (persona, rules, product knowledge)        │  │
│  │ 2. Full Conversation History (maintains context)            │  │
│  │ 3. Current User Message (what they just said)               │  │
│  │ 4. Session Metadata (mode, difficulty, product, brand)      │  │
│  │ 5. Product Database (real catalog data via function call)   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  LLM GENERATES (not selects from a list):                         │
│  • Contextually appropriate, unique response                      │
│  • Based on understanding, NOT pattern matching                   │
│  • Maintains persona consistency throughout                       │
│  • Advances conversation naturally toward goal                    │
│  • Can call functions (lookup product, check inventory, etc.)     │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────┐
│  Voice Output     │  ← OpenAI Realtime (native) or ElevenLabs TTS
└───────────────────┘
        │
        ▼
   AI speaks
        │
        ▼
   [Loop continues - AI maintains full context]
```

### Example: Why Context Matters

**Scripted/Alexa approach (BAD):**
```
Turn 1:
  User: "I'm a writer working on my second novel"
  AI: "That's great!" [stores: user_occupation = "writer"]

Turn 5:
  User: "I don't need a pen"
  AI: [matches "objection_no_need" intent]
  AI: "But everyone needs a pen!" [generic canned response]
```

**True AI approach (GOOD):**
```
Turn 1:
  User: "I'm a writer working on my second novel"
  AI: "A novelist! That's exciting. What genre?" [genuinely curious]

Turn 5:
  User: "I don't need a pen"
  AI: [LLM considers full conversation context]
  AI: "I hear you - but you mentioned you're writing your second novel.
       Have you ever tried drafting longhand? A lot of writers find it
       unlocks different creative pathways than typing. Stephen King
       writes his first drafts by hand." [contextual, relevant]
```

### Key Difference: The AI Remembers and Reasons

The LLM doesn't just remember facts - it reasons about them:

- **Remembers:** User said they're a novelist
- **Reasons:** Writers often care about their creative process
- **Connects:** Handwriting has known creative benefits for writers
- **Responds:** Tailored pitch that addresses this specific user

This cannot be achieved with decision trees or keyword matching.

---

## User Interface

### Toggle Component

```html
<!-- Mode Selection Toggle -->
<div class="sell-mode-toggle">
  <h3>Choose Your Challenge</h3>

  <div class="mode-option" data-mode="ai-sells">
    <div class="mode-icon">🤖</div>
    <div class="mode-info">
      <h4>AI Sells the Pen</h4>
      <p>Watch the AI try to sell you a pen. Can it convince you?</p>
    </div>
    <input type="radio" name="sellMode" value="ai-sells">
  </div>

  <div class="mode-option" data-mode="user-sells">
    <div class="mode-icon">🎯</div>
    <div class="mode-info">
      <h4>You Sell the Pen</h4>
      <p>Practice your sales pitch. The AI will challenge you!</p>
    </div>
    <input type="radio" name="sellMode" value="user-sells">
  </div>
</div>
```

### Difficulty Selection (User Sells Mode Only)

When "User Sells" is selected, show additional options:

```
┌─────────────────────────────────────────┐
│   Select Customer Difficulty            │
│                                         │
│   ○ Easy - Friendly, few objections     │
│   ○ Medium - Some pushback, skeptical   │
│   ○ Hard - Tough customer, many excuses │
│   ○ Expert - "Wolf of Wall Street"      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Conversation Flows

### Flow 1: AI Sells the Pen

```
┌─────────────────────────────────────────────────────────────┐
│                    AI SELLS MODE                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   AI: Greeting          │
              │   "Hello! Welcome to    │
              │   Sell Me A Pen. I'm    │
              │   ready when you are."  │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   WAIT STATE            │
              │   Listening for:        │
              │   - "Sell me a pen"     │
              │   - "Go ahead"          │
              │   - "Let's see it"      │
              │   - "Show me"           │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   AI: Sales Pitch       │
              │   [Dynamic pitch based  │
              │    on product/persona]  │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   USER: Response        │
              │   - Questions           │
              │   - Objections          │
              │   - Interest            │
              │   - Rejection           │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   AI: Handle Response   │
              │   [Overcome objections, │
              │    answer questions,    │
              │    close the sale]      │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   OUTCOME               │
              │   - Sale Made ✓         │
              │   - Sale Lost ✗         │
              │   - User Ended Session  │
              └─────────────────────────┘
```

---

### Flow 2: User Sells the Pen

```
┌─────────────────────────────────────────────────────────────┐
│                   USER SELLS MODE                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   AI: Greeting          │
              │   "Hello! I'm a busy    │
              │   [persona]. Let's see  │
              │   what you've got..."   │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   AI: Challenge         │
              │   "SELL ME A PEN."      │
              │                         │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   USER: Sales Pitch     │
              │   [User speaks their    │
              │    pitch attempt]       │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   AI: Customer Response │
              │   - Objection           │
              │   - Question            │
              │   - Interest shown      │
              │   - Dismissal           │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   [Conversation Loop]   │
              │   User responds to AI   │
              │   AI responds to User   │
              │   Until conclusion      │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   OUTCOME + FEEDBACK    │
              │   - Sale Made ✓ Score   │
              │   - Sale Lost ✗ Tips    │
              │   - Detailed Analysis   │
              └─────────────────────────┘
```

---

## AI Behavior Specifications

> **Note:** The behaviors below are achieved through LLM system prompts, NOT scripted responses. The AI generates all responses dynamically based on context.

### How Greetings Work (AI-Generated, Not Scripted)

The AI generates its own greeting based on the system prompt. We don't provide exact scripts - we provide persona guidance and let the LLM create natural, varied greetings.

**AI Sells Mode:**
- System prompt tells AI to welcome user and invite them to start
- AI generates unique greeting each time based on its "personality"
- No keyword detection needed - AI understands intent naturally

**User Sells Mode:**
- System prompt provides persona characteristics (not exact words)
- AI embodies the persona and generates its own introduction
- Difficulty affects persona traits, not specific scripts

### Intent Understanding (NOT Keyword Matching)

**OLD WAY (Don't do this):**
```javascript
// ❌ Keyword matching - WRONG
const triggerPhrases = ["sell me a pen", "go ahead", "start"];
if (triggerPhrases.includes(userInput.toLowerCase())) {
  startPitch();
}
```

**NEW WAY (LLM understands intent):**
```
The LLM naturally understands when the user wants to start:
- "Sell me a pen" → AI understands, begins pitch
- "Okay, let's see what you got" → AI understands, begins pitch
- "I'm curious, go for it" → AI understands, begins pitch
- "Actually, before you start, what kind of pen is it?" → AI understands
   this is a question, answers first, THEN begins pitch
- "Hold on, I need to grab my coffee first" → AI understands to wait

No keyword list needed. The AI reasons about user intent.
```

---

### Persona System (User Sells Mode)

Instead of scripted responses, we define persona **characteristics** that the LLM embodies:

#### Difficulty Levels as Persona Traits

| Difficulty | Receptiveness | Patience | Objection Style | Buy Likelihood |
|------------|---------------|----------|-----------------|----------------|
| **Easy** | Open-minded, curious | Patient, gives time | Gentle questions | High (70%+) |
| **Medium** | Neutral, needs convincing | Moderate | Direct pushback | Medium (40-60%) |
| **Hard** | Skeptical, resistant | Limited | Aggressive objections | Low (20-40%) |
| **Expert** | Hostile, testing you | Very low | Ruthless, strategic | Very low (10-20%) |

#### AI Customer Personas (User Sells Mode)

#### Persona: The Busy Executive
```yaml
name: "Alex Chen"
occupation: "CEO"
personality: "Time-conscious, direct, values efficiency"
objections:
  - "I don't have time for this"
  - "My assistant handles office supplies"
  - "I use digital notes exclusively"
buying_triggers:
  - Efficiency gains
  - Status/luxury appeal
  - Time-saving features
```

#### Persona: The Budget Watcher
```yaml
name: "Pat Rivera"
occupation: "Accountant"
personality: "Frugal, analytical, needs justification"
objections:
  - "How much does it cost?"
  - "I can get pens for free at conferences"
  - "What's the ROI on a pen?"
buying_triggers:
  - Value proposition
  - Cost savings
  - Durability/longevity
```

#### Persona: The Skeptic
```yaml
name: "Jordan Blake"
occupation: "Lawyer"
personality: "Analytical, questions everything, hard to impress"
objections:
  - "I've heard this all before"
  - "What makes this different from any other pen?"
  - "I don't believe you"
buying_triggers:
  - Unique proof points
  - Credentials/testimonials
  - Logical arguments
```

#### Persona: The Friendly Buyer
```yaml
name: "Sam Martinez"
occupation: "Teacher"
personality: "Warm, open-minded, easy to talk to"
objections:
  - "I'm not sure I need another pen"
  - "Let me think about it"
buying_triggers:
  - Personal connection
  - Story/emotion
  - Practical benefits
```

---

### Objection Behavior (AI-Generated, Context-Aware)

> **Important:** The AI does NOT randomly select from a list of objections. It generates contextually appropriate pushback based on its persona and the conversation so far.

**How objections work:**

1. AI embodies persona traits (skeptical, busy, analytical, etc.)
2. AI listens to user's pitch and identifies weaknesses or gaps
3. AI generates objection that:
   - Is specific to what the user just said
   - Matches the persona's concerns (CEO cares about time, Accountant cares about cost)
   - Tests the user's ability to handle that type of pushback

**Example - Context-Aware Objections:**

```
User: "This pen has a really smooth ink flow"
AI (as CEO): "Smooth ink? I dictate everything to my assistant.
             When's the last time you saw a CEO writing memos by hand?"
             [Objection relates to what user said + persona's reality]

User: "This pen is only $15"
AI (as Accountant): "$15? I can get a box of 50 pens for that price.
                    What's the cost-per-word with your pen versus bulk?"
                    [Objection relates to price + persona's analytical nature]
```

**Objection Intensity by Difficulty:**

| Difficulty | Objection Behavior |
|------------|-------------------|
| Easy | Raises concerns but is open to being convinced. Gives user benefit of doubt. |
| Medium | Requires solid answers. Won't accept vague responses. |
| Hard | Actively challenges every point. Looks for holes in argument. |
| Expert | Ruthlessly tests sales fundamentals. May try to throw user off balance. |

---

### Buying Progression (AI Reasoning, Not Scripts)

> **Important:** The AI doesn't use keyword matching to detect "buying signals." It evaluates the conversation holistically and decides if it's genuinely convinced.

**How the AI decides to "buy":**

The LLM evaluates:
1. Did the user understand my needs? (Discovery)
2. Did they address my specific objections? (Not generic responses)
3. Did they connect the product to MY situation? (Personalization)
4. Do I actually want this based on what they said? (Genuine persuasion)

**The AI will progress toward buying when:**
- User asks good discovery questions (shows interest in customer)
- User addresses specific concerns raised (proves they're listening)
- User connects features to persona's real needs (customized pitch)
- User creates urgency or exclusivity (good sales technique)
- User asks for the sale confidently (closing behavior)

**The AI will NOT buy when:**
- User gives generic pitches that ignore what AI said
- User ignores objections or gives canned responses
- User focuses only on features, not benefits
- User seems desperate or pushy
- User fails to ask for the sale

**Natural Progression Example:**
```
Turn 1: AI is skeptical (-50 to buy)
Turn 3: User asks good questions, AI becomes curious (-20 to buy)
Turn 5: User addresses main objection well, AI is interested (+20 to buy)
Turn 7: User connects to personal need, AI is ready (+60 to buy)
Turn 8: User asks for the sale confidently, AI buys (+100)
```

The AI generates its responses based on this internal "interest level" - expressing more openness as it gets more convinced.

---

## LLM System Prompts

> **This is the core of the AI behavior.** These prompts define how the AI thinks, not what it says.

### AI Sells Mode - System Prompt

```markdown
# Role
You are a world-class salesperson for [BRAND_NAME]. Your goal is to sell a
[PRODUCT_NAME] to the person you're talking to.

# Your Personality
- Confident but not arrogant
- Genuinely curious about the customer
- Quick-witted and able to think on your feet
- Persistent without being pushy
- Warm and personable

# Your Approach
1. BUILD RAPPORT: Start by getting to know them. Ask about their day, their work,
   their interests. Find common ground.
2. DISCOVER NEEDS: Ask questions to understand their situation. What do they do?
   What problems do they face? Don't pitch until you understand them.
3. CONNECT VALUE: Once you understand their needs, connect the product's benefits
   to THEIR specific situation. Don't list features - explain how it helps THEM.
4. HANDLE OBJECTIONS: When they push back, acknowledge their concern, then reframe
   it. Never dismiss or argue.
5. CLOSE: When you sense interest, ask for the sale directly. Don't be afraid to
   ask "Would you like to buy one?"

# Product Knowledge
[PRODUCT_DETAILS injected here - name, price, features, benefits, unique selling points]

# Important Rules
- NEVER be robotic or scripted. Every response should be unique and contextual.
- NEVER ignore what the customer says. Always reference their words back to them.
- If they reject you, gracefully accept it. Thank them for their time.
- Stay in character throughout. You ARE a salesperson, not an AI assistant.
- Keep responses conversational - this is a voice call, not a text chat.

# Session Start
When the conversation begins, greet the customer warmly and invite them to
challenge you to sell them a pen (or the product). Wait for them to engage before
starting your pitch.
```

---

### User Sells Mode - System Prompt Template

```markdown
# Role
You are [PERSONA_NAME], a [OCCUPATION]. Someone is about to try to sell you a pen.
Your job is to be a realistic potential customer - not a pushover, but not
impossible to sell to either.

# Your Personality
[PERSONA_TRAITS - varies by difficulty and persona type]

# Your Current Situation
- You're [CONTEXT - busy, relaxed, skeptical, etc.]
- You [DO/DON'T] currently need a pen
- Your main concerns are: [CONCERNS based on persona]

# How to Behave
1. START: Introduce yourself briefly and challenge them: "Sell me a pen."
2. LISTEN: Pay attention to what they say. Note if they ask questions or just
   pitch at you.
3. RESPOND REALISTICALLY:
   - If they ask good questions, engage genuinely
   - If they ignore you and just pitch, show disinterest
   - If they address your concerns, warm up to them
4. RAISE OBJECTIONS: Push back based on your persona's concerns. Make them work
   for it. But if they handle it well, acknowledge it.
5. DECIDE: Based on how convincing they are, either buy or don't. Your decision
   should feel EARNED, not given.

# Difficulty Level: [EASY/MEDIUM/HARD/EXPERT]
[Specific behavioral modifiers based on difficulty]

# Important Rules
- You are NOT trying to teach them. You are a real customer.
- Your objections should be SPECIFIC to what they said, not generic.
- If they ask about your needs, answer honestly (this helps them sell to you).
- Don't buy just to be nice. Only buy if genuinely convinced.
- Keep responses conversational and natural.

# Internal State (track this mentally)
- Interest Level: Start at [X based on difficulty]
- Increases when: They ask good questions, address your concerns, personalize pitch
- Decreases when: They ignore you, give generic responses, are pushy

# At Session End
When the conversation concludes, briefly step out of character to provide feedback:
- What they did well
- What they could improve
- Key moments that influenced your decision
```

---

### Difficulty-Specific Prompt Additions

**Easy Mode:**
```markdown
You're in a good mood today and have some time. You're open to hearing people out.
If they make a genuine effort, give them credit. You WANT to find a reason to buy.
Interest starts at: 40/100
```

**Medium Mode:**
```markdown
You're neutral - not hostile but not enthusiastic. You need to be convinced.
Generic pitches won't work. They need to give you a specific reason to care.
Interest starts at: 20/100
```

**Hard Mode:**
```markdown
You've heard it all before. You're skeptical of salespeople in general.
They'll need to do something different to get your attention. Push back firmly.
Interest starts at: 0/100
```

**Expert Mode:**
```markdown
You are testing their sales fundamentals. You know every trick in the book.
Interrupt them if they're boring. Challenge weak points immediately.
Call out generic responses. Make them prove they understand sales.
Interest starts at: -20/100 (they need to earn their way to neutral first)
```

---

## Technical Requirements

### State Management

```javascript
const sessionState = {
  mode: 'ai-sells' | 'user-sells',
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  persona: {
    name: string,
    occupation: string,
    traits: string[],
    concerns: string[]
  },
  conversationHistory: [
    { role: 'user' | 'assistant', content: string, timestamp: Date }
  ],
  product: {
    id: string,
    name: string,
    price: number,
    features: string[],
    benefits: string[],
    brand: string
  },
  outcome: 'pending' | 'sale' | 'no-sale' | 'abandoned',

  // For scoring (User Sells Mode)
  aiAnalysis: {
    discoveryQuestionsAsked: number,
    objectionsRaised: number,
    objectionsAddressed: number,
    personalizationDetected: boolean,
    closeAttempted: boolean,
    interestProgression: number[] // track interest over turns
  }
};
```

### Voice Platform Requirements

**Using OpenAI Realtime API:**
- WebSocket connection to `wss://api.openai.com/v1/realtime`
- Session configuration with system prompt
- Audio input/output streaming
- Function calling for product lookups
- Turn detection (server VAD or push-to-talk)
- Interruption handling (user can cut off AI)

**Key Configuration:**
```javascript
const realtimeConfig = {
  model: "gpt-4o-realtime-preview",
  voice: "alloy", // or shimmer, echo, etc.
  instructions: systemPrompt, // The prompts defined above
  tools: [
    {
      type: "function",
      name: "lookup_product",
      description: "Get details about a product from the catalog",
      parameters: { productId: "string" }
    },
    {
      type: "function",
      name: "end_session",
      description: "End the sales session and record outcome",
      parameters: { outcome: "sale|no-sale", notes: "string" }
    }
  ],
  turn_detection: {
    type: "server_vad",
    threshold: 0.5,
    silence_duration_ms: 500
  }
};
```

### Conversation Memory

The AI maintains context through:
1. **Full conversation history** sent with each turn
2. **System prompt** (never changes during session)
3. **Function results** (product info, etc.)

No separate "memory" system needed - the LLM context window handles it.

---

## Scoring & Feedback (User Sells Mode)

> **Important:** Scoring is done BY THE AI, not by keyword counting. The LLM evaluates the conversation holistically.

### How AI-Powered Scoring Works

At the end of each session, we send the full conversation to the LLM with a scoring prompt:

```markdown
# Scoring Instructions
You just finished a sales training session as a customer. Now evaluate the
salesperson's performance.

Review the conversation and score each category from 0-100:

## Categories

1. **Opening & Rapport (15%)**: Did they try to connect with you as a person
   before pitching? Did they show genuine interest in you?

2. **Need Discovery (25%)**: Did they ask questions to understand YOUR situation?
   Did they listen to your answers? Did they uncover what you actually care about?

3. **Value Proposition (25%)**: Did they connect the product to YOUR specific needs?
   Was it personalized or generic? Did they explain benefits, not just features?

4. **Objection Handling (20%)**: When you pushed back, how did they respond?
   Did they acknowledge your concern? Did they address it or deflect?

5. **Closing (15%)**: Did they ask for the sale? Were they confident? Did they
   handle your final hesitation well?

## Output Format
Return JSON:
{
  "scores": {
    "opening": 0-100,
    "discovery": 0-100,
    "value": 0-100,
    "objections": 0-100,
    "closing": 0-100
  },
  "overall": 0-100 (weighted average),
  "strengths": ["specific thing they did well", ...],
  "improvements": ["specific thing to work on", ...],
  "keyMoments": [
    { "turn": 3, "quote": "what they said", "impact": "positive/negative", "reason": "why" }
  ],
  "coachingTip": "One specific actionable tip for next time"
}
```

### Why AI Scoring is Better

**OLD WAY (Boolean/Counter Scoring):**
```javascript
// ❌ This misses nuance
if (session.askedCustomerName) score += 5;  // What if they asked but didn't listen?
score += session.questionsAsked * 5;         // What if questions were bad?
```

**NEW WAY (AI Evaluation):**
```
The AI considers:
- QUALITY of questions, not just quantity
- Did they actually LISTEN to answers?
- Were responses RELEVANT to what customer said?
- Was there genuine CONNECTION or just going through motions?
- How did the overall conversation FLOW?
```

### Feedback Output

The AI generates personalized feedback:

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION RESULTS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   OUTCOME: SALE MADE! ✓                                     │
│   SCORE: 78/100                                             │
│                                                              │
│   ┌─────────────────────────────────────┐                   │
│   │ Opening          ████████░░  80/100 │                   │
│   │ Need Discovery   ██████████  95/100 │                   │
│   │ Value Prop       ██████░░░░  60/100 │                   │
│   │ Objections       ████████░░  75/100 │                   │
│   │ Closing          ████████░░  70/100 │                   │
│   └─────────────────────────────────────┘                   │
│                                                              │
│   STRENGTHS:                                                │
│   ✓ "You asked about my work before jumping into the pitch  │
│      - that made me feel heard"                             │
│   ✓ "When I said I use digital notes, you didn't argue -    │
│      you acknowledged it and pivoted to backup scenarios"   │
│                                                              │
│   AREAS TO IMPROVE:                                         │
│   → "You mentioned the pen's smooth ink, but I never said   │
│      I care about ink quality. Connect features to MY needs"│
│   → "Your close was a bit hesitant - 'Would you maybe want  │
│      to try one?' Own it: 'Let's get you one.'"             │
│                                                              │
│   KEY MOMENT:                                               │
│   Turn 5: "You asked 'What do you usually write by hand?'   │
│   That's when I started taking you seriously."              │
│                                                              │
│   COACHING TIP:                                             │
│   "Before stating any feature, ask yourself: did they tell  │
│   me they care about this? If not, don't mention it."       │
│                                                              │
│   [Try Again]  [Change Difficulty]  [Share Score]           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Feedback is Conversational

The AI can also deliver feedback verbally (staying in character briefly):

```
AI: "Alright, I'll take one. Good job."
[Brief pause]
AI: "Okay, stepping out of character for a sec. That was solid.
     You did something smart early on - you asked about my work
     before jumping into the pitch. That made me actually want
     to listen. One thing to work on: when you talked about the
     ink quality, I hadn't said anything about caring about that.
     Always tie features back to something I told you. Overall,
     78 out of 100. Want to go again?"
```

---

## Use Cases

### Use Case 1: Sales Training Platform
Companies can use this to train new salespeople in a low-pressure environment before real customer interactions.

### Use Case 2: Interview Preparation
Job candidates can practice the classic "sell me a pen" interview question with realistic feedback.

### Use Case 3: Entertainment/Viral Marketing
Visitors can challenge the AI and share their scores on social media, driving organic traffic.

### Use Case 4: Product Demonstration
Show potential customers how the AI sales agent works by having it sell to them.

### Use Case 5: Gamification
Leaderboards for highest scores, badges for completing challenges, daily streaks.

---

## Future Enhancements

### 1. Multiple Products (From Existing Catalogs)

Expand beyond pens to sell products from your actual brand catalogs:

**Pecos River Traders:**
- Western apparel and accessories
- Outdoor gear
- Home décor items
- Seasonal merchandise

**Mangy Dog Coffee:**
- Coffee blends (whole bean, ground)
- Coffee subscriptions
- Brewing equipment
- Merchandise (mugs, apparel)

**The Great Bake Off:**
- Baking competition merchandise
- Baking supplies
- Event tickets/registrations

**Implementation:**
- Product selector dropdown pulls from live catalog database
- AI learns product features, pricing, and selling points from catalog data
- Dynamic objections based on product category
- Product images displayed during voice session (optional)

---

### 2. Leaderboards

Score-based leaderboards for comparing performance (no live multiplayer battles):

**Leaderboard Types:**
| Leaderboard | Description |
|-------------|-------------|
| Global All-Time | Highest scores ever recorded |
| Weekly Challenge | Reset weekly, fresh competition |
| Monthly Challenge | Reset monthly |
| By Difficulty | Separate boards for Easy, Medium, Hard, Expert |
| By Product | Best scores per product category |
| By Brand | Best scores for each brand (Pecos River Traders, Mangy Dog Coffee, etc.) |

**Leaderboard Display:**
```
┌─────────────────────────────────────────────────────────────┐
│              WEEKLY LEADERBOARD - EXPERT MODE               │
├─────────────────────────────────────────────────────────────┤
│  RANK    NAME              SCORE    PRODUCT      DATE       │
│  ────    ────              ─────    ───────      ────       │
│  🥇 1    SalesWolf99       98/100   Pen          Dec 10     │
│  🥈 2    CloserKing        95/100   Coffee       Dec 9      │
│  🥉 3    PitchPerfect      92/100   Pen          Dec 11     │
│     4    DealMaker         89/100   Western Hat  Dec 8      │
│     5    ObjectionSlayer   87/100   Pen          Dec 10     │
│     ...                                                      │
│  → 47    You               72/100   Pen          Dec 11     │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Badges & Achievements

Achievement badges to reward milestones (no XP/level progression):

**Sales Achievement Badges:**
| Badge | Requirement |
|-------|-------------|
| First Sale | Complete your first successful sale |
| Pen Master | Score 90+ selling a pen on Expert |
| Coffee Closer | Successfully sell coffee 10 times |
| Western Pro | Successfully sell Pecos River products 10 times |
| Objection Handler | Overcome 50 total objections |
| Streak Champion | 7-day practice streak |
| Perfect Pitch | Score 100/100 on any difficulty |
| Wolf of Wall Street | Perfect score on Expert mode |
| Multi-Brand Master | Successfully sell from all 4+ brands |
| Difficulty Climber | Complete a sale on all difficulty levels |

**Badge Display:**
```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR BADGES (7/15)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   🏆 First Sale        ☕ Coffee Closer    🎯 Pen Master    │
│   🔥 Streak Champion   💪 Objection Handler                 │
│   🤠 Western Pro       📈 Difficulty Climber                │
│                                                              │
│   LOCKED:                                                   │
│   🐺 Wolf of Wall Street - Score 100 on Expert              │
│   ⭐ Multi-Brand Master - Sell from all brands              │
│   ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Brand-Specific Personas

Customer personas tailored to each of your brands:

**Pecos River Traders Personas:**
```yaml
The Ranch Owner:
  personality: "Practical, quality-focused, knows what they want"
  objections:
    - "I've got plenty of gear already"
    - "Is this actually durable for ranch work?"
    - "I usually buy from the local western store"
  buying_triggers:
    - Durability and quality
    - Authentic western heritage
    - Practical functionality

The Western Enthusiast:
  personality: "Loves the aesthetic, collector mentality"
  objections:
    - "I'm looking for something more authentic"
    - "Does this match the classic western style?"
  buying_triggers:
    - Authenticity and heritage
    - Unique or limited items
    - Style and aesthetics

The Gift Buyer:
  personality: "Shopping for someone else, needs guidance"
  objections:
    - "I'm not sure what size they wear"
    - "Will they like this?"
    - "Can I return it if it doesn't fit?"
  buying_triggers:
    - Gift-ability
    - Return policy
    - Popular/safe choices
```

**Mangy Dog Coffee Personas:**
```yaml
The Coffee Snob:
  personality: "Knowledgeable, particular about roast and origin"
  objections:
    - "What's the roast date?"
    - "Where are the beans sourced from?"
    - "I only drink single-origin"
    - "Is this specialty grade?"
  buying_triggers:
    - Bean origin and quality
    - Roast freshness
    - Unique flavor profiles

The Casual Drinker:
  personality: "Just wants good coffee, not too complicated"
  objections:
    - "I just need something for my morning cup"
    - "Is this too fancy for me?"
    - "What if I don't like it?"
  buying_triggers:
    - Ease and simplicity
    - Good value
    - Approachable descriptions

The Subscription Seeker:
  personality: "Wants convenience, regular delivery"
  objections:
    - "What if I want to skip a month?"
    - "Can I change my blend?"
    - "What's the commitment?"
  buying_triggers:
    - Flexibility
    - Convenience
    - Savings on subscription
```

**The Great Bake Off Personas:**
```yaml
The Competition Fan:
  personality: "Follows the events, knows the contestants"
  objections:
    - "Will there be new designs this season?"
    - "I already have last year's shirt"
  buying_triggers:
    - Exclusive or limited items
    - Contestant favorites
    - Event memories

The Casual Attendee:
  personality: "Going to the event, wants a souvenir"
  objections:
    - "Is this only available here?"
    - "Do you have different sizes?"
  buying_triggers:
    - Event exclusivity
    - Memorabilia value
    - Practical items

The Home Baker:
  personality: "Interested in the craft, wants quality supplies"
  objections:
    - "I can get this at the grocery store"
    - "What makes this better?"
  buying_triggers:
    - Quality ingredients
    - Expert recommendations
    - Competition-tested products
```

---

## API Endpoints Needed

```
POST /api/sell-me-a-pen/start
  body: { mode: 'ai-sells' | 'user-sells', difficulty?: string, productId?: string }
  returns: { sessionId, greeting, persona? }

POST /api/sell-me-a-pen/respond
  body: { sessionId, userMessage }
  returns: { aiResponse, phase, metrics? }

POST /api/sell-me-a-pen/end
  body: { sessionId }
  returns: { outcome, score?, feedback?, badgesEarned?: [] }

GET /api/sell-me-a-pen/leaderboard
  query: { type: 'global' | 'weekly' | 'monthly', difficulty?: string, brand?: string }
  returns: { topScores[], userRank? }

GET /api/sell-me-a-pen/badges/:userId
  returns: { earnedBadges[], lockedBadges[] }

GET /api/sell-me-a-pen/products
  returns: { products[] } // From catalog database
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 2025 | Initial document creation |
| 1.1 | December 2025 | Updated Future Enhancements: Multiple products from catalogs, leaderboards, badges, brand-specific personas |
| 1.2 | December 2025 | **Major revision:** Converted from scripted/tenant-response to true conversational AI. Added: Voice AI Technology Options (OpenAI Realtime, Claude+ElevenLabs, Groq, Hume), True AI vs Scripted section, LLM System Prompts, AI-powered scoring, context-aware objection handling, intent understanding without keyword matching |

---

*This feature transforms a classic sales challenge into an interactive training and entertainment experience powered by true conversational AI.*
