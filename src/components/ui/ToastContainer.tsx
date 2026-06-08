// components/ui/ToastContainer.tsx
import { X } from 'lucide-react';
import { useAppStore } from '@store';
import type { Toast } from '@types';

export default function ToastContainer() {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 min-w-[300px] max-w-[500px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const styles = {
    success: 'bg-bg-dark border-success text-success',
    error: 'bg-bg-dark border-error text-error',
    warning: 'bg-bg-dark border-warning text-warning',
    info: 'bg-bg-dark border-info text-info',
  };
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in ${styles[toast.type]}`}>
      <span className="text-lg font-bold">{icons[toast.type]}</span>
      <span className="text-sm text-text-primary flex-1">{toast.message}</span>
      <button onClick={onRemove} className="text-text-muted hover:text-text-primary transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
