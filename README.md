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

## Troubleshooting

### `npm install` fails with **ENOTEMPTY** or "directory not empty"

- **Cause**: Leftover or locked files in `node_modules` (e.g. after a previous failed install or another process using the folder).
- **Fix**:
  1. Close other terminals/IDEs using this project.
  2. Delete `node_modules` and reinstall:
     ```bash
     Remove-Item -Recurse -Force node_modules   # PowerShell
     npm install
     ```

### Many **TAR_ENTRY_ERROR ENOENT** warnings during `npm install`

- **Cause**: On Windows, long paths in `node_modules` can hit the 260-character limit, so some package files are not extracted. The install may still “succeed” but leave broken packages.
- **Fix**:
  1. **Enable long paths** (run PowerShell as Administrator):
     ```powershell
     New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
     ```
  2. Delete `node_modules` and run `npm install` again.
  3. Alternatively, clone or open the project in a **shorter path** (e.g. `C:\dev\cashflow-stability-lens`).

### **Cannot find module 'caniuse-lite/dist/unpacker/feature'** (or similar)

- **Cause**: The `caniuse-lite` package was installed incompletely (often due to the Windows path/tar issues above).
- **Fix**:
  ```bash
  Remove-Item -Recurse -Force node_modules\caniuse-lite
  npm install caniuse-lite
  ```
  Then run `npm run dev` again.

### **Could not resolve "./circle-x.js"** (or many **lucide-react** icon paths)

- **Cause**: The `lucide-react` package is missing icon files (again, often due to extraction issues on Windows).
- **Fix**:
  ```bash
  Remove-Item -Recurse -Force node_modules\lucide-react
  npm install lucide-react
  ```

### **Could not resolve "./_root"** (or other **lodash** internal modules)

- **Cause**: The `lodash` package is incomplete.
- **Fix**:
  ```bash
  Remove-Item -Recurse -Force node_modules\lodash
  npm install lodash
  ```

### **The following dependencies could not be resolved: @/App.jsx, @/index.css**

- **Cause**: The `@/` path alias (pointing to `src/`) was not configured in Vite.
- **Fix**: Ensure `vite.config.js` includes a `resolve.alias` entry for `'@'` to `./src`. If you’re on a fresh clone, this should already be present.

### **Dev server starts but the tab icon (favicon) is wrong or missing**

- **Cause**: The favicon path in `index.html` doesn’t match the file in `public/`.
- **Fix**: Place your icon (e.g. `capital-pack-logo.png`) in the `public/` folder. The link in `index.html` should be:
  ```html
  <link rel="icon" type="image/png" href="/capital-pack-logo.png" />
  ```
  Restart the dev server and hard-refresh the page (Ctrl+Shift+R or Cmd+Shift+R) to avoid cache.

### **Uploading the same CSV again after fixing it does nothing**

- **Cause**: The file input doesn’t fire `change` when you pick the same filename again.
- **Fix**: The app clears the file input after each upload so you can re-select the same file. If you still see old behavior, do a hard refresh; the current implementation should allow re-uploading the same filename.

### **Port 5173 already in use**

- **Cause**: Another app or a previous Vite process is using the port.
- **Fix**: Stop the other process or let Vite use the next available port (it will print the URL in the terminal).

---

## Project structure (high level)

- `src/pages/Home.jsx` – Main page: upload, results layout, score, metrics, flags, charts
- `src/components/cashflow/` – FileUpload, MetricCard, ScoreDisplay, RiskFlags, SummaryStats, CashflowCharts, csvParser, metricsCalculator
- `src/lib/` – AuthContext (local dev user), app-params, NavigationTracker, etc.
- `src/api/localClient.js` – Local API shim (auth + console logging)
- `public/` – Static assets (e.g. favicon, logo)

---

## License and support

See the repository for license details. This app runs locally with no external services required.
