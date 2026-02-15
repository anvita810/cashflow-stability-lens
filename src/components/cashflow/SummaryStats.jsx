import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CalendarDays, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

export default function SummaryStats({ summary }) {
  const stats = [
    {
      icon: FileText,
      label: 'Transactions',
      value: summary.totalTransactions.toLocaleString()
    },
    {
      icon: CalendarDays,
      label: 'Months Analyzed',
      value: summary.monthsAnalyzed
    },
    {
      icon: ArrowDownLeft,
      label: 'Avg Monthly Income',
      value: `$${summary.avgMonthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    },
    {
      icon: ArrowUpRight,
      label: 'Avg Monthly Expenses',
      value: `$${summary.avgMonthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    },
    {
      icon: Wallet,
      label: 'Current Balance',
      value: `$${summary.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
          </div>
          <p className="text-lg font-semibold text-slate-200">{stat.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}