// components/layout/Footer.tsx
import { useAppStore } from '@store';

export default function Footer() {
  const isLoading = useAppStore((state) => state.isLoading);
  return (
    <footer className="h-9 bg-bg-medium border-t border-border-default flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-warning animate-pulse' : 'bg-success shadow-[0_0_8px_#00ff88]'}`} />
        <span className="text-sm text-text-secondary">
          {isLoading ? 'جاري المعالجة...' : 'جاهز'}
        </span>
      </div>
      <span className="text-xs text-text-muted">FFmpeg Command Studio v4.0</span>
    </footer>
  );
}
