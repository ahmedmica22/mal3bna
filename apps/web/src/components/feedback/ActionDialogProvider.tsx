import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Dialog } from '../ui/Dialog';
import { useLanguage } from '../../store/LanguageStore';
import { useAuth } from '../../store/AuthStore';

type ActionDialogOptions = {
  title: string;
  message: string;
  inputLabel?: string;
};
type Ask = (options: ActionDialogOptions) => Promise<string | null>;
const ActionDialogContext = createContext<Ask | null>(null);

export function useActionDialog() {
  const ask = useContext(ActionDialogContext);
  if (!ask) throw new Error('ActionDialogProvider is required.');
  return ask;
}

/** Collect input/confirmation in-app. Cancellation never performs the action. */
export function ActionDialogProvider({ children }: { children: ReactNode }) {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [options, setOptions] = useState<ActionDialogOptions | null>(null);
  const [value, setValue] = useState('');
  const pending = useRef<((value: string | null) => void) | null>(null);
  const inputId = useId();
  const finish = useCallback((answer: string | null) => {
    const resolve = pending.current;
    pending.current = null;
    setOptions(null);
    resolve?.(answer);
  }, []);
  const ask = useCallback<Ask>((request) => {
    if (pending.current) return Promise.resolve(null);
    setValue('');
    setOptions(request);
    return new Promise((resolve) => {
      pending.current = resolve;
    });
  }, []);

  useEffect(() => {
    finish(null);
    return () => {
      pending.current?.(null);
      pending.current = null;
    };
  }, [user?.id, finish]);

  return (
    <ActionDialogContext.Provider value={ask}>
      {children}
      {options && (
        <Dialog label={options.title} onClose={() => finish(null)}>
          <form
            className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/15 dark:bg-[#13221f] dark:text-slate-100"
            onSubmit={(event) => {
              event.preventDefault();
              if (options.inputLabel && !value.trim()) return;
              finish(options.inputLabel ? value.trim() : '');
            }}
          >
            <h2 className="text-xl font-black">{options.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{options.message}</p>
            {options.inputLabel && (
              <div className="space-y-2">
                <label htmlFor={inputId} className="block text-sm font-bold">
                  {options.inputLabel}
                </label>
                <textarea
                  id={inputId}
                  required
                  rows={4}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30 dark:border-white/20 dark:bg-black/30"
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => finish(null)}
                className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 dark:border-white/20"
              >
                {translate('Cancel')}
              </button>
              <button
                type="submit"
                disabled={Boolean(options.inputLabel) && !value.trim()}
                className="min-h-11 rounded-xl bg-lime-400 px-4 text-sm font-black text-slate-950 disabled:opacity-40 focus-visible:outline focus-visible:outline-2"
              >
                {translate('Confirm')}
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </ActionDialogContext.Provider>
  );
}
