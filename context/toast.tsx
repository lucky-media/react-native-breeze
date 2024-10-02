import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ToastType = 'success' | 'error';

export interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: ({ type, message }: ToastProps) => void;
  hideToast: () => void;
  toast: ToastProps | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = useCallback(({ type, message, duration }: ToastProps) => {
    setToast({ type, message, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
      toast,
    }),
    [showToast, hideToast, toast],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
