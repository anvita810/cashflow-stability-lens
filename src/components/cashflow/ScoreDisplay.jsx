import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ScoreDisplay({ score, riskTier }) {
  const getScoreColor = () => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 50) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const getTierBadgeColor = () => {
    if (riskTier.color === 'green') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (riskTier.color === 'yellow') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getTierIcon = () => {
    if (riskTier.color === 'green') return <TrendingUp className="w-4 h-4" />;
    if (riskTier.color === 'yellow') return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      {/* Glow effect */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${getScoreColor()} opacity-20 blur-3xl rounded-full`} />
      
      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Stability Score</span>
        </div>

        {/* Score circle */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={553}
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                {score >= 80 ? (
                  <>
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </>
                ) : score >= 50 ? (
                  <>
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f97316" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </>
                )}
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-6xl font-bold bg-gradient-to-br ${getScoreColor()} bg-clip-text text-transparent`}
            >
              {score}
            </motion.span>
            <span className="text-slate-500 text-sm">out of 100</span>
          </div>
        </div>

        {/* Risk tier badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getTierBadgeColor()}`}
        >
          {getTierIcon()}
          <span className="font-semibold">{riskTier.label}</span>
        </motion.div>

        <p className="text-slate-400 text-sm mt-3 text-center">
          {riskTier.description}
        </p>
      </div>
    </motion.div>
  );
}