# MangyDogCoffee Digital Assistant - Claude Code Conventions

**READ THIS ENTIRE FILE before making ANY changes to this project.**

---

## Project Overview

| Property | Value |
|----------|-------|
| **Type** | Voice Assistant |
| **Purpose** | AI voice receptionist for coffee shop (phone orders, hours, menu) |
| **Port** | TBD |
| **URL Prefix** | `/MangyDogCoffee/` |
| **Theme** | Coffee shop branding |

## Tech Stack

- **Backend:** Node.js + Express + TypeScript
- **Database:** Prisma + PostgreSQL
- **Frontend:** EJS templates + Bootstrap 5 + Bootstrap Icons
- **Voice:** OpenAI Realtime API (WebSockets)
- **Container:** Docker + Docker Compose

## Key Features

- Voice-based phone ordering
- Menu information and specials
- Store hours and location
- Order status updates
- Call transfer to staff when needed

## File Structure

```
MangyDogCoffee-Digital-Assistant-Docker/
├── docker/
│   └── nginx.conf
├── docs/
├── kb/                    # Knowledge base files
├── src/
│   ├── routes/
│   └── server.ts
├── views/
│   └── admin/
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── Dockerfile
└── CLAUDE.md
```

## UI Standards

### Action Buttons - Must Have Tooltips
```html
<button class="btn btn-sm btn-outline-primary"
        data-bs-toggle="tooltip"
        title="Describe what this button does">
  <i class="bi bi-icon-name"></i>
</button>
```

### Data Tables - Must Have
1. Row Selection (checkbox column, select all, bulk actions)
2. Pagination (page size selector, navigation, showing X-Y of Z)

---

## Agent Capabilities

When working on this project, apply these specialized behaviors:

### Backend Architect
- Design Express routes for menu, orders, and store info
- Implement Prisma ORM with SQLite for order tracking
- Structure API endpoints for voice assistant integration
- Handle call routing and transfer logic

### AI Engineer
- Design friendly coffee shop voice persona
- Handle menu queries naturally ("What's your strongest coffee?")
- Implement order-taking dialogue flow
- Process special requests and modifications
- Graceful handoff to human staff when needed

### Database Admin
- Schema for Menu items, categories, modifiers
- Order tracking and status management
- Store hours and location data
- Customer preferences (if returning callers)

### Security Auditor
- Validate order inputs and payment references
- Secure admin routes with token authentication
- Protect customer data and order history
- Review call recording consent handling

### Content Creator
- Write menu descriptions for voice readback
- Create natural-sounding order confirmations
- Design daily specials announcements
- Craft friendly greeting and farewell messages

### Performance Optimizer
- Optimize voice response latency
- Efficient menu search and filtering
- Handle peak order times gracefully
- Cache frequently requested information
