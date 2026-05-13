import { describe, it, expect } from 'vitest';
import { auditEngine } from '../auditEngine';

describe('Audit Engine Logic', () => {
  const defaultGlobal = { teamSize: 2, useCase: 'coding' };

  it('should recommend Cursor Pro when using GitHub Copilot for coding', () => {
    const data = {
      tools: [{ id: '1', toolId: 'github_copilot', planId: 'business', spend: 38, seats: 2 }],
      ...defaultGlobal
    };
    const results = auditEngine(data);
    const copilotResult = results.toolResults.find(r => r.toolId === 'github_copilot');
    
    expect(copilotResult.result.recommendedAction).toBe('Switch to Cursor Pro');
    expect(copilotResult.result.savings).toBeGreaterThan(0);
  });

  it('should recommend consolidating when multiple chat tools are used', () => {
    const data = {
      tools: [
        { id: '1', toolId: 'chatgpt', planId: 'plus', spend: 20, seats: 1 },
        { id: '2', toolId: 'claude', planId: 'pro', spend: 20, seats: 1 }
      ],
      ...defaultGlobal
    };
    const results = auditEngine(data);
    const hasConsolidation = results.toolResults.some(r => r.result.recommendedAction.includes('Consolidate'));
    
    expect(hasConsolidation).toBe(true);
    expect(results.totalMonthlySavings).toBeGreaterThan(0);
  });

  it('should identify ghost seat waste for optimized tools', () => {
    const data = {
      tools: [{ id: '1', toolId: 'cursor', planId: 'pro', spend: 40, seats: 2 }],
      ...defaultGlobal
    };
    const results = auditEngine(data);
    const cursorResult = results.toolResults.find(r => r.toolId === 'cursor');
    
    expect(cursorResult.result.recommendedAction).toBe('Review Seat Utilization');
    expect(cursorResult.result.savings).toBe(4); // 10% of 40
  });

  it('should correctly calculate annual savings', () => {
    const data = {
      tools: [{ id: '1', toolId: 'chatgpt', planId: 'team', spend: 60, seats: 2 }],
      teamSize: 2,
      useCase: 'writing'
    };
    const results = auditEngine(data);
    expect(results.totalAnnualSavings).toBe(results.totalMonthlySavings * 12);
  });

  it('should handle API direct spend with prompt caching recommendation', () => {
    const data = {
      tools: [{ id: '1', toolId: 'openai_api', planId: 'payg', spend: 200, seats: 1 }],
      ...defaultGlobal
    };
    const results = auditEngine(data);
    const apiResult = results.toolResults.find(r => r.toolId === 'openai_api');
    
    expect(apiResult.result.recommendedAction).toBe('Implement Prompt Caching');
    expect(apiResult.result.savings).toBe(60); // 30% of 200
  });
});
