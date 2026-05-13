const { Anthropic } = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Primary: Anthropic (as per assignment preference)
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// Secondary/Free Tier: Google Gemini (Free up to 15 RPM)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const generateSummary = async (auditData) => {
  const prompt = `
    You are a professional financial auditor specializing in SaaS and AI tool spend.
    Generate a concise (~100 words) executive summary for a company's AI spend audit.
    
    Audit Data:
    - Total Monthly Savings identified: $${auditData.totalMonthlySavings}
    - Total Annual Savings identified: $${auditData.totalAnnualSavings}
    - Team Size: ${auditData.originalData?.teamSize || 'Unknown'}
    - Use Case: ${auditData.originalData?.useCase || 'General'}
    
    Individual Tool Results:
    ${auditData.toolResults.map(t => `- ${t.toolId}: Current $${t.spend}/mo. Recommendation: ${t.result.recommendedAction}. Reason: ${t.result.reason}`).join('\n')}

    Requirements:
    1. Be professional yet punchy.
    2. Highlight the single biggest savings opportunity.
    3. Mention the "current spend vs recommended price" to show clear value.
    4. End with a 1-sentence call to action.
    5. Do not use markdown headers or bolding, just plain text.
  `;

  // 1. Try Anthropic first (Assignment Preference)
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].text;
    } catch (error) {
      console.error("Anthropic API failed, trying Gemini...");
    }
  }

  // 2. Try Gemini (Free Alternative)
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API failed, falling back to template...");
    }
  }

  // 3. Fallback: Templated Logic
  return generateFallbackSummary(auditData);
};

const generateFallbackSummary = (auditData) => {
  const { totalAnnualSavings, toolResults } = auditData;
  const bestSaving = [...toolResults].sort((a, b) => b.result.savings - a.result.savings)[0];
  
  if (!bestSaving || totalAnnualSavings === 0) {
    return "Your AI stack is currently highly optimized. We found no significant waste across your tools. We recommend staying on your current plans and checking back in 3 months as new enterprise credits become available through Credex.";
  }

  return `We identified a significant optimization opportunity in your AI stack with total projected annual savings of $${totalAnnualSavings.toLocaleString()}. The biggest win is with ${bestSaving.toolId}, where you are currently overpaying. By implementing our recommended action of "${bestSaving.result.recommendedAction}", you can drastically reduce your monthly burn while maintaining the same level of capability. This audit represents a clear path to higher efficiency. We recommend booking a Credex consultation to capture these savings immediately.`;
};

module.exports = { generateSummary };
