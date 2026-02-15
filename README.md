**About**

A short-term cash flow stability scoring tool that helps lenders evaluate repayment risk before approving credit. Using recent bank transactions, Cashflow Stability Lens calculates a Stability Score based on income consistency, spending behavior, cash buffers, and deficit patterns, categorizing applicants into Stable, Watch, or Risky tiers. The system also generates actionable risk flags and visualizes income, spending, and balance trends for transparent, audit-friendly decision-making.

**Run locally**

1. Clone the repo and go to the project directory.
2. Install dependencies: `npm install`
3. Optional: add `.env.local` if you use a backend later:
   ```
   VITE_API_URL=http://localhost:3000
   ```
4. Start the app: `npm run dev`

The app runs on localhost with a single dev user (no login). Page views are logged to the browser console as `[AppLog] logUserInApp { pageName, timestamp }`.
