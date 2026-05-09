const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateSummary = async (auditData) => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      messages: [{ 
        role: "user", 
        content: `Generate a ~100-word personalized audit summary for a team's AI tool spend. 
        Audit Data: ${JSON.stringify(auditData)}
        Focus on identifying the biggest overspend and recommended actions with numbers. Be professional and finance-literate.`
      }],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error("Anthropic API Error:", error);
    // Fallback template
    const totalSavings = auditData.totalAnnualSavings || "significant";
    return `Your current AI stack has been audited. We've identified potential annual savings of $${totalSavings}. By optimizing your seat counts and switching to more cost-effective plans for tools like ${Object.keys(auditData.tools || {})[0] || 'your core services'}, you can reduce your overhead without sacrificing productivity. Credex can help you capture these savings through discounted credits.`;
  }
};

module.exports = { generateSummary };
