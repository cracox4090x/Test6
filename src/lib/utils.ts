// lib/utils.ts - Utility functions
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileType(filename: string): 'video' | 'audio' | 'unknown' {
  const videoExts = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpeg', 'mpg', '3gp'];
  const audioExts = ['mp3', 'aac', 'wav', 'flac', 'ogg', 'm4a', 'wma', 'opus'];
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  return 'unknown';
}

export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateId(): string {
  return `f_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getBaseName(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}

export function getDirectory(filepath: string): string {
  if (!filepath) return '';
  const normalized = filepath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  parts.pop();
  return parts.join('/') || '';
}

export function highlightCommand(command: string): string {
  let html = escapeHtml(command);
  html = html.replace(/^(ffmpeg)/, '<span class="text-accent font-semibold">$1</span>');
  html = html.replace(/(\s)(-[a-zA-Z][a-zA-Z0-9_:\-]*)/g, '$1<span class="text-info">$2</span>');
  html = html.replace(/(&quot;.*?&quot;)/g, '<span class="text-yellow-400">$1</span>');
  html = html.replace(/(\s)(\d+)(\s|$)/g, '$1<span class="text-success">$2</span>$3');
  return html;
}

export function getSettingsSummary(
  settings: {
    video: { enabled: boolean; codec: string; resolution: string; customWidth: number; customHeight: number };
    audio: { enabled: boolean; codec: string };
  },
  fileType: string
): string {
  const parts: string[] = [];
  if (fileType === 'video' && settings.video.enabled) {
    parts.push(settings.video.codec);
    if (settings.video.resolution === 'custom') {
      parts.push(`${settings.video.customWidth}x${settings.video.customHeight}`);
    } else if (settings.video.resolution !== 'original') {
      parts.push(settings.video.resolution);
    }
  }
  if (settings.audio.enabled) {
    parts.push(settings.audio.codec);
  } else {
    parts.push('بدون صوت');
  }
  return parts.join(' | ') || 'افتراضي';
}
