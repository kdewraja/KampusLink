# Kampu$Link — Premium Campus Dating & Social Discovery

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> **"Real Students. Verified Campuses. Intentional Dating."**
> 
> A modern, premium campus dating application designed for university ecosystems. Kampu$Link bridges the gap between **Tinder-like responsive discovery** and **Hinge-like intentional interactions**, grounded in verified university domains and safety.

---

## ✨ Product Highlights

### 🎓 Verified Campus Scholar Network
* **Accredited Domain Gating**: Authentication tied to institutional university email domains (`.edu`, `.ac.in`).
* **Dynamic Trust Scores (0–100%)**: Rewarding verified student IDs, completed profiles, and community safety ratings.
* **Campus & Major Context**: Filter profiles by university, academic major, graduation batch, and residential hostel/dorm wing.

### 💬 Intentional Prompt-Based Interactions
* **Interactive Prompts**: Thoughtful conversation starters (*"My ideal first campus date..."*, *"An unspoken campus rule..."*, *"Best late-night fuel..."*).
* **Targeted Likes & Comments**: Like specific photos or leave contextual comments directly on prompt answers to bypass awkward openers.

### ☕ "Free Tonight" Spontaneous Meetups
* Real-time status beacons enabling students to broadcast impromptu availability for on-campus coffee, library study sessions, or evening walks with defined time windows.

### 📍 Curated On-Campus Date Planner
* Collaborative date proposals anchored at verified campus spots (Central Library Cafe, Ivy Courtyards, SAC lawns) with built-in acceptance workflows.

### 🤖 AI Wingman & Tone Assistant
* Built-in communication assistant providing smart opening suggestions, date ideation, and real-time message tone checks to cultivate polite, respectful campus conversations.

### 🛡️ Built-in Safety & Guardian Suite
* Disconnection, blocking, and reporting workflows.
* Database-enforced Row Level Security (RLS), input sanitization, JWT authentication with refresh token rotations, and rate limiting.

---

## 🏛️ System Architecture

```
Campus dating app/
├── server/
│   ├── data/
│   │   └── seedData.ts       # Realistic campus student profiles & prompts
│   ├── lib/
│   │   ├── auth.ts           # JWT authentication & session token management
│   │   ├── database.ts       # Central database service layer
│   │   ├── prisma.ts         # PrismaClient configured with PostgreSQL connection pooling
│   │   ├── security.ts       # Rate limiters, sanitizeInput, securityHeaders
│   │   └── validation.ts     # Strict Zod schemas for all API payloads
│   ├── services/
│   │   └── aiService.ts      # AI Wingman & message tone analysis
│   └── index.ts              # Express application entrypoint
├── src/
│   ├── components/
│   │   ├── auth/             # Sign in, registration, onboarding wizard
│   │   ├── chat/             # Real-time messaging, AI tone checker, date planner
│   │   ├── common/           # Navigation header, toast notifications
│   │   ├── dates/            # Structured campus date proposals view
│   │   ├── discovery/        # Swipe deck (Framer Motion physics), profile cards, filters
│   │   ├── freeTonight/      # Live campus impromptu meetup status
│   │   ├── landing/          # Startup hero page with 3D visual anchors
│   │   └── profile/          # Profile customizer, photo ordering, prompts
│   ├── context/
│   │   └── AppContext.tsx    # Global state management
│   ├── design/
│   │   └── tokens.ts         # Design tokens, typography, color palettes
│   ├── services/
│   │   └── api.ts            # Typed frontend API client
│   └── types/
│       └── index.ts          # Shared TypeScript models & interfaces
├── prisma/
│   ├── schema.prisma         # PostgreSQL schema (Users, Profiles, Matches, Chats, RLS)
│   └── seed.ts               # Database seeder with realistic test accounts
├── prisma.config.ts          # Prisma 7 environment configuration
└── vite.config.ts            # Vite bundler configuration
```

---

## 🚀 Quick Start

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* A **PostgreSQL** database (e.g. [Supabase](https://supabase.com) or [Neon](https://neon.tech))

### 1. Clone & Install Dependencies
```bash
git clone git@github.com:kdewraja/KampusLink.git
cd KampusLink
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# JWT Authentication
JWT_SECRET="kampuslink-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_REFRESH_SECRET="kampuslink-refresh-secret-change-in-production-min-32-chars"

# Server Configuration
PORT=5001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000"
```

### 3. Sync Schema & Seed Database
```bash
# Push Prisma schema to PostgreSQL / Supabase
npx prisma db push

# Populate with realistic campus demo accounts
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

* **Web Application**: `http://localhost:3000`
* **API Server**: `http://localhost:5001`

---

## 👥 Demo Test Accounts

| Campus | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **IIT Delhi** | `aarav.sharma@iitd.ac.in` | `password123` | CS & AI junior (has active match with Rhea) |
| **IIT Delhi** | `rhea.sengupta@iitd.ac.in` | `password123` | Design & Visual Arts (has date plan with Aarav) |
| **BITS Pilani** | `kabir.mehta@bits-pilani.ac.in` | `password123` | Economics & Financial Engineering |
| **Delhi University** | `ananya.roy@du.ac.in` | `password123` | English Literature & Journalism |

---

## 🔒 Security & Data Integrity

* **Row Level Security (RLS)**: Enforced across all 23 database tables in PostgreSQL.
* **Strict Parameterized Queries**: Zero raw SQL injection vectors via Prisma Client.
* **Input Validation & Sanitization**: Strict Zod schemas validating all incoming requests.
* **Encrypted Passwords**: `bcryptjs` hashing with 12 salt rounds.
* **Protected Tokens**: Stateless JWT access tokens with rotating refresh tokens.

---

## 📄 License

Private & Proprietary. All rights reserved by Kampu$Link.
