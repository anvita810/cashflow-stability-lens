import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function RiskFlags({ flags }) {
  const getIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'caution': return AlertCircle;
      case 'positive': return CheckCircle;
      default: return Info;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'caution':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'positive':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-300';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-red-400';
      case 'caution': return 'text-amber-400';
      case 'positive': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl"
    >
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Risk Assessment</h3>
      
      <div className="space-y-3">
        {flags.map((flag, index) => {
          const Icon = getIcon(flag.type);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${getStyles(flag.type)}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getIconColor(flag.type)}`} />
              <p className="text-sm leading-relaxed">{flag.message}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}