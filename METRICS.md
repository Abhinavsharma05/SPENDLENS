# METRICS

## North Star Metric

**Qualified Leads Generated Per Week**

A "qualified lead" = someone who completed an audit showing >$100/mo in savings AND entered their email.

Why this and not something else:
- "Audits completed" doesn't matter if they don't convert. Someone who runs an audit and bounces hasn't helped Credex.
- "DAU" is the wrong metric for a tool people use once or twice a year. Nobody audits their AI spend daily.
- "Revenue" is too far downstream at this stage — we need to prove the funnel works first.

Qualified leads are the metric that directly connects to Credex's business model. More qualified leads = more consultation bookings = more credit sales.

## 3 Input Metrics That Drive the North Star

1. **Audit Completion Rate** — What % of visitors who land on the audit page actually finish and see results? This tells us if the form is too long, confusing, or has friction. Target: >20%.

2. **Savings Hit Rate** — What % of completed audits show >$100/mo in real savings? If this is too low, our audit logic isn't finding real waste, and the tool isn't useful. If it's too high, we might be inflating numbers. Target: 25–40%.

3. **Email Capture Rate** — What % of users who see results enter their email? This is where value turns into a lead. If people see savings but don't give us their email, the results page isn't compelling enough. Target: >15%.

## What I'd Instrument First

If I had analytics set up tomorrow, these are the first 5 events I'd track:

1. `page_view` — on Home, Audit, and Results pages (basic traffic)
2. `audit_started` — user adds their first tool on the audit page
3. `audit_completed` — user clicks "Run AI Audit"
4. `email_submitted` — user enters their email on the results page
5. `result_shared` — user copies or clicks the shareable URL

With just these 5 events, I can calculate all 3 input metrics and the North Star.

## What Number Triggers a Pivot

If after 500 completed audits, the **email capture rate is below 5%**, something is fundamentally broken. Either:
- The savings numbers aren't believable (trust issue)
- The savings are too small to act on (product issue)
- The value proposition for entering an email isn't clear (UX issue)

At that point, I'd pivot the approach — maybe offer the full report as a downloadable PDF (gated behind email) instead of showing everything upfront, or add a benchmark comparison ("your spend per developer is 2x the industry average") to create more urgency.

If the audit completion rate is below 10%, the form itself needs to be simplified — maybe pre-fill common stacks or let users pick from templates instead of building from scratch.
