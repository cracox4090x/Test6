// lib/tauri.ts - Tauri command wrappers
import { invoke } from '@tauri-apps/api/tauri';
import { dialog } from '@tauri-apps/api';
import { clipboard } from '@tauri-apps/api';
import type { ApiResponse, MediaFile, FFmpegCommand, FFmpegInfo, FFmpegPreset, HistoryEntry } from '@types';

async function invokeCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const response = await invoke<ApiResponse<T>>(command, args);
    if (!response.success) {
      throw new Error(response.error || 'Unknown error');
    }
    return response.data as T;
  } catch (error) {
    console.error(`Command ${command} failed:`, error);
    throw error;
  }
}

export const fileApi = {
  scanDirectory: (path: string, recursive = true) =>
    invokeCommand<{ files: MediaFile[]; total_count: number; video_count: number; audio_count: number }>('scan_directory', { path, recursive }),
  getFileInfo: (path: string) => invokeCommand('get_file_info', { path }),
  validateFiles: (paths: string[]) => invokeCommand('validate_media_files', { paths }),
};

export const ffmpegApi = {
  generateCommand: (file: MediaFile) =>
    invokeCommand<FFmpegCommand>('generate_command', { file }),
  generateBatch: (files: MediaFile[]) =>
    invokeCommand('generate_batch_commands', { files }),
  checkInstallation: () =>
    invokeCommand<FFmpegInfo>('validate_ffmpeg_installation'),
  getPresets: () =>
    invokeCommand<FFmpegPreset[]>('get_ffmpeg_presets'),
};

export const settingsApi = {
  load: () => invokeCommand('load_settings'),
  save: (settings: unknown) => invokeCommand('save_settings', { settings }),
  reset: () => invokeCommand('reset_settings'),
  export: (path: string) => invokeCommand('export_settings', { path }),
  import: (path: string) => invokeCommand('import_settings', { path }),
};

export const historyApi = {
  load: () => invokeCommand('load_history'),
  save: (entry: HistoryEntry) => invokeCommand('save_history', { entry }),
  clear: () => invokeCommand('clear_history'),
  export: (path: string) => invokeCommand('export_history', { path }),
};

export const systemApi = {
  getOsInfo: () => invokeCommand('get_os_info'),
  openExternal: (url: string) => invokeCommand('open_external_link', { url }),
  showInFolder: (path: string) => invokeCommand('show_in_folder', { path }),
};

export const dialogApi = {
  openFile: (options?: { multiple?: boolean; directory?: boolean }) =>
    dialog.open({
      multiple: options?.multiple ?? true,
      directory: options?.directory ?? false,
      filters: [
        {
          name: 'Media Files',
          extensions: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpeg', 'mpg', '3gp',
            'mp3', 'aac', 'wav', 'flac', 'ogg', 'm4a', 'wma', 'opus'],
        },
        { name: 'All Files', extensions: ['*'] },
      ],
    }),
  openFolder: () => dialog.open({ directory: true, multiple: false }),
  saveFile: (defaultPath?: string) =>
    dialog.save({
      defaultPath,
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Shell Script', extensions: ['sh', 'bat'] },
      ],
    }),
};

export const clipboardApi = {
  writeText: (text: string) => clipboard.writeText(text),
  readText: () => clipboard.readText(),
};
