# PROMPTS

## The Main Prompt

This is the full prompt sent to the LLM (Anthropic Claude or Google Gemini) to generate the personalized audit summary. It lives in `server/services/summaryService.js`.

```
You are a professional financial auditor specializing in SaaS and AI tool spend.
Generate a concise (~100 words) executive summary for a company's AI spend audit.

Audit Data:
- Total Monthly Savings identified: ${totalMonthlySavings}
- Total Annual Savings identified: ${totalAnnualSavings}
- Team Size: ${teamSize}
- Use Case: ${useCase}

Individual Tool Results:
- [For each tool]: Current spend, Recommendation, Reason

Requirements:
1. Be professional yet punchy.
2. Highlight the single biggest savings opportunity.
3. Mention the "current spend vs recommended price" to show clear value.
4. End with a 1-sentence call to action.
5. Do not use markdown headers or bolding, just plain text.
```

## Why I Wrote It This Way

The prompt is designed to feel like a real CFO reading a financial report. I wanted it to:

1. **Be specific, not generic** — The prompt includes the actual dollar amounts and tool names so the AI doesn't make up numbers. Every data point is injected from the audit results.

2. **Stay short** — I set max_tokens to 300 and asked for ~100 words. Nobody reads a 500-word audit summary. The ideal output is one paragraph that a founder can screenshot and share.

3. **Include a CTA** — The summary always ends with a call to action (book a consultation, etc.) because this tool is ultimately a lead-gen asset for Credex.

4. **No markdown formatting** — I explicitly told the LLM not to use headers or bolding because the output is rendered as plain text inside a styled React component. Markdown artifacts would break the clean look.

## What I Tried That Didn't Work

1. **First attempt — too much data in the prompt.** I initially dumped the entire raw audit object as JSON into the prompt. The AI would then sometimes reference internal field names like "toolId" or "planId" in its output, which looked terrible to the user. Formatting the data as human-readable bullet points fixed this.

2. **Asking for "exactly 100 words"** — The AI would often pad the summary with filler to hit the word count. Changing to "~100 words" gave much better results.

3. **Using a system prompt** — I tried using separate system and user prompts with Anthropic, but found that putting everything in one user message with clear sections produced more consistent results across both Anthropic and Gemini.

## Fallback Summary

When both AI APIs fail (no key, rate limit, network error), the app generates a template-based summary using plain JavaScript logic. It uses the same data to produce a professional-sounding paragraph. This ensures the user always sees a summary, even if the AI is down.
