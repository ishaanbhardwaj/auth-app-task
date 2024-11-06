import React, { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { Toast as PrimeToast } from 'primereact/toast';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const toast = useRef<PrimeToast>(null);

  useEffect(() => {
    if (toasts.length > 0) {
      const latestToast = toasts[toasts.length - 1];
      toast.current?.show({
        severity: latestToast.type === 'error' ? 'error' : 'success',
        summary: latestToast.type === 'error' ? 'Error' : 'Success',
        detail: latestToast.message,
        life: 3000
      });
      
      setTimeout(() => {
        removeToast(latestToast.id);
      }, 3000);
    }
  }, [toasts, removeToast]);

  return <PrimeToast ref={toast} position="top-right" />;
};

export default Toast;