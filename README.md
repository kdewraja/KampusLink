# UniPulse — Verified Campus Dating & Social Discovery Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026%20Ready-blueviolet?style=for-the-badge)](https://sih.gov.in)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

> **"Real Students. Verified Campuses. Genuine Sparks."**
> A production-grade campus dating and social connection platform purpose-built for university students, college fests, and campus safety.

---

## 🌟 The Core Problem & SIH Innovation

Traditional commercial dating apps (Tinder, Bumble, Hinge) fail college students due to:
1. **Pervasive Catfishing & Bots**: Unverified external strangers enter the pool with zero accountability.
2. **Absence of Campus Context**: Students cannot connect based on majors, course timetables, student clubs, or hostel blocks.
3. **Safety Vulnerabilities**: Lack of discreet date exit mechanisms, no emergency campus security integration, and unsafe off-campus meeting suggestions.
4. **Superficial Photo Swiping**: High social anxiety and lookism with awkward cold openers.

### 💡 The UniPulse Solution:
- **Verified Campus Scholar Network**: Authentication via university email domains (`.edu`, `.ac.in`) and Student ID roll badge with dynamic trust scores (0-100%).
- **Campus Radar with Smart Compatibility**: Filter by university campus, department/major, graduation class, and student clubs (Robotics, Dramatics, E-Cell).
- **7 PM "Blind Spark" Daily Drop**: Personality-first icebreaker session. Photos start blurred and progressively reveal clarity as both students exchange meaningful messages.
- **Campus Fest Plus-One Beacons**: Headline college fests, concerts, hackathons, and sports tournaments with direct RSVP and "Looking for a Fest Date" beacons.
- **Campus Safe Date Planner**: Propose monitored public campus spots (Central Library Cafe, SAC Lawns, Design Courtyard).
- **Guardian Safety Suite**:
  - **1-Tap Campus SOS**: Broadcasts GPS coordinates to Campus Security Central & 3 registered emergency buddies.
  - **"Call Me Out" Fake Call Simulator**: Configurable timer (5s/15s/30s) triggering an authentic incoming audio phone call from "Roommate" to discreetly exit uncomfortable situations.
  - **AI Toxicity Shield**: Proactive protection against harassment and boundary violations.

---

## 🚀 Live Demo Features for Hackathon Judges

UniPulse includes an executive **SIH Live Demo Control Bar** at the top of the screen:
- **1-Click Persona Switcher**: Switch instantly between 6 real pre-loaded student personas:
  - **Aarav Sharma**: CS & AI at IIT Delhi, Nilgiri Hostel, Tech geek & guitarist.
  - **Rhea Sengupta**: Visual Design & HCI at IIT Delhi, Kailash Hostel, photographer.
  - **Kabir Mehta**: Economics & Fin at BITS Pilani, Model UN chair, vinyl collector.
  - **Ananya Roy**: English Lit & Media at Delhi University, editor & debater.
  - **Vikram Rao**: Mechanical & EV Racing at IIT Delhi, athlete & racer.
  - **Maya Chen**: BioTechnology & Genetics at Stanford University.
- **Instant Match Generator**: Trigger celebratory match popup with confetti and harmonic chimes.
- **1-Click Demo Reset**: Restore seed database state anytime.
- **Audio Synthesizer Toggle**: Toggle Web Audio API synthesized chimes and ringtones.

---

## 🛠️ Tech Stack & Architecture

```
unipulse-campus-dating/
├── server/
│   ├── data/
│   │   └── seedData.ts       # 6 student personas, events, active chats, icebreakers
│   ├── db.ts                 # Stateful database engine with concurrency & matching logic
│   └── index.ts              # Express REST API (Auth, Profiles, Swipes, Chats, Events, Safety)
├── src/
│   ├── components/
│   │   ├── blindDate/        # 7 PM Blind Spark daily drop & progressive unblur
│   │   ├── chat/             # Real-time messages, icebreaker generator & date planner
│   │   ├── common/           # Header, JudgeDemoBar, Toast notifications
│   │   ├── discovery/        # SwipeDeck (Framer Motion drag physics), ProfileCard, Filters
│   │   ├── events/           # CampusEventsBoard & plus-one beacons
│   │   ├── landing/          # Premium first-impression landing page
│   │   ├── profile/          # Profile editing & .edu student verification portal
│   │   └── safety/           # SOS Beacon, Fake Call Simulator, Trust Suite
│   ├── context/
│   │   └── AppContext.tsx    # Central state store, audio integration, modals
│   ├── services/
│   │   └── api.ts            # Type-safe API client
│   ├── types/
│   │   └── index.ts          # Shared TypeScript interfaces
│   ├── utils/
│   │   └── audio.ts          # Web Audio API sound synthesizer (zero external dependencies)
│   ├── App.tsx               # Main view router
│   ├── main.tsx              # React DOM root
│   └── index.css             # Tailwind CSS & custom design tokens
├── dist/                     # Optimized production bundle
└── package.json              # Fullstack scripts
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start Fullstack Development (Backend on 5001 + Frontend on 3000)
npm run dev

# 3. Or Build & Run Unified Production Server (Single Port 5001)
npm run build
npm start
```

Visit `http://localhost:5001` or `http://localhost:3000` in your browser.

---

## 🧪 Automated Testing

Run the automated end-to-end API test suite:

```bash
node test/sanity.js
```

Verifies:
- ✅ Health endpoint check
- ✅ Session authentication
- ✅ Persona switching
- ✅ Discovery feed generation
- ✅ Major & campus filtering
- ✅ Swipe matching & rewind
- ✅ Campus event RSVP & beacon broadcast
- ✅ Emergency SOS alert dispatch
- ✅ Database state reset

---

## 🛡️ Security & Privacy

- **Data Minimization**: Phone numbers and private identities are protected until mutual match consent.
- **Accredited Domains**: Verification restricted to accredited institutions.
- **Rate-Limiting & Guardrails**: Sanitized inputs and automated content moderation.

Developed for Smart India Hackathon (SIH) 2026.
