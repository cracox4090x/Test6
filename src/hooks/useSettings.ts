// hooks/useSettings.ts - Settings management hook
import { useCallback } from 'react';
import { useAppStore } from '@store';
import { settingsApi } from '@lib/tauri';
import type { FileSettings } from '@types';

export function useSettings() {
  const defaultSettings = useAppStore((state) => state.defaultSettings);
  const updateDefaultSettings = useAppStore((state) => state.updateDefaultSettings);
  const resetDefaultSettings = useAppStore((state) => state.resetDefaultSettings);
  const addToast = useAppStore((state) => state.addToast);

  const saveAsDefault = useCallback(
    (settings: FileSettings) => {
      updateDefaultSettings(JSON.parse(JSON.stringify(settings)));
      addToast('تم حفظ الإعدادات كافتراضية', 'success');
    },
    [updateDefaultSettings, addToast]
  );

  const exportSettings = useCallback(
    async (path: string) => {
      try {
        await settingsApi.export(path);
        addToast('تم تصدير الإعدادات', 'success');
      } catch {
        addToast('فشل التصدير', 'error');
      }
    },
    [addToast]
  );

  const importSettings = useCallback(
    async (path: string) => {
      try {
        const settings = await settingsApi.import(path);
        updateDefaultSettings(settings as FileSettings);
        addToast('تم استيراد الإعدادات', 'success');
      } catch {
        addToast('فشل الاستيراد', 'error');
      }
    },
    [updateDefaultSettings, addToast]
  );

  return { defaultSettings, saveAsDefault, exportSettings, importSettings, resetDefaultSettings };
}
