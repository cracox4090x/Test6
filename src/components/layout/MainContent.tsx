// components/layout/MainContent.tsx
import { List, Settings, Terminal } from 'lucide-react';
import { useAppStore } from '@store';
import QueueTab from '@components/tabs/QueueTab';
import SettingsTab from '@components/tabs/SettingsTab';
import CommandTab from '@components/tabs/CommandTab';
import type { TabId } from '@types';

const tabs: { id: TabId; label: string; icon: typeof List }[] = [
  { id: 'queue', label: 'قائمة الانتظار', icon: List },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
  { id: 'command', label: 'الأمر', icon: Terminal },
];

export default function MainContent() {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <main className="flex-1 bg-bg-dark flex flex-col overflow-hidden min-w-0">
      <div className="flex bg-bg-medium border-b border-border-default px-4 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium relative transition-all duration-[150ms] ${
              activeTab === tab.id
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'queue' && <QueueTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'command' && <CommandTab />}
      </div>
    </main>
  );
}
