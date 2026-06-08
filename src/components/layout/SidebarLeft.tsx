// components/layout/SidebarLeft.tsx
import { FolderOpen, Plus, Video, Music, LayoutGrid, Trash2 } from 'lucide-react';
import { useAppStore, selectFilteredFiles, selectFileCounts } from '@store';
import { useFileOperations } from '@hooks/useTauri';
import { formatFileSize } from '@lib/utils';
import type { MediaFile } from '@types';

export default function SidebarLeft() {
  const files = useAppStore(selectFilteredFiles);
  const counts = useAppStore(selectFileCounts);
  const currentFilter = useAppStore((state) => state.currentFilter);
  const selectedFileId = useAppStore((state) => state.selectedFileId);
  const setFilter = useAppStore((state) => state.setFilter);
  const selectFile = useAppStore((state) => state.selectFile);
  const removeFile = useAppStore((state) => state.removeFile);
  const { addFilesFromDialog, addFolder } = useFileOperations();

  const filters = [
    { id: 'all' as const, label: 'الكل', icon: LayoutGrid, count: counts.all },
    { id: 'video' as const, label: 'فيديو', icon: Video, count: counts.video },
    { id: 'audio' as const, label: 'صوت', icon: Music, count: counts.audio },
  ];

  return (
    <aside className="w-[280px] bg-bg-medium border-l border-border-default flex flex-col overflow-hidden flex-shrink-0">
      <div className="panel flex-1 min-h-0 flex flex-col">
        <div className="panel-header">
          <h2>
            <FolderOpen className="w-4 h-4 text-accent" />
            الملفات
          </h2>
          <span className="text-xs text-accent bg-accent-bg px-2 py-0.5 rounded-full">{counts.all}</span>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={addFilesFromDialog} className="btn btn-primary btn-block text-xs">
            <Plus className="w-3.5 h-3.5" />
            إضافة ملفات
          </button>
          <button onClick={addFolder} className="btn btn-block text-xs">
            <FolderOpen className="w-3.5 h-3.5" />
            مجلد
          </button>
        </div>
        <div className="flex flex-col gap-1 mb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilter(filter.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-[150ms] cursor-pointer ${
                currentFilter === filter.id
                  ? 'bg-accent-bg border border-accent text-accent'
                  : 'bg-bg-dark border border-border-default text-text-secondary hover:bg-bg-light hover:border-border-hover'
              }`}
            >
              <filter.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{filter.label}</span>
              <span className={`mr-auto text-xs px-1.5 py-0.5 rounded-full ${
                currentFilter === filter.id ? 'bg-accent text-bg-darkest' : 'bg-bg-darkest text-text-muted'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-text-muted text-center">
              <FolderOpen className="w-12 h-12 opacity-20 mb-3" />
              <p className="text-sm">لا توجد ملفات</p>
              <span className="text-xs opacity-70 mt-1">أضف ملفات فيديو أو صوت للبدء</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  isSelected={file.id === selectedFileId}
                  onSelect={() => selectFile(file.id)}
                  onDelete={() => removeFile(file.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function FileCard({ file, isSelected, onSelect, onDelete }: {
  file: MediaFile; isSelected: boolean; onSelect: () => void; onDelete: () => void;
}) {
  const isVideo = file.mediaType === 'video';
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-all duration-[150ms] group ${
        isSelected ? 'bg-accent-bg border border-accent' : 'bg-bg-dark border border-border-default hover:bg-bg-light hover:border-border-hover'
      }`}
    >
      <div className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${
        isVideo ? 'bg-gradient-to-br from-accent to-accent-dark' : 'bg-gradient-to-br from-success to-emerald-600'
      }`}>
        {isVideo ? <Video className="w-4 h-4 text-bg-darkest" /> : <Music className="w-4 h-4 text-bg-darkest" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">{file.name}</div>
        <div className="flex gap-2 mt-0.5">
          <span className="text-xs text-text-muted">{formatFileSize(file.size)}</span>
          <span className="text-xs text-text-muted">{isVideo ? 'فيديو' : 'صوت'}</span>
          {!file.hasFullPath && <span className="text-xs text-warning">⚠ مسار نسبي</span>}
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="w-7 h-7 flex items-center justify-center rounded-sm bg-bg-darkest border border-border-default text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-bg hover:text-error hover:border-error"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
