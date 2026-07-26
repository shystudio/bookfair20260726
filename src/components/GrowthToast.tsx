import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

interface GrowthToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'info';
}

export const GrowthToast: React.FC<GrowthToastProps> = ({
  message,
  onClose,
  type = 'success',
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-950/50 flex items-start space-x-3.5 ring-1 ring-indigo-400/20">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>

            <div className="flex-1 pr-2">
              <div className="flex items-center text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                생각의 나무 성장 완료
              </div>
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
