# TESTS

## Automated Tests

All tests are located in `client/src/utils/__tests__/auditEngine.test.js` and cover the core audit engine logic.

### How to Run

```bash
cd client
npm test
```

### Test List

| # | Test Name | What It Covers |
|---|---|---|
| 1 | GitHub Copilot → Cursor Pro switch | Verifies that a coding team using GitHub Copilot Business gets a recommendation to switch to Cursor Pro, and savings are calculated correctly |
| 2 | ChatGPT Team downgrade for small teams | Verifies that a team of 2 on ChatGPT Team is correctly told to downgrade to Plus, saving $10/seat/mo |
| 3 | Cursor Business → Pro for small teams | Verifies that a team of 3 on Cursor Business gets recommended to move to Pro (since they don't need SOC2/SSO) |
| 4 | API spend prompt caching recommendation | Verifies that high API spend (>$100/mo) triggers a "Implement Prompt Caching" recommendation with 30% estimated savings |
| 5 | Ghost seat detection | Verifies that tools with no specific optimization still flag 10% potential ghost seat waste |
| 6 | Free plan — no false savings | Verifies that a user on a free plan doesn't get fake savings manufactured. The tool should be honest |
| 7 | Redundancy detection for multiple chat LLMs | Verifies that if a user has both ChatGPT and Claude, the engine recommends consolidating into one |
| 8 | Total annual savings calculation | Verifies that `totalAnnualSavings = totalMonthlySavings * 12` is computed correctly across the full audit |

### Notes

- Tests use Vitest (bundled with the Vite project).
- All tests target the `auditEngine.js` file, which contains the core business logic.
- The audit engine is intentionally client-side and rule-based (no AI) so that results are deterministic and testable.
