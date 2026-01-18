# MangyDogCoffee - Coffee Shop Voice Assistant

**Type:** Voice Assistant (Product Sales)
**Port:** 8084
**URL Prefix:** `/MangyDogCoffee/`

---

## Quick Start

```bash
# Start the application
docker compose up -d

# Access URLs
# Chat: http://localhost:8084/MangyDogCoffee/
# Admin: http://localhost:8084/MangyDogCoffee/admin?token=admin
```

---

## Features Overview

### Product Management
- **Products** - Full product catalog
- **Coffee Sales** - Coffee order history
- **Tea Sales** - Tea order history
- **Call Logs** - Call history and transcripts

### Voice Features
- AI voice ordering assistant
- SMS order confirmations
- Call transfer
- DTMF menu navigation

### AI Configuration
- Knowledge Base
- Voices & Languages
- Greeting customization

---

## Database Schema

### Key Models
- `Product` - Product catalog
- `CoffeeSale` - Coffee orders
- `TeaSale` - Tea orders
- `CallLog` - Call history
- `Transcript` - Conversation transcripts
- `SMSSettings` - SMS configuration
- `KnowledgeBase` - Product knowledge

### Product Model Fields
- name, description
- category (coffee/tea/pastry)
- size, price
- customizations

---

## Color Theme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Brown | `#92400e` |
| Secondary | Dark Brown | `#78350f` |
| Accent | Amber | `#b45309` |

---

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) - Master reference
- [THEMING.md](../../../THEMING.md) - Theming guide
- [DATABASE-SCHEMAS.md](../../../DATABASE-SCHEMAS.md) - Full schemas
- [SAMPLE-DATA.md](../../../SAMPLE-DATA.md) - Sample data
