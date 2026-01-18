# Q&A Recommendations - Mangy Dog Coffee Voice Assistant

This document outlines all recommended question-answer pairs that the digital voice assistant should support. Questions are grouped by intent category with sample phrasings and expected responses.

---

## Intent Categories Overview

| Category | Priority | Description |
|----------|----------|-------------|
| Product Information | High | Coffee blends, equipment |
| Store Information | High | Hours, location |
| Subscriptions | High | Subscription options |
| About/Mission | Medium | Company information |
| Contact/Transfer | High | Human assistance |

---

## 1. Product Information Intent

### Sample Questions (Variations)
```
"What coffee do you have?"
"What blends do you offer?"
"Tell me about your dark roast"
"Do you have decaf?"
"What's your most popular coffee?"
"Do you sell whole bean?"
"What's the difference between your roasts?"
"Do you have single origin coffee?"
"What brewing equipment do you sell?"
"Do you have French press?"
"What grind sizes are available?"
```

### Expected Responses

**When asked about coffee blends:**
> "We have several delicious blends. Our House Blend is a smooth, balanced medium roast perfect for everyday drinking. We also have a bold Dark Roast great for espresso, a bright Light Roast for pour-over, and a Swiss Water Process Decaf. What sounds good to you?"

**When asked about dark roast:**
> "Our Dark Roast is bold and robust with notes of dark chocolate and toasted nuts. It's perfect for espresso or if you prefer a stronger cup of coffee."

**When asked about decaf:**
> "Yes, we offer Swiss Water Process decaf in a medium roast. It has all the flavor without the caffeine."

**When asked about brewing equipment:**
> "We sell French presses, pour-over sets, coffee grinders, travel mugs, and Mangy Dog Coffee merchandise. Is there something specific you're looking for?"

---

## 2. Store Information Intent

### Sample Questions (Variations)
```
"What are your hours?"
"Are you open today?"
"What time do you close?"
"What time do you open?"
"Are you open on Sunday?"
"Where are you located?"
"What's your address?"
"How do I get there?"
"Do you have parking?"
```

### Expected Responses

**When asked about hours:**
> "We're open Monday through Friday from 7 AM to 6 PM, Saturday from 8 AM to 5 PM, and Sunday from 9 AM to 3 PM."

**When asked if open today:**
> "Yes, we're open today! Our hours are [appropriate hours for the day]."

**When asked about location:**
> "You can find our store location and directions on our website at mangydogcoffee.com."

---

## 3. Subscription Intent

### Sample Questions (Variations)
```
"Tell me about subscriptions"
"How does your coffee subscription work?"
"What subscription options do you have?"
"Can I get coffee delivered?"
"How much is a subscription?"
"Can I pause my subscription?"
"Can I cancel anytime?"
"Is there a discount for subscribing?"
"How often do you ship?"
```

### Expected Responses

**General subscription inquiry:**
> "Our Coffee Club subscription is a great way to always have fresh coffee! You choose your blend and roast level, pick how often you want delivery - weekly, bi-weekly, or monthly - and we'll ship it right to your door. Subscribers get 15% off and free shipping on every order."

**When asked about pricing:**
> "We have three subscription tiers. Basic starts at $14.99 for one bag, Plus is $27.99 for two bags where you can mix and match, and Premium is $52.99 for four bags with access to exclusive roasts."

**When asked about pausing/canceling:**
> "Absolutely! You can pause, skip, or cancel your subscription anytime with no fees. Just log into your account or give us a call."

**When asked about benefits:**
> "Subscribers enjoy 15% off every order, free shipping, early access to new roasts, and exclusive limited edition coffees."

---

## 4. About/Mission Intent

### Sample Questions (Variations)
```
"Tell me about Mangy Dog Coffee"
"What makes your coffee special?"
"Where do you get your beans?"
"Are your beans ethically sourced?"
"How do you roast your coffee?"
"What's your story?"
```

### Expected Responses

**About the company:**
> "Mangy Dog Coffee is a specialty coffee roaster dedicated to sourcing and roasting the finest beans from around the world. We roast in small batches to ensure freshness and optimal flavor in every cup."

**What makes it special:**
> "We source high-quality beans from ethical suppliers and roast in small batches. This means every bag you get is fresh and carefully crafted for the best possible flavor."

---

## 5. Contact/Transfer Intent

### Sample Questions (Variations)
```
"I'd like to speak to someone"
"Can I talk to a person?"
"Transfer me to a human"
"I need help"
"This isn't helping"
"Let me talk to someone"
"How can I contact you?"
"Leave a message"
"I want to leave a voicemail"
```

### Expected Responses

**Transfer request:**
> "I'll transfer you to a team member right now. Please hold."

**Contact info request:**
> "You can reach us through our website at mangydogcoffee.com/contact. We respond to all inquiries within 24 hours. Would you like me to transfer you to someone now, or would you prefer to leave a message?"

**Voicemail:**
> "I'll take a message for our team. Please state your name, phone number, and your message after the beep. Press pound when finished."

---

## 6. Order & Shipping Questions

### Sample Questions (Variations)
```
"How do I order?"
"Do you ship?"
"How long does shipping take?"
"Is shipping free?"
"Can I pick up in store?"
"Do you ship internationally?"
"What's your return policy?"
```

### Expected Responses

**Ordering:**
> "You can order on our website at mangydogcoffee.com. Browse our selection, add to cart, and checkout. We also offer in-store pickup if you prefer."

**Shipping:**
> "Standard shipping takes 3 to 5 business days, and it's free on orders over $50. We also offer expedited shipping if you need it faster."

**Returns:**
> "If you're not satisfied with your coffee, contact us within 30 days and we'll make it right."

---

## 7. Edge Cases & Fallbacks

### Unclear Intent
```
"I have a question"
"Can you help me?"
"Hello?"
```

**Response:**
> "I'd be happy to help! I can tell you about our coffee blends, store hours, subscription options, or connect you with a team member. What would you like to know?"

### Out of Scope Questions
```
"What's the weather?"
"Can you order me a pizza?"
"Tell me a joke"
```

**Response:**
> "I'm the Mangy Dog Coffee assistant, so I can best help with questions about our coffee, store hours, and subscriptions. Is there anything about Mangy Dog Coffee I can help you with?"

### Complaints/Issues
```
"I have a complaint"
"My order didn't arrive"
"I need a refund"
"There was a problem"
```

**Response:**
> "I'm sorry to hear you're having an issue. Let me transfer you to a team member who can help resolve this for you. Please hold."

---

## 8. Confirmation & Closing

### After Information Query
> "Is there anything else you'd like to know about Mangy Dog Coffee?"

### Closing
> "Thank you for calling Mangy Dog Coffee! Have a great day and enjoy your coffee!"

---

## Voice Response Best Practices

### Do:
- Keep responses concise (aim for under 30 seconds of speech)
- Offer next steps or follow-up options
- Use natural, conversational language
- Spell out URLs when needed ("mangydogcoffee dot com")

### Don't:
- Read long lists verbatim
- Use technical jargon
- Make promises you can't keep
- Hang up abruptly

---

## Recommended IVR Menu Structure

```
Welcome: "Thank you for calling Mangy Dog Coffee! This call may be recorded."

Main Menu:
  Press 1: Product Information
  Press 2: Store Hours & Location
  Press 3: Subscription Information
  Press 4: Speak with Someone
  Press 9: Voice Assistant (AI conversation)

Or say what you need and I'll help you.
```

---

## Metrics to Track

1. **Call Volume**: Total calls per day/week
2. **Intent Distribution**: Which categories get most questions
3. **Resolution Rate**: % of calls resolved without transfer
4. **Average Handle Time**: Duration of calls
5. **Transfer Rate**: % of calls transferred to human
6. **Voicemail Rate**: % of calls going to voicemail
7. **Customer Satisfaction**: Post-call ratings (if implemented)
