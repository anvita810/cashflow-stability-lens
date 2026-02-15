import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ metricKey, metric, index }) {
  if (!metric) return null;

  const gradientClass =
    metric.score >= 80
      ? 'from-emerald-500/20 to-green-500/10 border-emerald-500/30'
      : metric.score >= 50
        ? 'from-amber-500/20 to-orange-500/10 border-amber-500/30'
        : 'from-red-500/20 to-rose-500/10 border-red-500/30';

  const scoreTextClass =
    metric.score >= 80
      ? 'from-emerald-400 to-green-500'
      : metric.score >= 50
        ? 'from-amber-400 to-orange-500'
        : 'from-red-400 to-rose-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${gradientClass} border backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{metric.display}</p>
          <p className="text-slate-500 text-xs mt-1">{metric.category}</p>
        </div>
        <div
          className={`text-2xl font-bold bg-gradient-to-br ${scoreTextClass} bg-clip-text text-transparent`}
        >
          {metric.score}
        </div>
      </div>
      {metric.interpretation && (
        <p className="text-slate-400 text-xs mt-3 leading-relaxed">{metric.interpretation}</p>
      )}
    </motion.div>
  );
}
