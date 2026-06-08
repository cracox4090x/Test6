// components/tabs/QueueTab.tsx
import { useState } from 'react';
import { Trash2, CheckSquare, Square, RefreshCw, Play, Download } from 'lucide-react';
import { useAppStore } from '@store';
import { useFileOperations, useFFmpegCommands } from '@hooks/useTauri';
import { formatFileSize, getSettingsSummary } from '@lib/utils';

export default function QueueTab() {
  const files = useAppStore((state) => state.files);
  const selectedFileId = useAppStore((state) => state.selectedFileId);
  const selectFile = useAppStore((state) => state.selectFile);
  const removeFile = useAppStore((state) => state.removeFile);
  const clearAllFiles = useAppStore((state) => state.clearAllFiles);
  const addToast = useAppStore((state) => state.addToast);
  const { addFilesFromDialog } = useFileOperations();
  const { generateCommand } = useFFmpegCommands();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === files.length) setSelected(new Set());
    else setSelected(new Set(files.map((f) => f.id)));
  };

  const removeSelected = () => {
    selected.forEach((id) => removeFile(id));
    setSelected(new Set());
    addToast(`تم حذف ${selected.size} ملف`, 'info');
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted gap-4">
        <div className="text-6xl opacity-20">📂</div>
        <div className="text-center">
          <p className="text-xl text-text-secondary mb-2">قائمة الانتظار فارغة</p>
          <p className="text-sm">أضف ملفات من الشريط الجانبي الأيسر</p>
        </div>
        <button onClick={addFilesFromDialog} className="btn btn-primary mt-4">
          إضافة ملفات
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border-default bg-bg-medium flex-shrink-0">
        <button onClick={selectAll} className="btn text-xs">
          {selected.size === files.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          {selected.size === files.length ? 'إلغاء الكل' : 'تحديد الكل'}
        </button>
        {selected.size > 0 && (
          <button onClick={removeSelected} className="btn text-xs text-error hover:text-error hover:border-error">
            <Trash2 className="w-4 h-4" />
            حذف المحدد ({selected.size})
          </button>
        )}
        <button onClick={clearAllFiles} className="btn text-xs mr-auto">
          <RefreshCw className="w-4 h-4" />
          مسح الكل
        </button>
        <span className="text-xs text-text-muted">{files.length} ملف</span>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => selectFile(file.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-[150ms] ${
                selectedFileId === file.id
                  ? 'bg-accent-bg border-accent'
                  : 'bg-bg-dark border-border-default hover:bg-bg-light hover:border-border-hover'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(file.id)}
                onChange={() => toggleSelect(file.id)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded accent-accent flex-shrink-0"
              />
              <div className={`w-10 h-10 rounded-md flex items-center justify-center text-lg flex-shrink-0 ${
                file.mediaType === 'video'
                  ? 'bg-gradient-to-br from-accent to-accent-dark'
                  : 'bg-gradient-to-br from-success to-emerald-600'
              }`}>
                {file.mediaType === 'video' ? '🎬' : '🎵'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">{file.name}</div>
                <div className="flex gap-3 mt-0.5 text-xs text-text-muted">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{getSettingsSummary(file.settings, file.mediaType)}</span>
                </div>
                {!file.hasFullPath && (
                  <span className="text-xs text-warning">⚠ المسار الكامل غير متاح</span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={async (e) => { e.stopPropagation(); selectFile(file.id); await generateCommand(); }}
                  className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-accent-bg transition-colors"
                  title="توليد الأمر"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  className="p-1.5 rounded text-text-muted hover:text-error hover:bg-error-bg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between p-3 border-t border-border-default bg-bg-medium flex-shrink-0">
        <span className="text-xs text-text-muted">
          {files.filter((f) => f.mediaType === 'video').length} فيديو ·{' '}
          {files.filter((f) => f.mediaType === 'audio').length} صوت
        </span>
        <button
          onClick={async () => {
            for (const file of files) {
              selectFile(file.id);
              await generateCommand();
            }
          }}
          className="btn btn-primary text-xs"
        >
          <Download className="w-4 h-4" />
          توليد جميع الأوامر
        </button>
      </div>
    </div>
  );
}
