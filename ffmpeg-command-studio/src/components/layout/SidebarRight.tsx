// components/layout/SidebarRight.tsx
import { Clock, Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAppStore, selectSelectedFile } from '@store';
import { useFFmpegCommands } from '@hooks/useTauri';
import { highlightCommand } from '@lib/utils';
import type { HistoryEntry } from '@types';

export default function SidebarRight() {
  return (
    <aside className="w-[320px] bg-bg-medium border-r border-border-default flex flex-col overflow-hidden flex-shrink-0">
      <div className="panel flex-shrink-0">
        <div className="panel-header">
          <h2><Clock className="w-4 h-4 text-accent" />معاينة سريعة</h2>
        </div>
        <QuickPreview />
      </div>
      <div className="panel flex-1 min-h-0 flex flex-col">
        <div className="panel-header">
          <h2><Clock className="w-4 h-4 text-accent" />السجل</h2>
          <button
            onClick={() => useAppStore.getState().clearHistory()}
            className="text-xs text-accent hover:text-accent-light hover:underline bg-transparent border-none cursor-pointer"
          >
            مسح الكل
          </button>
        </div>
        <HistoryList />
      </div>
    </aside>
  );
}

function QuickPreview() {
  const selectedFile = useAppStore(selectSelectedFile);

  const getPreviewCommand = () => {
    if (!selectedFile) return null;
    const settings = selectedFile.settings;
    const parts = ['ffmpeg'];
    if (settings.output.overwrite) parts.push('-y');
    parts.push('-i', `"${selectedFile.fullPath}"`);
    if (selectedFile.mediaType !== 'video' || !settings.video.enabled) {
      parts.push('-vn');
    } else {
      parts.push('-c:v', settings.video.codec);
      if (settings.video.codec !== 'copy') {
        parts.push('-preset', settings.video.preset);
        if (settings.video.bitrate) {
          parts.push('-b:v', settings.video.bitrate + settings.video.bitrateUnit);
        } else {
          parts.push('-crf', settings.video.crf.toString());
        }
      }
    }
    if (!settings.audio.enabled) {
      parts.push('-an');
    } else {
      parts.push('-c:a', settings.audio.codec);
      if (settings.audio.bitrate && settings.audio.codec !== 'flac' && settings.audio.codec !== 'pcm_s16le') {
        parts.push('-b:a', settings.audio.bitrate);
      }
    }
    const baseName = selectedFile.name.replace(/\.[^.]+$/, '');
    const outputName = baseName + (settings.output.suffix || '_converted') + '.' + settings.output.format;
    parts.push('-f', settings.output.format, `"${outputName}"`);
    return parts.join(' ');
  };

  const previewCommand = getPreviewCommand();

  return (
    <div className="bg-bg-darkest border border-border-default rounded-xl overflow-hidden">
      {!previewCommand ? (
        <div className="flex flex-col items-center justify-center p-6 text-text-muted text-center">
          <p className="text-sm">ستظهر المعاينة هنا</p>
          <span className="text-xs opacity-70 mt-1">اختر ملفاً لرؤية الأمر</span>
        </div>
      ) : (
        <div className="overflow-auto max-h-[200px] p-3">
          <pre
            className="font-mono text-[11px] leading-relaxed text-text-primary whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: highlightCommand(previewCommand) }}
          />
        </div>
      )}
    </div>
  );
}

function HistoryList() {
  const history = useAppStore((state) => state.commandHistory);
  const deleteHistoryItem = useAppStore((state) => state.deleteHistoryItem);
  const { copyCommand } = useFFmpegCommands();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-text-muted text-sm">
        لا يوجد سجل بعد
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto flex-1">
      {history.map((entry) => (
        <HistoryItem
          key={entry.id}
          entry={entry}
          isExpanded={expandedId === entry.id}
          onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          onDelete={() => deleteHistoryItem(entry.id)}
          onCopy={() => copyCommand(entry.commands.join('\n\n'))}
        />
      ))}
    </div>
  );
}

function HistoryItem({ entry, isExpanded, onToggle, onDelete, onCopy }: {
  entry: HistoryEntry; isExpanded: boolean;
  onToggle: () => void; onDelete: () => void; onCopy: () => void;
}) {
  return (
    <div className="bg-bg-dark border border-border-default rounded-lg p-2 cursor-pointer hover:bg-bg-light hover:border-border-hover transition-all duration-[150ms]">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-accent">{entry.time}</span>
        <div className="flex gap-1">
          <button onClick={onCopy} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-accent">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-error-bg text-text-muted hover:text-error">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="text-xs text-text-secondary truncate mb-1">
        {entry.fileCount} ملف - {entry.fileNames.slice(0, 2).join(', ')}
        {entry.fileNames.length > 2 && ` +${entry.fileNames.length - 2}`}
      </div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary"
      >
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {isExpanded ? 'إخفاء' : 'عرض الأوامر'}
      </button>
      {isExpanded && (
        <div className="mt-2 space-y-1">
          {entry.commands.map((cmd, i) => (
            <pre key={i} className="font-mono text-[10px] text-text-muted bg-bg-darkest p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
              {cmd}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}
