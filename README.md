# SpendLens — AI Spend Audit Tool

SpendLens is a free web app that helps startup founders and engineering managers find out if they're overspending on AI tools like Cursor, GitHub Copilot, ChatGPT, and Claude. It gives you a personalized audit with real savings numbers and actionable recommendations.

Built for the Credex Web Development Intern Assignment (Round 1).

## Screenshots

> Screenshots and recording will be added before final submission.

## Live Demo

- **Frontend:** https://spendlens-1.onrender.com
- **Backend:** https://spendlens-7nbz.onrender.com

## Quick Start

### Prerequisites
- Node.js 18+
- A PostgreSQL database (we use Neon free tier)

### Install & Run Locally

```bash
# Clone the repo
git clone https://github.com/Abhinavsharma05/SPENDLENS.git
cd SPENDLENS

# Backend
cd server
npm install
cp .env.example .env   # Fill in your DB URL, Gemini key, etc.
npx prisma db push
npm run server

# Frontend (in a new terminal)
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

### Deploy
- **Backend:** Deploy the `server` folder to Render as a Web Service. Build command: `npm install && npx prisma generate`. Start command: `npm run server`.
- **Frontend:** Deploy the `client` folder to Render as a Static Site. Build command: `npm install && npm run build`. Publish directory: `dist`. Add a rewrite rule `/* → /index.html`.

## Decisions

1. **React + Vite over Next.js** — I didn't need SSR for this project. Vite gives me faster dev builds and the app is mostly client-side anyway. Next.js would've added complexity I didn't need for a single-flow tool.

2. **JavaScript over TypeScript** — I'm faster in JS and the project scope is small enough that the type safety tradeoff wasn't worth the setup time. If this grew into a real product, I'd migrate to TS.

3. **React Three Fiber over Spline** — I initially considered using Spline for 3D animations but switched to React Three Fiber + Drei. This keeps everything in the React ecosystem, avoids external dependencies, and the bundle is way smaller than loading a Spline scene.

4. **Nodemailer SMTP over Resend** — Resend requires a verified custom domain to send emails outside sandbox mode. Since I don't own a domain for this project, I switched to standard SMTP via Nodemailer which works with any email provider (Gmail, etc.) using just an app password.

5. **Google Gemini over Anthropic for AI summaries** — The assignment prefers Anthropic, but their API requires paid credits (minimum $5). I added Gemini as a free-tier fallback that produces equally good summaries. The system tries Anthropic first, then Gemini, then a smart template — so it always works.
