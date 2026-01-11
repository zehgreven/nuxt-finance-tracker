import type { ToastOptions } from '~/types/ToastOptions';

export const useAppToast = () => {
  const toast = useToast();
  return {
    success: (options: ToastOptions) =>
      toast.add({ ...options, icon: 'i-heroicons-check-circle', color: 'success' }),
    error: (options: ToastOptions) =>
      toast.add({ ...options, icon: 'i-heroicons-x-circle', color: 'error' }),
    info: (options: ToastOptions) =>
      toast.add({ ...options, icon: 'i-heroicons-information-circle', color: 'info' }),
    warning: (options: ToastOptions) =>
      toast.add({ ...options, icon: 'i-heroicons-exclamation-triangle', color: 'warning' }),
  };
};

export default useAppToast;
