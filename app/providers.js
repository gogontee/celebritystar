// /app/providers.js
'use client';

import { useEffect } from 'react';

export function ErrorHandlerProvider({ children }) {
  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args) => {
      const firstArg = args[0];

      const message =
        typeof firstArg === 'string'
          ? firstArg
          : firstArg?.message || String(firstArg);

      const isAbortError =
        message.includes('AbortError') ||
        message.includes('aborted') ||
        message.includes('signal is aborted');

      if (isAbortError) return;

      originalConsoleError(...args);
    };

    const handleRejection = (event) => {
      const message =
        event.reason?.message || String(event.reason);

      const isAbortError =
        event.reason?.name === 'AbortError' ||
        message.includes('aborted') ||
        message.includes('signal is aborted');

      if (isAbortError) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      console.error = originalConsoleError;
    };
  }, []);

  return children;
}

export function Providers({ children }) {
  return (
    <ErrorHandlerProvider>
      {children}
    </ErrorHandlerProvider>
  );
}