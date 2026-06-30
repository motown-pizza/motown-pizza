# 🍕 Pizza Platform Suite

An integrated set of web platforms powering a modern pizza business — from operations to customer experience.

This monorepo contains all core systems required to run and scale a pizza shop, designed to work seamlessly together.

---

## 🧩 Overview

The suite is composed of four main applications:

- **Back Office** — business management (inventory, staff, reporting, configuration)
- **POS (Point of Sale)** — order taking, payments, in-store operations
- **KDS (Kitchen Display System)** — real-time order tracking and kitchen workflow
- **Website** — marketing pages, menu browsing, and online ordering

Each system is independently deployable but shares a common foundation.

---

## 🎯 Goals

- Single source of truth across all business operations
- Real-time synchronization between systems
- Modular architecture for independent development and scaling
- Consistent UI/UX across all touchpoints
- Extensible for future platforms (mobile apps, analytics, etc.)

---

## 🏗️ Architecture

- **Monorepo** for shared code and unified tooling
- **Shared packages** for:
  - UI components
  - Types / schemas
  - API clients
  - Business logic

- **App-specific layers** for domain concerns
- **Centralized backend services** (auth, orders, payments, inventory)

---

## 📦 Apps

```
apps/
  admin/   # Admin dashboard
  pos/     # Point of sale system
  kds/     # Kitchen display system
  web/     # Customer-facing website
```

---

## 📚 Packages

```
packages/
  ui/           # Shared UI components
  db/           # Database schema + ORM
  api/          # API layer / client
  config/       # Shared configs (eslint, tsconfig, etc.)
  utils/        # Shared utilities
```

---

## 🔗 System Flow

1. Orders originate from **POS** or **Website**
2. Orders are stored and processed via backend services
3. **KDS** receives and displays orders in real time
4. **Back Office** provides visibility and control (reports, inventory, etc.)

---

## ⚙️ Tech Stack (example)

- **Frontend:** Next.js / React
- **Backend:** Node.js / API routes / services
- **Database:** PostgreSQL
- **ORM:** Prisma
- **State:** Zustand / Redux
- **Styling:** Tailwind / Mantine
- **Tooling:** pnpm, Turborepo, ESLint, Prettier

---

## 🚀 Getting Started

### Install dependencies

```bash
pnpm install
```

### Run all apps

```bash
pnpm dev
```

### Run a specific app

```bash
pnpm --filter <app-name> dev
```

---

## 🔐 Environment Variables

Each app may require its own `.env` file. See individual app directories for details.

---

## 🧪 Development Principles

- Keep business logic in shared packages where possible
- Avoid duplication across apps
- Prefer composition over tight coupling
- Design for offline tolerance (especially POS/KDS)
- Optimize for real-time updates

---

## 📈 Future Scope

- Mobile apps (staff + customer)
- Delivery management
- Analytics and forecasting
- Loyalty and rewards system
- Multi-branch support

---

## 📄 License

Private / Proprietary
