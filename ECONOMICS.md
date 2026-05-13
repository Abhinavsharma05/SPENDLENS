# ECONOMICS

## What's a Converted Lead Worth to Credex

Credex sells discounted AI infrastructure credits. A typical B2B customer buying credits for their team would spend somewhere between $500–$5,000/year on credits. If Credex's margin on those credits is ~20% (they're reselling overforecasted/surplus credits at a discount), that's **$100–$1,000 gross profit per converted customer per year.**

For this analysis, I'll use a conservative estimate of **$300/year average revenue per converted lead** (a small startup buying credits for 5-10 seats at a modest discount).

## CAC by Channel

| Channel | Estimated CAC | Reasoning |
|---|---|---|
| Short-form content (TikTok/Reels) | ~$0 | Free to post, time cost only. If one video gets 10k views and 1% click through, that's 100 visitors. At 10% audit completion and 5% conversion: ~0.5 customers per video. |
| Twitter/X threads | ~$0 | Same logic. Organic reach. Maybe 2–3 customers per viral thread. |
| Reddit/HN posts | ~$0 | These communities love free tools. One good Show HN can drive 500+ signups in a day. |
| LinkedIn DMs to HRs | ~$2–5 | Time cost of personalization. But HR/procurement people can convert entire teams at once, so the deal size is higher. |
| Word of mouth (shared audits) | ~$0 | The shareable URL is the distribution. Zero cost per referred user. |

**Blended CAC with $0 paid budget: effectively $0–$5 per lead.** The tool itself is the marketing.

## Conversion Funnel

Here's my estimated conversion at each step:

```
1,000 visitors to SpendLens
  → 200 complete an audit (20% completion rate)
    → 60 have >$100/mo savings identified (30% of audits)
      → 30 enter their email (50% email capture)
        → 10 book a Credex consultation (33% of email leads)
          → 3 actually purchase credits (30% close rate)
```

So: **1,000 visitors → 3 paying customers → 0.3% overall conversion rate.**

At $300/year per customer, that's $900 revenue per 1,000 visitors.

## What Makes This Profitable

Since CAC is near-zero (all organic channels), the unit economics work even at low conversion rates:

- **Revenue per 1,000 visitors:** $900
- **Cost per 1,000 visitors:** ~$0 (organic) + ~$5 server costs (Neon free tier, Render free tier, Gemini free tier)
- **Gross margin:** ~99%

The tool pays for itself immediately. The only real cost is the developer time to build and maintain it.

## Path to $1M ARR in 18 Months

For $1M ARR at $300/customer/year, Credex needs **~3,333 paying customers.**

Working backwards from the funnel:
- 3,333 customers ÷ 0.3% conversion = **~1.1M unique visitors** needed over 18 months
- That's ~61,000 visitors/month or ~2,000/day

Is that realistic? Here's how:

1. **Months 1–3:** Organic launch gets to 5,000 visitors/month (100 customers). Revenue: $30k ARR.
2. **Months 4–6:** SEO kicks in for "AI tool pricing comparison" keywords. Content marketing adds 15,000 visitors/month. Revenue: $150k ARR.
3. **Months 7–12:** Paid ads start (now justified by proven unit economics). $50/day on LinkedIn ads targeting engineering managers. Plus partnerships with tech newsletters. 40,000 visitors/month. Revenue: $500k ARR.
4. **Months 13–18:** Word of mouth + referral program + enterprise sales. 60,000+ visitors/month. Revenue: $1M ARR.

**What would have to be true:**
- The conversion funnel holds at 0.3% or improves with product iteration
- Credex's credit margins stay at ~20%+
- Average deal size grows as larger companies adopt (enterprise deals at $2-5k/year would dramatically accelerate this)
- The audit tool stays relevant as AI pricing evolves (requires ongoing maintenance)

The biggest risk is that AI tool pricing stabilizes and there's less "waste" to find. The biggest upside is that this tool becomes the default "second opinion" every startup checks before buying AI tools.
