import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [toast]);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {visible && toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-hover border backdrop-blur-md flex items-start gap-3 ${
              toast.type === 'match'
                ? 'bg-canvas border-terracotta-300 text-ink ring-1 ring-terracotta-500/20'
                : toast.type === 'alert'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-canvas border-border text-ink'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'match' && <Sparkles className="w-5 h-5 text-terracotta-600 animate-pulse" />}
              {toast.type === 'alert' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-terracotta-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold font-serif">{toast.title}</h4>
              {toast.desc && <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.desc}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
