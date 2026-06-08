// types/index.ts - Central type definitions

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  fullPath: string;
  size: number;
  mediaType: 'video' | 'audio' | 'unknown';
  hasFullPath: boolean;
  settings: FileSettings;
  selected: boolean;
}

export interface FileSettings {
  video: VideoSettings;
  audio: AudioSettings;
  output: OutputSettings;
}

export interface VideoSettings {
  enabled: boolean;
  codec: string;
  preset: string;
  crf: number;
  resolution: string;
  customWidth: number;
  customHeight: number;
  fps: string;
  bitrate: string;
  bitrateUnit: string;
}

export interface AudioSettings {
  enabled: boolean;
  codec: string;
  bitrate: string;
  sampleRate: string;
  channels: string;
}

export interface OutputSettings {
  format: string;
  naming: string;
  suffix: string;
  prefix: string;
  customName: string;
  folder: string;
  overwrite: boolean;
}

export interface AppState {
  files: MediaFile[];
  selectedFileId: string | null;
  currentFilter: 'all' | 'video' | 'audio';
  commandHistory: HistoryEntry[];
  defaultSettings: FileSettings;
}

export interface HistoryEntry {
  id: string;
  time: string;
  date: string;
  commands: string[];
  fileCount: number;
  fileNames: string[];
}

export interface FFmpegCommand {
  command: string;
  parts: string[];
  inputFile: string;
  outputFile: string;
  estimatedSize?: string;
  durationEstimate?: string;
}

export interface FFmpegPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  settings: Record<string, unknown>;
}

export interface FFmpegInfo {
  installed: boolean;
  version?: string;
  path?: string;
  codecs: string[];
  formats: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type TabId = 'queue' | 'settings' | 'command';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
