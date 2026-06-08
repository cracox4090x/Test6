// hooks/useTauri.ts - Tauri integration hooks
import { useCallback } from 'react';
import { dialogApi, fileApi, ffmpegApi, clipboardApi, systemApi } from '@lib/tauri';
import { useAppStore } from '@store';
import type { MediaFile } from '@types';
import { getFileType, generateId } from '@lib/utils';

export function useFileOperations() {
  const addFiles = useAppStore((state) => state.addFiles);
  const addToast = useAppStore((state) => state.addToast);
  const setLoading = useAppStore((state) => state.setLoading);

  const addFilesFromDialog = useCallback(async () => {
    try {
      setLoading(true);
      const selected = await dialogApi.openFile({ multiple: true, directory: false });
      if (!selected || (Array.isArray(selected) && selected.length === 0)) {
        setLoading(false);
        return;
      }
      const paths = Array.isArray(selected) ? selected : [selected];
      const newFiles: MediaFile[] = paths
        .map((path) => {
          const name = path.split(/[/\\]/).pop() || path;
          const type = getFileType(name);
          return {
            id: generateId(),
            name,
            path,
            fullPath: path,
            size: 0,
            mediaType: type,
            hasFullPath: true,
            settings: JSON.parse(JSON.stringify(useAppStore.getState().defaultSettings)),
            selected: false,
          } as MediaFile;
        })
        .filter((f) => f.mediaType !== 'unknown');
      addFiles(newFiles);
      addToast(`تم إضافة ${newFiles.length} ملف`, 'success');
    } catch (error) {
      addToast('فشل في إضافة الملفات', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [addFiles, addToast, setLoading]);

  const addFolder = useCallback(async () => {
    try {
      setLoading(true);
      const folderPath = await dialogApi.openFolder();
      if (!folderPath || typeof folderPath !== 'string') {
        setLoading(false);
        return;
      }
      const result = await fileApi.scanDirectory(folderPath, true);
      if (result.files && result.files.length > 0) {
        addFiles(result.files);
        addToast(`تم إضافة ${result.files.length} ملف من المجلد`, 'success');
      } else {
        addToast('لم يتم العثور على ملفات وسائط', 'warning');
      }
    } catch (error) {
      addToast('فشل في فحص المجلد', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [addFiles, addToast, setLoading]);

  return { addFilesFromDialog, addFolder };
}

export function useFFmpegCommands() {
  const selectedFile = useAppStore((state) =>
    state.files.find((f) => f.id === state.selectedFileId)
  );
  const addHistoryEntry = useAppStore((state) => state.addHistoryEntry);
  const addToast = useAppStore((state) => state.addToast);

  const generateCommand = useCallback(async () => {
    if (!selectedFile) {
      addToast('اختر ملفاً أولاً', 'warning');
      return null;
    }
    try {
      const command = await ffmpegApi.generateCommand(selectedFile);
      const now = new Date();
      addHistoryEntry({
        id: `h_${Date.now()}`,
        time: now.toLocaleTimeString('ar-EG'),
        date: now.toLocaleDateString('ar-EG'),
        commands: [command.command],
        fileCount: 1,
        fileNames: [selectedFile.name],
      });
      addToast('تم توليد الأمر', 'success');
      return command;
    } catch (error) {
      addToast('فشل في توليد الأمر', 'error');
      console.error(error);
      return null;
    }
  }, [selectedFile, addHistoryEntry, addToast]);

  const copyCommand = useCallback(
    async (command: string) => {
      try {
        await clipboardApi.writeText(command);
        addToast('تم النسخ إلى الحافظة', 'success');
      } catch {
        addToast('فشل النسخ', 'error');
      }
    },
    [addToast]
  );

  return { generateCommand, copyCommand };
}

export function useSystemInfo() {
  const getOsInfo = useCallback(async () => {
    try {
      return await systemApi.getOsInfo();
    } catch (error) {
      console.error('Failed to get OS info:', error);
      return null;
    }
  }, []);

  const openExternal = useCallback(async (url: string) => {
    try {
      await systemApi.openExternal(url);
    } catch (error) {
      console.error('Failed to open external link:', error);
    }
  }, []);

  return { getOsInfo, openExternal };
}
