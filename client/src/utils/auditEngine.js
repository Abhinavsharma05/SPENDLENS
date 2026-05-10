export const evaluateTool = (tool, globalState) => {
  let recommendedAction = "";
  let savings = 0;
  let reason = "";

  const spend = Number(tool.spend);
  const seats = Number(tool.seats);

  if (tool.toolId === 'github_copilot') {
    if (globalState.useCase === 'coding') {
      recommendedAction = "Switch to Cursor Pro";
      const cursorSpend = 20 * seats;
      if (spend > cursorSpend) {
        savings = spend - cursorSpend;
        reason = "Cursor Pro is heavily optimized for coding workflows and often replaces Copilot at a lower or equal total cost with more capability.";
      } else {
        reason = "You're spending well, but Cursor might offer better coding features.";
      }
    }
  }

  if (tool.toolId === 'chatgpt') {
    if (tool.planId === 'team' && seats < 3) {
      recommendedAction = "Downgrade to ChatGPT Plus";
      const newSpend = 20 * seats;
      savings = spend - newSpend;
      reason = "Team plans have high minimums; for small teams, individual Plus accounts are more cost-effective.";
    } else if (globalState.useCase === 'writing' && tool.planId !== 'free') {
      recommendedAction = "Switch to Claude Free / Pro";
      savings = spend - (20 * seats); // Or 0 if free
      reason = "Claude excels at writing tasks and might require fewer paid seats for your workflow.";
      if (savings < 0) savings = 0;
    }
  }
  
  if (tool.toolId === 'cursor' && tool.planId === 'business' && seats < 5) {
     recommendedAction = "Downgrade to Cursor Pro";
     const newSpend = 20 * seats;
     savings = Math.max(0, spend - newSpend);
     reason = "Cursor Business is designed for larger teams requiring centralized billing and privacy. Pro is sufficient for small teams.";
  }

  if (spend > 0 && savings === 0) {
    recommendedAction = "Maintain current plan";
    reason = "Your plan fits your current team size and use case perfectly.";
  }

  return { recommendedAction, savings, reason, originalSpend: spend };
};

export const auditEngine = (data) => {
  const { tools, teamSize, useCase } = data;
  let totalMonthlySavings = 0;
  const toolResults = [];

  for (const t of tools) {
    const result = evaluateTool(t, { teamSize, useCase });
    totalMonthlySavings += result.savings;
    toolResults.push({
      ...t,
      result
    });
  }

  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalMonthlySavings,
    totalAnnualSavings,
    toolResults,
    originalData: data
  };
};
