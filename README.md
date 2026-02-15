# Cashflow Stability Lens

## About

**Cashflow Stability Lens** is a short-term cash flow stability scoring tool that helps lenders evaluate repayment risk before approving credit. Using recent bank transaction data, it calculates a **Stability Score** and categorizes applicants into **Stable**, **Watch**, or **Risky** tiers.

### What it does

- **Upload CSV** – Users upload a bank-statement CSV with a required set of columns. All processing happens in the browser; no transaction data is sent to a server.
- **Stability Score** – A 0–100 score based on:
  - **Income volatility** – How predictable monthly income is
  - **Surplus strength** – Whether income consistently exceeds expenses
  - **Cash buffer** – How many days of expenses the current balance could cover
  - **Income trend** – Whether income is improving or declining over time
- **Risk tier** – Stable (80+), Watch (50–79), or Risky (below 50).
- **Risk flags** – Short, actionable notes (e.g. high volatility, low surplus, thin cash buffer).
- **Charts** – Income vs expenses and balance over time by month.
- **Metric cards** – Per-metric scores and explanations.

### Tech stack

- **React 18** + **Vite 6**, **Tailwind CSS**, **Framer Motion**, **Recharts**. Runs entirely on localhost with no backend or auth (single dev user).

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node)

---

## How to run

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd cashflow-stability-lens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

- Open **http://localhost:5173** in your browser (Vite may use a different port if 5173 is in use; check the terminal).

---

## CSV format

The app expects a CSV with **exactly** these column headers (spelling and order matter for validation):

- `date`
- `type`
- `description`
- `amount`
- `current balance`

**Example:**

```csv
Date,Type,Description,Amount,Current Balance
1/5/2025,Deposit,Direct Deposit - Employer,3500.00,5200.00
1/7/2025,Debit Card,Grocery Store,-125.50,5074.50
1/10/2025,Withdrawal,ATM Withdrawal,-200.00,4874.50
```

- **Date**: `M/D/YYYY` or `YYYY-MM-DD`
- **Amount**: numeric (negative for outflows)
- **Current balance**: numeric, after each transaction

If columns are missing or misspelled, the UI shows an error and highlights the missing column names. You can fix the file and re-upload (including re-selecting the same filename).


## Project structure (high level)

- `src/pages/Home.jsx` – Main page: upload, results layout, score, metrics, flags, charts
- `src/components/cashflow/` – FileUpload, MetricCard, ScoreDisplay, RiskFlags, SummaryStats, CashflowCharts, csvParser, metricsCalculator
- `src/lib/` – AuthContext (local dev user), app-params, NavigationTracker, etc.
- `src/api/localClient.js` – Local API shim (auth + console logging)
- `public/` – Static assets (e.g. favicon, logo)

---

## Source Acknowledgment

This project was initially developed with assistance from Base44. Cursor was also utilized as a tool for debugging. 
All business logic, scoring methodology, and financial models were designed and implemented independently.


