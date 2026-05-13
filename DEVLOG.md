# DEVLOG

## Day 1 — 2026-05-08
**Hours worked:** 3
**What I did:** Read the full assignment PDF carefully and planned out the project scope. Set up the GitHub repo, created the full folder structure for both the client (React/Vite) and server (Express/Prisma). Decided on the name "SpendLens" since it frames the tool as a lens into your AI spending habits. Picked React + Vite for frontend because I wanted fast dev experience and am most comfortable with React. Chose Express for the backend since it pairs well with Prisma and keeps things simple.
**What I learned:** The assignment is way more than just code — the entrepreneurial files (GTM, Economics, User Interviews) carry 25% of the grade. Need to plan time for those too.
**Blockers / what I'm stuck on:** Nothing major yet, just figuring out how to structure the audit engine logic so it's defensible and not just random rules.
**Plan for tomorrow:** Build the full backend — routes, middleware, Prisma schema, and the AI summary service.

## Day 2 — 2026-05-09
**Hours worked:** 6
**What I did:** Built the entire backend in one go. Set up Express server with CORS and rate limiting middleware. Created the Prisma schema with an Audit model for storing leads and results. Integrated the Anthropic SDK for AI-powered summaries with a smart fallback if the API fails. Built the email service using Resend. Created modular route files for `/api/audit` and `/api/leads`. Hit a big issue with Prisma 7 initialization — the new version requires Driver Adapters instead of the old connection string approach. Had to refactor the whole DB layer to use the `pg` driver adapter.
**What I learned:** Prisma 7 has breaking changes from v6. The Driver Adapter pattern is cleaner but the migration docs were sparse. Spent a good hour debugging "PrismaClient is not a constructor" errors before finding the right config.
**Blockers / what I'm stuck on:** Prisma 7 setup took way longer than expected. Also realized I need to think more carefully about the audit engine rules — they need to be specific and backed by real pricing data.
**Plan for tomorrow:** Build the full frontend — Home page with 3D animations, Audit form, and Results page.

## Day 3 — 2026-05-10
**Hours worked:** 5
**What I did:** Built the complete frontend prototype. Created the Home page with a 3D animated background using React Three Fiber and Drei — floating distorted spheres and a starfield that give a premium, modern feel. Built the Audit page with a dynamic form where users add tools, pick plans, set seats, and see spend auto-calculate. Built the Results page with a big savings hero number, per-tool breakdown cards, AI summary section, and a lead capture form. Connected the frontend to the backend API for AI summaries. Added localStorage persistence so the form state survives page reloads.
**What I learned:** React Three Fiber is great for adding 3D without leaving the React ecosystem — no need for Spline or external 3D tools. Framer Motion pairs well with it for entrance animations. Keeping the 3D subtle (background only) avoids performance issues on mobile.
**Blockers / what I'm stuck on:** The audit engine was returning zero savings for everything because my conditional logic had issues — some rules weren't triggering properly. Noted this to fix later.
**Plan for tomorrow:** Take a short break, then come back to fix the audit engine and polish the UI.

## Day 4 — 2026-05-11
**Hours worked:** 0
Took a day off — had personal commitments and needed a mental reset before the final push.

## Day 5 — 2026-05-12
**Hours worked:** 5
**What I did:** Debugged and fixed the audit engine. The zero-savings bug was caused by the evaluate function not matching tool IDs correctly in some branches, and the redundancy detection logic wasn't properly comparing chat tools. Fixed all the calculation paths — now GitHub Copilot correctly recommends switching to Cursor Pro, ChatGPT Team correctly suggests downgrading for small teams, and the consolidation logic properly detects when you're paying for multiple overlapping LLMs. Also improved the AI summary to be more data-rich with specific dollar amounts.
**What I learned:** The audit logic needs to handle edge cases carefully — like what happens when someone has 0 spend, or when a "free" plan user is being audited. Every branch needs a sensible fallback, not just the happy path.
**Blockers / what I'm stuck on:** The Resend email service needs a verified domain to send emails in production. For now it works in test mode. Need to figure out if I should switch to SMTP.
**Plan for tomorrow:** Add dark/light mode, fix remaining UI contrast issues, and work on the markdown documentation files.

## Day 6 — 2026-05-13
**Hours worked:** 4
**What I did:** Added a dark/light mode toggle with localStorage persistence — the whole app now transitions smoothly between themes. Fixed text contrast issues in light mode where text was blending into glass-panel backgrounds. Switched the email service from Resend to standard SMTP via Nodemailer so it works without needing a verified domain. Updated the audit engine and AI summary to show the current plan price alongside savings (not just "you save X" but "you're paying X, you could pay Y, saving Z"). Added `npm run server` script to make the server easier to start. Wrote the devlog and reflection docs.
**What I learned:** Dark mode and light mode support is more than just swapping background colors — every single text element, border, input field, and glass panel needs its own light/dark variant or you get invisible text. It's tedious but makes a huge difference in polish.
**Blockers / what I'm stuck on:** Still need to deploy, write tests, and finish the entrepreneurial markdown files.
**Plan for tomorrow:** Write tests for the audit engine, set up CI, deploy to Vercel/Render, and complete all remaining docs.

## Day 7 — 2026-05-14
**Hours worked:** (planned)
**What I did:** Final deployment, testing, CI setup, and documentation completion.
**What I learned:** TBD
**Blockers / what I'm stuck on:** TBD
**Plan for tomorrow:** Submit!
