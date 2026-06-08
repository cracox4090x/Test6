// components/layout/Header.tsx
import { Film } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-[60px] bg-gradient-to-b from-bg-medium to-bg-dark border-b border-border-default flex items-center justify-between px-6 flex-shrink-0 relative z-10">
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-accent-bg border border-accent-border rounded-md flex items-center justify-center shadow-glow">
          <Film className="w-6 h-6 text-accent" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-text-primary tracking-wide">FFmpeg Command Studio</h1>
          <span className="text-xs text-text-muted">Professional Media Command Builder</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="px-4 py-1 bg-accent-bg text-accent border border-accent-border rounded-full text-xs font-semibold">
          v4.0
        </span>
      </div>
    </header>
  );
}
