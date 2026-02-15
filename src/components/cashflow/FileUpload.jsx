import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUpload({ onFileProcessed, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const clearInput = useCallback(() => {
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const handleFile = useCallback((file) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      clearInput();
      return;
    }

    setError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      onFileProcessed(e.target.result, file.name);
      clearInput();
    };

    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      clearInput();
    };

    reader.readAsText(file);
  }, [onFileProcessed, clearInput]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-slate-600 bg-slate-800/50 hover:border-purple-400 hover:bg-slate-800/80'
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            className={`
              p-4 rounded-full 
              ${isDragging ? 'bg-purple-500/20' : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'}
            `}
            animate={{ scale: isDragging ? 1.1 : 1 }}
          >
            <Upload className={`w-8 h-8 ${isDragging ? 'text-purple-400' : 'text-slate-400'}`} />
          </motion.div>
          
          <div>
            <p className="text-lg font-medium text-slate-200">
              {isDragging ? 'Drop your file here' : 'Upload bank statement CSV'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Drag and drop or click to browse
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-4 h-4" />
            <span>Required: date, type, description, amount, current balance</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}