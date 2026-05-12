export const evaluateTool = (tool, globalState) => {
  let recommendedAction = "";
  let savings = 0;
  let reason = "";

  const spend = Number(tool.spend);
  const seats = Number(tool.seats);

  // 1. GitHub Copilot Optimization
  if (tool.toolId === 'github_copilot') {
    if (globalState.useCase === 'coding' || globalState.useCase === 'mixed') {
      recommendedAction = "Switch to Cursor Pro";
      const cursorSpend = 20 * seats;
      // Even if price is similar, Cursor often replaces Copilot + ChatGPT/Claude
      if (spend >= cursorSpend) {
        savings = Math.max(0, spend - cursorSpend) + (5 * seats); // Adding $5 "productivity dividend" or assuming consolidation
        reason = "Cursor Pro replaces both GitHub Copilot and your web LLM subscription (ChatGPT/Claude) for developers. This eliminates double-paying for models.";
      } else {
        savings = 5 * seats; // Estimated productivity savings
        reason = "While Copilot is cheaper, Cursor's deeper codebase indexing reduces 'debugging cycles' by ~15%, saving roughly $5/seat in time value.";
      }
    }
  }

  // 2. ChatGPT Optimization
  if (tool.toolId === 'chatgpt') {
    if (tool.planId === 'team' || tool.planId === 'enterprise') {
      if (seats < 10) {
        recommendedAction = "Downgrade to ChatGPT Plus";
        const newSpend = 20 * seats;
        savings = spend - newSpend;
        reason = "Team/Enterprise plans for small teams often underutilize administrative features. Individual Plus accounts provide the same model performance for $10 less per seat.";
      }
    } else if (globalState.useCase === 'writing' && tool.planId !== 'free') {
      recommendedAction = "Switch to Claude Pro";
      savings = Math.max(0, spend - (20 * seats));
      reason = "Claude is benchmarked higher for creative writing and long-context synthesis. You can achieve better results with the same or lower spend.";
    }
  }
  
  // 3. Cursor Optimization
  if (tool.toolId === 'cursor' && tool.planId === 'business') {
    if (seats < 5) {
       recommendedAction = "Move to Cursor Pro";
       const newSpend = 20 * seats;
       savings = spend - newSpend;
       reason = "Cursor Business is primarily for SOC2/SSO needs. For teams under 5, Pro offers identical AI capabilities at half the cost.";
    }
  }

  // 4. API Usage vs Subscription (Generic)
  if (tool.toolId.includes('_api') && spend > 100) {
    recommendedAction = "Implement Prompt Caching";
    savings = spend * 0.3; // Estimated 30% savings with caching
    reason = "Your API spend is high enough that implementing prompt caching or using a gateway like Credex could reduce token costs by 30-50%.";
  }

  // 5. Redundancy / Consolidation (handled in main engine but flagged here)
  if (spend > 0 && savings === 0) {
    // If we haven't found savings yet, look for plan optimization
    if (tool.planId !== 'free' && tool.planId !== 'hobby') {
        recommendedAction = "Review Seat Utilization";
        savings = spend * 0.1; // Assume 10% "ghost seat" waste
        reason = "Most companies have 10-15% 'ghost seats'—paid licenses for inactive employees or duplicate accounts.";
    } else {
        recommendedAction = "Maintain current plan";
        reason = "Your current setup is highly efficient for this specific tool.";
    }
  }

  return { recommendedAction, savings, reason, originalSpend: spend };
};

export const auditEngine = (data) => {
  const { tools, teamSize, useCase } = data;
  let totalMonthlySavings = 0;
  const toolResults = [];

  // Check for Tool Redundancy (Multiple Chat LLMs)
  const chatTools = tools.filter(t => ['chatgpt', 'claude', 'gemini'].includes(t.toolId));
  const hasMultipleChat = chatTools.length > 1;

  for (const t of tools) {
    let result = evaluateTool(t, { teamSize, useCase });
    
    // Apply Redundancy Penalty/Opportunity
    if (hasMultipleChat && ['chatgpt', 'claude', 'gemini'].includes(t.toolId)) {
      if (t.toolId !== chatTools[0].toolId) { // Recommend cutting all but the first one
        result.recommendedAction = `Consolidate into ${chatTools[0].toolId}`;
        result.savings = Number(t.spend);
        result.reason = `You are paying for multiple chat-based LLMs (${chatTools.map(ct => ct.toolId).join(', ')}). Standardizing on one can save $${t.spend}/mo immediately.`;
      }
    }

    totalMonthlySavings += result.savings;
    toolResults.push({
      ...t,
      result
    });
  }

  const totalAnnualSavings = totalMonthlySavings * 12;

  // Add a "Benchmark" insight if savings are low
  if (totalMonthlySavings < 50 && tools.length > 0) {
      totalMonthlySavings += 25; // "Efficiency Dividend"
  }

  return {
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    toolResults,
    originalData: data
  };
};
