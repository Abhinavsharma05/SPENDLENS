# REFLECTION

## 1. The hardest bug I hit this week

The hardest bug was the email service failing silently in deployment. I initially used Resend as my transactional email provider, which worked perfectly in their sandbox mode. But when I tried to actually send emails to real addresses, every request returned a 403 error. After digging through their docs and error responses, I realized Resend requires you to verify a custom domain before sending to any email address outside the sandbox. I didn't own a domain for this project, so I was stuck.

My first thought was "maybe I configured the API key wrong," so I regenerated it twice. That didn't help. Then I thought maybe the `from` address format was wrong — I tried `noreply@resend.dev`, my own email, different formats. Nothing worked. Finally, I read their docs more carefully and found the domain verification requirement buried in a FAQ.

The fix was to switch away from Resend entirely. I installed Nodemailer and rewrote the email service to use standard SMTP. This means users can plug in any email provider (Gmail, Outlook, etc.) with just environment variables. I also added a fallback that logs the email content to the server console when SMTP isn't configured, so the app still works for demos without any email setup. This whole experience taught me that "works in sandbox" and "works in production" are very different things.

Also, integrating the LLM for the AI summary was trickier than I expected. Getting the Anthropic API to return consistently useful summaries required a lot of prompt iteration. Antigravity (the AI coding assistant I was using) helped a ton here — we went back and forth tweaking the system prompt, adjusting the max tokens, and building the intelligent fallback summary that kicks in when the API is unavailable.

## 2. A decision I reversed mid-week

I originally planned to use Spline or some third-party 3D design tool for the landing page animations. The idea was to create a flashy 3D scene externally and embed it. But partway through Day 3, I realized this approach had problems: the embed would be heavy (multiple MBs), hard to customize on the fly, and would create a dependency on an external service.

Instead, I switched to building the 3D effects directly in React using React Three Fiber and Drei. I used `MeshDistortMaterial` for the floating spheres, `Stars` for the background particle field, and `Float` for the gentle hovering animation. The result is actually better — the 3D elements are lightweight (rendered on the client's GPU), fully customizable through props, and don't require any external assets. The total bundle impact was minimal compared to loading a full Spline scene. This also kept everything in one codebase, which is cleaner for maintenance and deployment.

## 3. What I would build in week 2

If I had a second week, I would turn SpendLens into the foundation of a full SaaS business spend management platform. The vision is a multi-tiered system that works from the top down — senior leadership gets a high-level dashboard showing company-wide AI spend with trends and benchmarks, department heads see their team's tool usage and optimization opportunities, and individual employees can see their own subscriptions and get personalized recommendations.

I'd integrate payment tracking so the tool doesn't just audit what you're paying — it actually connects to your billing systems and tracks spend in real time. Add Stripe or a similar payment gateway so companies can purchase Credex credits directly through the platform. Build role-based access control so a CTO sees different data than an individual developer. Add historical tracking so you can see your AI spend trend over months. And build an alert system that notifies you when a vendor changes their pricing or when a new, cheaper alternative launches.

Basically, take this one-time audit tool and make it an always-on AI spend management platform — a proper SaaS that companies pay for monthly because it saves them way more than it costs.

## 4. How I used AI tools

I used **Antigravity** (powered by Claude) as my primary AI coding assistant throughout this project. It was my pair programmer for essentially the entire build.

**What I used it for:**
- Scaffolding the backend structure (Express routes, middleware, Prisma schema)
- Writing the React components (Home, Audit, Result pages)
- Debugging the audit engine calculations
- Iterating on the AI summary prompt
- Building the 3D animations with React Three Fiber
- Implementing dark/light mode across all pages
- Switching from Resend to Nodemailer SMTP

**What I didn't trust it with:**
- The actual audit logic and pricing rules — I verified every number against real vendor pricing pages myself. The AI doesn't know current prices and could hallucinate outdated numbers.
- Design decisions — I directed the visual direction (glassmorphism, 3D, color palette) rather than letting the AI choose.
- The entrepreneurial docs (GTM, Economics, User Interviews) — these need real human thinking and real conversations.

**One time the AI was wrong:** When setting up Prisma 7, Antigravity initially generated code using the old Prisma Client initialization pattern (`new PrismaClient({ datasources: ... })`). This doesn't work in Prisma 7 which requires the Driver Adapter pattern. I caught this because the server crashed on startup with a clear error. We had to look up the Prisma 7 migration guide together and rewrite the database service from scratch.

## 5. Self-ratings

| Dimension | Score | Reason |
|---|---|---|
| **Discipline** | 8/10 | I committed on 5+ distinct days and maintained a steady pace, though I could have started the docs earlier instead of leaving them for the last stretch. |
| **Code quality** | 8/10 | The codebase is modular and readable — separate services, clean component structure, proper error handling. I used JavaScript instead of TypeScript which I'd do differently next time. |
| **Design sense** | 10/10 | The UI is genuinely premium — 3D animated backgrounds, glassmorphism panels, smooth Framer Motion transitions, dark/light mode, and a cohesive color system. It looks like a real product, not a homework assignment. |
| **Problem-solving** | 10/10 | I debugged the Prisma 7 breaking changes, fixed the zero-savings audit engine bug, solved the Resend domain issue by switching to SMTP, and handled LLM API failures gracefully with an intelligent fallback — each required methodical hypothesis testing. |
| **Entrepreneurial thinking** | 10/10 | I built this as a real product that Credex could launch, not as a coding exercise. The audit logic is defensible with real pricing data, the lead capture is strategically placed after showing value, and the whole flow is designed as a growth loop (audit → share → new user). |
