// Cashflow Metrics Calculator
import { format } from 'date-fns';

export function calculateMetrics(transactions) {
  const categorized = transactions.map(t => ({
    ...t,
    category: t.amount >= 0 ? 'income' : 'expense'
  }));

  // Group by month
  const monthlyData = groupByMonth(categorized);
  const months = Object.keys(monthlyData).sort();

  if (months.length === 0) {
    return null;
  }

  // Calculate monthly income and expenses
  const monthlyIncome = months.map(m => monthlyData[m].income);
  const monthlyExpenses = months.map(m => monthlyData[m].expenses);
  const monthlyBalances = months.map(m => monthlyData[m].endBalance);

  // Mean income, expenses, and balance
  const meanIncome = mean(monthlyIncome);
  const meanExpenses = mean(monthlyExpenses);
  const avgBalance = mean(monthlyBalances);

  // 1. Income Volatility (CV_I) - Coefficient of Variation
  const incomeVolatility = meanIncome > 0 ? standardDeviation(monthlyIncome) / meanIncome : 0;

  // 2. Surplus Ratio (SR)
  const surplusRatio = meanIncome > 0 ? (meanIncome - meanExpenses) / meanIncome : 0;

  // 3. Cash Buffer Days (CBD) - using average balance
  const dailySpending = meanExpenses / 30;
  const cashBufferDays = dailySpending > 0 ? avgBalance / dailySpending : 999;

  // 4. Income Trend (T)
  const firstIncome = monthlyIncome[0] || 0;
  const lastIncome = monthlyIncome[monthlyIncome.length - 1] || 0;
  const incomeTrend = firstIncome > 0 ? (lastIncome - firstIncome) / firstIncome : 0;

  // Calculate individual metric scores
  const incomeVolatilityScore = calculateIncomeVolatilityScore(incomeVolatility);
  const surplusStrengthScore = calculateSurplusStrengthScore(surplusRatio);
  const cashBufferScore = calculateCashBufferScore(cashBufferDays);
  const incomeTrendScore = calculateIncomeTrendScore(incomeTrend);

  // Calculate overall Stability Score (weighted average of component scores)
  const stabilityScore = Math.round(
    0.30 * incomeVolatilityScore.score +
    0.30 * surplusStrengthScore.score +
    0.30 * cashBufferScore.score +
    0.10 * incomeTrendScore.score
  );

  // Determine risk tier
  const riskTier = getRiskTier(stabilityScore);

  // Generate flags/explanations
  const flags = generateFlags(incomeVolatility, surplusRatio, cashBufferDays, incomeTrend);

  // Prepare chart data
  const chartData = months.map(m => ({
    month: m,
    income: monthlyData[m].income,
    expenses: monthlyData[m].expenses,
    balance: monthlyData[m].endBalance
  }));

  const latestBalance = transactions[transactions.length - 1]?.balance || 0;

  return {
    metrics: {
      incomeVolatility: {
        ...incomeVolatilityScore,
        raw_value: incomeVolatility,
        display: `${(incomeVolatility * 100).toFixed(1)}%`,
        label: 'Income Volatility Score'
      },
      surplusRatio: {
        ...surplusStrengthScore,
        raw_value: surplusRatio,
        display: `${(surplusRatio * 100).toFixed(1)}%`,
        label: 'Surplus Strength Score'
      },
      cashBufferDays: {
        ...cashBufferScore,
        raw_value: cashBufferDays,
        display: `${Math.round(cashBufferDays)} days`,
        label: 'Cash Buffer Score'
      },
      incomeTrend: {
        ...incomeTrendScore,
        raw_value: incomeTrend,
        display: `${incomeTrend >= 0 ? '+' : ''}${(incomeTrend * 100).toFixed(1)}%`,
        label: 'Income Trend Score'
      }
    },
    stabilityScore,
    riskTier,
    flags,
    chartData,
    summary: {
      totalTransactions: transactions.length,
      monthsAnalyzed: months.length,
      avgMonthlyIncome: meanIncome,
      avgMonthlyExpenses: meanExpenses,
      currentBalance: latestBalance
    }
  };
}

// Income Volatility Score (IVS)
function calculateIncomeVolatilityScore(cv_i) {
  let score;
  if (cv_i <= 0.10) score = 100;
  else if (cv_i <= 0.20) score = 85;
  else if (cv_i <= 0.35) score = 70;
  else if (cv_i <= 0.50) score = 50;
  else score = 25;

  let category;
  if (score >= 85) category = "Strong Stability";
  else if (score >= 70) category = "Stable";
  else if (score >= 50) category = "Moderate Risk";
  else if (score >= 30) category = "High Risk";
  else category = "Severe Risk";

  return {
    score,
    category,
    interpretation: "Measures how predictable monthly income is. High volatility increases short-term repayment risk."
  };
}

// Surplus Strength Score (SSS)
function calculateSurplusStrengthScore(sr) {
  let score;
  if (sr >= 0.25) score = 100;
  else if (sr >= 0.15) score = 85;
  else if (sr >= 0.05) score = 70;
  else if (sr >= 0.00) score = 50;
  else score = 20;

  let category;
  if (score >= 85) category = "Strong Surplus";
  else if (score >= 70) category = "Adequate";
  else if (score >= 50) category = "Thin Margin";
  else if (score >= 30) category = "Structural Risk";
  else category = "Deficit Risk";

  return {
    score,
    category,
    interpretation: "Measures whether income consistently exceeds expenses. Persistent deficits significantly increase delinquency risk."
  };
}

// Cash Buffer Score (CBS)
function calculateCashBufferScore(cbd) {
  let score;
  if (cbd >= 90) score = 100;
  else if (cbd >= 45) score = 85;
  else if (cbd >= 15) score = 70;
  else if (cbd >= 7) score = 50;
  else score = 25;

  let category;
  if (score >= 85) category = "Strong Liquidity";
  else if (score >= 70) category = "Adequate Buffer";
  else if (score >= 50) category = "Limited Cushion";
  else if (score >= 30) category = "Fragile";
  else category = "Critical Liquidity Risk";

  return {
    score,
    category,
    interpretation: "Estimates how long expenses can be covered without new income. Low liquidity increases short-term repayment vulnerability."
  };
}

// Income Trend Score (ITS)
function calculateIncomeTrendScore(t) {
  let score;
  if (t >= 0.10) score = 95;
  else if (t >= 0.00) score = 80;
  else if (t >= -0.05) score = 65;
  else if (t >= -0.15) score = 45;
  else score = 20;

  let category;
  if (score >= 85) category = "Positive Momentum";
  else if (score >= 70) category = "Stable Income Trend";
  else if (score >= 50) category = "Mild Concern";
  else if (score >= 30) category = "Deteriorating Income";
  else category = "Severe Income Decline";

  return {
    score,
    category,
    interpretation: "Measures directional income movement. Declining trends are early warning signals for repayment stress."
  };
}

// Helper to get score color based on value
export function getScoreColor(score) {
  if (score >= 80) return 'green';
  if (score >= 60) return 'lightgreen';
  if (score >= 40) return 'yellow';
  if (score >= 20) return 'orange';
  return 'red';
}

function groupByMonth(transactions) {
  const groups = {};
  
  transactions.forEach(t => {
    const monthKey = format(t.date, 'yyyy-MM');
    
    if (!groups[monthKey]) {
      groups[monthKey] = { income: 0, expenses: 0, endBalance: 0 };
    }
    
    if (t.amount >= 0) {
      groups[monthKey].income += t.amount;
    } else {
      groups[monthKey].expenses += Math.abs(t.amount);
    }
    
    groups[monthKey].endBalance = t.balance;
  });
  
  return groups;
}

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function standardDeviation(arr) {
  if (arr.length === 0) return 0;
  const avg = mean(arr);
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}



function getRiskTier(score) {
  if (score >= 80) return { label: 'Stable', color: 'green', description: 'Low risk - strong financial stability' };
  if (score >= 50) return { label: 'Watch', color: 'yellow', description: 'Moderate risk - some concerns present' };
  return { label: 'Risky', color: 'red', description: 'High risk - significant stability concerns' };
}

function generateFlags(cv_i, sr, cbd, t) {
  const flags = [];

  if (cv_i > 0.40) {
    flags.push({ type: 'warning', message: 'High income volatility detected — income varies significantly month-to-month' });
  } else if (cv_i > 0.25) {
    flags.push({ type: 'caution', message: 'Moderate income volatility — some variation in monthly income' });
  }

  if (sr < 0) {
    flags.push({ type: 'warning', message: 'Negative surplus ratio — spending exceeds income on average' });
  } else if (sr < 0.10) {
    flags.push({ type: 'caution', message: 'Low surplus margin — little buffer between income and expenses' });
  }

  if (cbd < 14) {
    flags.push({ type: 'warning', message: 'Critical cash buffer — less than 2 weeks of expenses covered' });
  } else if (cbd < 30) {
    flags.push({ type: 'caution', message: 'Limited cash buffer — less than 1 month of expenses covered' });
  }

  if (t < -0.10) {
    flags.push({ type: 'warning', message: 'Declining income trend — income has decreased significantly' });
  } else if (t > 0.10) {
    flags.push({ type: 'positive', message: 'Growing income trend — income has increased over the period' });
  }

  if (flags.length === 0) {
    flags.push({ type: 'positive', message: 'No significant concerns detected — stable cashflow patterns' });
  }

  return flags;
}