import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthStore } from '../store/AuthStore';
import { ThemeProvider } from '../store/ThemeStore';
import { ToastProvider } from '../components/feedback/ToastContext';
import { LanguageProvider } from '../store/LanguageStore';
import { ActionDialogProvider } from '../components/feedback/ActionDialogProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthStore>
          <LanguageProvider>
            <ToastProvider>
              <ActionDialogProvider>{children}</ActionDialogProvider>
            </ToastProvider>
          </LanguageProvider>
        </AuthStore>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
