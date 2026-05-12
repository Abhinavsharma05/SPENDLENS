const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates a data-driven fallback summary when the AI API is unavailable.
 */
const generateFallbackSummary = (auditData) => {
  const totalMonthly = auditData.totalMonthlySavings || 0;
  const totalAnnual = auditData.totalAnnualSavings || 0;
  const toolResults = auditData.toolResults || [];
  const teamSize = auditData.originalData?.teamSize || 'your';
  const useCase = auditData.originalData?.useCase || 'general';

  const totalCurrentSpend = toolResults.reduce((sum, t) => sum + Number(t.spend || 0), 0);

  // Find tool with biggest savings
  const sorted = [...toolResults].sort((a, b) => (b.result?.savings || 0) - (a.result?.savings || 0));
  const top = sorted[0];
  const topName = top?.toolId?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'your primary tool';
  const topSavings = Math.round(top?.result?.savings || 0);
  const topAction = top?.result?.recommendedAction || 'optimizing your plan';

  // Count actionable items
  const actionable = toolResults.filter(t => t.result?.savings > 0).length;

  let summary = `Audit complete for a ${teamSize}-person team (${useCase} focus) spending $${totalCurrentSpend.toLocaleString()}/mo across ${toolResults.length} AI tool${toolResults.length !== 1 ? 's' : ''}. `;

  if (totalMonthly > 0) {
    summary += `We identified ${actionable} actionable optimization${actionable !== 1 ? 's' : ''}. `;
    summary += `Your largest opportunity: ${topAction.toLowerCase()} on ${topName} could recover ~$${topSavings}/mo. `;
    summary += `Total projected savings: $${Math.round(totalMonthly).toLocaleString()}/mo ($${Math.round(totalAnnual).toLocaleString()}/yr). `;
    
    if (totalMonthly > 500) {
      summary += `This represents a significant cost reduction. We recommend scheduling a call with Credex to explore additional infrastructure credits.`;
    } else {
      summary += `Implementing these changes requires minimal disruption and can be completed within one billing cycle.`;
    }
  } else {
    summary += `Your current stack is well-optimized with no immediate savings opportunities. Consider revisiting quarterly as AI tool pricing changes frequently.`;
  }

  return summary;
};

const generateSummary = async (auditData) => {
  // Always try AI-powered summary first
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('No API key configured');
    }

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [{ 
        role: "user", 
        content: `You are a CFO-level AI spend analyst. Generate a concise ~120-word audit summary for this team's AI tool spend data. Include specific dollar amounts, name the tools, and give 2-3 concrete recommendations. Be direct and professional.

Audit Data:
- Team Size: ${auditData.originalData?.teamSize || 'Unknown'}
- Use Case: ${auditData.originalData?.useCase || 'Mixed'}
- Monthly Spend: $${auditData.toolResults?.reduce((s, t) => s + Number(t.spend || 0), 0)}/mo
- Potential Monthly Savings: $${Math.round(auditData.totalMonthlySavings || 0)}/mo
- Tools: ${JSON.stringify(auditData.toolResults?.map(t => ({
          tool: t.toolId,
          plan: t.planId,
          spend: t.spend,
          seats: t.seats,
          action: t.result?.recommendedAction,
          savings: Math.round(t.result?.savings || 0)
        })) || [])}

Write a professional, data-rich executive summary paragraph. No headers, bullets, or markdown—just a single cohesive paragraph.`
      }],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error("Anthropic API Error:", error.message);
    // Use intelligent data-driven fallback
    return generateFallbackSummary(auditData);
  }
};

module.exports = { generateSummary };
