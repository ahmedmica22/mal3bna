import { useLanguage } from '../../store/LanguageStore';
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastType, ToastItem, ToastContextValue } from '../../types/ui';

export type { ToastType, ToastItem, ToastContextValue };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      toast: {
        success: (msg: string) => console.log('[Toast Success]', msg),
        error: (msg: string) => console.error('[Toast Error]', msg),
        warning: (msg: string) => console.warn('[Toast Warning]', msg),
        info: (msg: string) => console.info('[Toast Info]', msg),
        dismiss: () => {},
      },
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const existingIndex = prev.findIndex(
          (t) => t.type === type && t.message === message && (t.title ?? '') === (title ?? ''),
        );
        if (existingIndex !== -1) {
          // Reset countdown timer on existing toast without adding a duplicate card
          const updated = [...prev];
          updated[existingIndex] = { id, type, title, message, duration };
          return updated;
        }
        return [...prev.slice(-2), { id, type, title, message, duration }];
      });
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastMethods = {
    success: (message: string, title?: string, duration?: number) =>
      addToast('success', message, title, duration),
    error: (message: string, title?: string, duration?: number) =>
      addToast('error', message, title, duration),
    warning: (message: string, title?: string, duration?: number) =>
      addToast('warning', message, title, duration),
    info: (message: string, title?: string, duration?: number) =>
      addToast('info', message, title, duration),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const { translate } = useLanguage();
  return (
    <div
      className="toast-container fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-3 max-w-md w-[calc(100vw-32px)] pointer-events-none"
      role="region"
      aria-label={translate('Notifications')}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const { translate } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = item.duration ?? 4000;
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newRemaining = Math.max(0, remainingRef.current - elapsed);
      setProgress((newRemaining / duration) * 100);

      if (newRemaining <= 0) {
        clearInterval(interval);
        onDismiss(item.id);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startTimeRef.current),
      );
    };
  }, [isPaused, duration, item.id, onDismiss]);

  const config = {
    success: {
      card: 'bg-white/95 dark:bg-[#0d1b18]/95 border-lime-400/40 shadow-lime-400/20 text-slate-900 dark:text-slate-100',
      iconBox: 'bg-lime-400/20 text-emerald-700 dark:text-lime-400',
      title: 'text-emerald-700 dark:text-lime-400',
      progressBar: 'bg-lime-400',
      Icon: CheckCircle2,
      defaultTitle: 'Success',
    },
    error: {
      card: 'bg-white/95 dark:bg-[#1e0a10]/95 border-rose-500/40 shadow-rose-500/20 text-slate-900 dark:text-slate-100',
      iconBox: 'bg-rose-500/20 text-rose-700 dark:text-rose-400',
      title: 'text-rose-700 dark:text-rose-400',
      progressBar: 'bg-rose-500',
      Icon: AlertOctagon,
      defaultTitle: 'Action Failed',
    },
    warning: {
      card: 'bg-white/95 dark:bg-[#1e140a]/95 border-amber-500/40 shadow-amber-500/20 text-slate-900 dark:text-slate-100',
      iconBox: 'bg-amber-500/20 text-amber-800 dark:text-amber-400',
      title: 'text-amber-800 dark:text-amber-400',
      progressBar: 'bg-amber-500',
      Icon: AlertTriangle,
      defaultTitle: 'Attention',
    },
    info: {
      card: 'bg-white/95 dark:bg-[#0a1620]/95 border-sky-400/40 shadow-sky-400/20 text-slate-900 dark:text-slate-100',
      iconBox: 'bg-sky-400/20 text-sky-700 dark:text-sky-400',
      title: 'text-sky-700 dark:text-sky-400',
      progressBar: 'bg-sky-400',
      Icon: Info,
      defaultTitle: 'Note',
    },
  }[item.type];

  const Icon = config.Icon;

  return (
    <div
      className={`toast-item toast-${item.type} w-full pointer-events-auto border rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md shadow-2xl transition-all duration-200 relative overflow-hidden ${config.card}`}
      role={item.type === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.iconBox}`}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <strong className={`block text-sm font-bold mb-0.5 tracking-tight ${config.title}`}>
          {translate(item.title ?? config.defaultTitle)}
        </strong>
        <p className="m-0 text-xs text-slate-600 leading-relaxed break-words dark:text-slate-300">
          {translate(item.message)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label={translate('Close notification')}
        className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer dark:text-slate-400 dark:hover:bg-white/10"
      >
        <X size={15} />
      </button>

      {/* Countdown progress bar */}
      <div
        className={`absolute bottom-0 start-0 h-[3px] opacity-80 transition-[width] duration-75 ease-linear ${config.progressBar}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
