import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import FileUpload from '@/components/cashflow/FileUpload';
import ScoreDisplay from '@/components/cashflow/ScoreDisplay';
import MetricCard from '@/components/cashflow/MetricCard';
import RiskFlags from '@/components/cashflow/RiskFlags';
import CashflowCharts from '@/components/cashflow/CashflowCharts';
import SummaryStats from '@/components/cashflow/SummaryStats';
import { parseCSV } from '@/components/cashflow/csvParser';
import { calculateMetrics } from '@/components/cashflow/metricsCalculator';

export default function Home() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [errorBold, setErrorBold] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcessed = useCallback((csvText, name) => {
    setIsProcessing(true);
    setError(null);
    setFileName(name);

    setTimeout(() => {
      const parseResult = parseCSV(csvText);

      if (!parseResult.success) {
        setError(parseResult.error);
        setErrorBold(parseResult.errorBold ?? null);
        setResults(null);
        setIsProcessing(false);
        return;
      }

      const metrics = calculateMetrics(parseResult.data);

      if (!metrics) {
        setError('Unable to calculate metrics from the provided data.');
        setErrorBold(null);
        setResults(null);
        setIsProcessing(false);
        return;
      }

      setResults(metrics);
      setIsProcessing(false);
    }, 500);
  }, []);

  const handleReset = () => {
    setResults(null);
    setError(null);
    setErrorBold(null);
    setFileName(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Behavioral Finance Analysis</span>
          </div> */}

          <h1 className="text-4xl md:text-5xl font-bold leading-tight py-2 bg-gradient-to-r from-slate-100 via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Cashflow Stability Lens
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Assess short-term financial stability using recent cash flow data. <br />
          Upload bank transactions to receive a stability score and risk assessment.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <FileUpload onFileProcessed={handleFileProcessed} isProcessing={isProcessing} />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                  <p className="text-red-300 text-sm whitespace-pre-wrap">
                    {errorBold
                      ? (() => {
                          const parts = error.split(errorBold);
                          return (
                            <>
                              {parts[0]}
                              <strong className="font-semibold text-red-200">{errorBold}</strong>
                              {parts[1]}
                            </>
                          );
                        })()
                      : error}
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30"
              >
                <h3 className="text-slate-300 font-medium mb-3">Expected CSV Format</h3>
                <div className="overflow-x-auto">
                  <code className="text-xs text-slate-400 block whitespace-pre">
                    {`Date,Type,Description,Amount,Current Balance
1/5/2025,Deposit,Direct Deposit - Employer,3500.00,5200.00
1/7/2025,Debit Card,Grocery Store,-125.50,5074.50
1/10/2025,Withdrawal,ATM Withdrawal,-200.00,4874.50`}
                  </code>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Analyzing: </span>
                    <span className="text-slate-200 font-medium">{fileName}</span>
                  </div>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>

              <SummaryStats summary={results.summary} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ScoreDisplay
                    score={results.stabilityScore}
                    riskTier={results.riskTier}
                  />
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  {Object.entries(results.metrics).map(([key, metric], index) => (
                    <MetricCard
                      key={key}
                      metricKey={key}
                      metric={metric}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <RiskFlags flags={results.flags} />

              <CashflowCharts chartData={results.chartData} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-6 border-t border-slate-800"
              >
                <p className="text-slate-500 text-sm">
                  All data is processed locally in your browser. No transaction data is stored or
                  transmitted.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
