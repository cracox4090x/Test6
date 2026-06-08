// store/index.ts - Zustand state management
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { MediaFile, FileSettings, HistoryEntry, TabId, Toast } from '@types';

interface AppStore {
  files: MediaFile[];
  selectedFileId: string | null;
  currentFilter: 'all' | 'video' | 'audio';
  activeTab: TabId;
  toasts: Toast[];
  isLoading: boolean;
  commandHistory: HistoryEntry[];
  defaultSettings: FileSettings;
  addFiles: (files: MediaFile[]) => void;
  removeFile: (id: string) => void;
  selectFile: (id: string | null) => void;
  updateFileSettings: (id: string, settings: FileSettings) => void;
  setFilter: (filter: 'all' | 'video' | 'audio') => void;
  clearAllFiles: () => void;
  setActiveTab: (tab: TabId) => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
  addHistoryEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  updateDefaultSettings: (settings: FileSettings) => void;
  resetDefaultSettings: () => void;
}

const defaultSettings: FileSettings = {
  video: {
    enabled: true,
    codec: 'libx264',
    preset: 'medium',
    crf: 23,
    resolution: '1920x1080',
    customWidth: 1920,
    customHeight: 1080,
    fps: 'original',
    bitrate: '',
    bitrateUnit: 'k',
  },
  audio: {
    enabled: true,
    codec: 'aac',
    bitrate: '320k',
    sampleRate: '44100',
    channels: 'original',
  },
  output: {
    format: 'mp4',
    naming: 'suffix',
    suffix: '_converted',
    prefix: '',
    customName: '',
    folder: '',
    overwrite: false,
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        files: [],
        selectedFileId: null,
        currentFilter: 'all',
        activeTab: 'queue',
        toasts: [],
        isLoading: false,
        commandHistory: [],
        defaultSettings: JSON.parse(JSON.stringify(defaultSettings)),

        addFiles: (newFiles) => {
          set((state) => {
            const updatedFiles = [...state.files, ...newFiles];
            const newSelectedId = state.selectedFileId || updatedFiles[0]?.id || null;
            return { files: updatedFiles, selectedFileId: newSelectedId };
          });
        },
        removeFile: (id) => {
          set((state) => {
            const filtered = state.files.filter((f) => f.id !== id);
            const newSelected =
              state.selectedFileId === id ? filtered[0]?.id || null : state.selectedFileId;
            return { files: filtered, selectedFileId: newSelected };
          });
        },
        selectFile: (id) => set({ selectedFileId: id }),
        updateFileSettings: (id, settings) => {
          set((state) => ({
            files: state.files.map((f) => (f.id === id ? { ...f, settings } : f)),
          }));
        },
        setFilter: (filter) => set({ currentFilter: filter }),
        clearAllFiles: () => set({ files: [], selectedFileId: null }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        addToast: (message, type) => {
          const id = `toast_${Date.now()}_${Math.random()}`;
          set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
          setTimeout(() => get().removeToast(id), 4000);
        },
        removeToast: (id) => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        },
        setLoading: (loading) => set({ isLoading: loading }),
        addHistoryEntry: (entry) => {
          set((state) => ({
            commandHistory: [entry, ...state.commandHistory].slice(0, 100),
          }));
        },
        clearHistory: () => set({ commandHistory: [] }),
        deleteHistoryItem: (id) => {
          set((state) => ({
            commandHistory: state.commandHistory.filter((h) => h.id !== id),
          }));
        },
        updateDefaultSettings: (settings) => set({ defaultSettings: settings }),
        resetDefaultSettings: () =>
          set({ defaultSettings: JSON.parse(JSON.stringify(defaultSettings)) }),
      }),
      {
        name: 'ffmpeg-studio-storage',
        partialize: (state) => ({
          defaultSettings: state.defaultSettings,
          commandHistory: state.commandHistory,
        }),
      }
    )
  )
);

export const selectFilteredFiles = (state: AppStore) => {
  if (state.currentFilter === 'all') return state.files;
  return state.files.filter((f) => f.mediaType === state.currentFilter);
};

export const selectSelectedFile = (state: AppStore) =>
  state.files.find((f) => f.id === state.selectedFileId) || null;

export const selectFileCounts = (state: AppStore) => ({
  all: state.files.length,
  video: state.files.filter((f) => f.mediaType === 'video').length,
  audio: state.files.filter((f) => f.mediaType === 'audio').length,
});
