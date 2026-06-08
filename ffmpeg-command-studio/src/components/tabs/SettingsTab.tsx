// components/tabs/SettingsTab.tsx
import { useState, useEffect, ReactNode } from 'react';
import { Settings, Video, Music, Download } from 'lucide-react';
import { useAppStore, selectSelectedFile } from '@store';
import { useSettings } from '@hooks/useSettings';
import { debounce, formatFileSize } from '@lib/utils';
import type { FileSettings } from '@types';

export default function SettingsTab() {
  const selectedFile = useAppStore(selectSelectedFile);
  const updateFileSettings = useAppStore((state) => state.updateFileSettings);
  const { saveAsDefault } = useSettings();
  const [settings, setSettings] = useState<FileSettings | null>(null);

  useEffect(() => {
    if (selectedFile) {
      setSettings(JSON.parse(JSON.stringify(selectedFile.settings)));
    } else {
      setSettings(null);
    }
  }, [selectedFile?.id]);

  const debouncedUpdate = debounce((fileId: string, newSettings: FileSettings) => {
    updateFileSettings(fileId, newSettings);
  }, 300);

  const handleChange = (path: string, value: unknown) => {
    if (!settings || !selectedFile) return;
    const newSettings: FileSettings = JSON.parse(JSON.stringify(settings));
    const keys = path.split('.');
    let current: Record<string, unknown> = newSettings as unknown as Record<string, unknown>;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
    debouncedUpdate(selectedFile.id, newSettings);
  };

  if (!selectedFile || !settings) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted text-center">
        <Settings className="w-16 h-16 opacity-20 mb-4" />
        <p className="text-xl text-text-secondary">اختر ملفاً لتعديل الإعدادات</p>
        <span className="text-sm opacity-70 mt-2">حدد ملفاً من قائمة الانتظار ثم اضبط الإعدادات</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
      {/* File Summary */}
      <div className="bg-bg-medium border border-accent rounded-xl p-4">
        <div className="flex items-center gap-4 mb-3 pb-2 border-b border-border-subtle">
          <span className="text-accent">
            {selectedFile.mediaType === 'video' ? <Video className="w-5 h-5" /> : <Music className="w-5 h-5" />}
          </span>
          <span className="text-lg font-semibold text-text-primary flex-1 truncate">{selectedFile.name}</span>
          <button onClick={() => saveAsDefault(settings)} className="btn text-xs">
            حفظ كافتراضي
          </button>
        </div>
        <div className="flex gap-6 text-xs text-text-secondary">
          <span>الحجم: {formatFileSize(selectedFile.size)}</span>
          <span>النوع: {selectedFile.mediaType === 'video' ? 'فيديو' : 'صوت'}</span>
        </div>
      </div>

      {/* Video Settings */}
      {selectedFile.mediaType === 'video' && (
        <SettingsGroup
          icon={<Video className="w-4 h-4" />}
          title="إعدادات الفيديو"
          enabled={settings.video.enabled}
          onToggle={(v) => handleChange('video.enabled', v)}
        >
          <div className="grid grid-cols-2 gap-4">
            <SettingItem label="ترميز الفيديو">
              <select value={settings.video.codec} onChange={(e) => handleChange('video.codec', e.target.value)} disabled={!settings.video.enabled} className="input">
                <option value="libx264">H.264 (libx264)</option>
                <option value="libx265">H.265 (libx265)</option>
                <option value="libvpx-vp9">VP9</option>
                <option value="libaom-av1">AV1</option>
                <option value="mpeg4">MPEG-4</option>
                <option value="copy">نسخ (copy)</option>
              </select>
            </SettingItem>
            <SettingItem label="سرعة الضغط">
              <select value={settings.video.preset} onChange={(e) => handleChange('video.preset', e.target.value)} disabled={!settings.video.enabled || settings.video.codec === 'copy'} className="input">
                <option value="ultrafast">Ultrafast</option>
                <option value="veryfast">Veryfast</option>
                <option value="fast">Fast</option>
                <option value="medium">Medium</option>
                <option value="slow">Slow</option>
                <option value="veryslow">Veryslow</option>
              </select>
            </SettingItem>
            <SettingItem label="جودة CRF">
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="51" value={settings.video.crf} onChange={(e) => handleChange('video.crf', parseInt(e.target.value))} disabled={!settings.video.enabled || settings.video.codec === 'copy'} className="flex-1 h-1.5 bg-bg-dark rounded-full accent-accent" />
                <span className="min-w-[40px] px-2 py-1 bg-accent-bg text-accent rounded-sm text-sm font-semibold text-center">{settings.video.crf}</span>
              </div>
            </SettingItem>
            <SettingItem label="الدقة">
              <select value={settings.video.resolution} onChange={(e) => handleChange('video.resolution', e.target.value)} disabled={!settings.video.enabled} className="input">
                <option value="original">الأصلية</option>
                <option value="3840x2160">4K</option>
                <option value="1920x1080">Full HD</option>
                <option value="1280x720">HD</option>
                <option value="854x480">SD</option>
                <option value="custom">مخصص</option>
              </select>
              {settings.video.resolution === 'custom' && (
                <div className="flex items-center gap-3 mt-2">
                  <input type="number" value={settings.video.customWidth} onChange={(e) => handleChange('video.customWidth', parseInt(e.target.value) || 1920)} className="input w-20" placeholder="عرض" />
                  <span className="text-text-muted">x</span>
                  <input type="number" value={settings.video.customHeight} onChange={(e) => handleChange('video.customHeight', parseInt(e.target.value) || 1080)} className="input w-20" placeholder="طول" />
                </div>
              )}
            </SettingItem>
            <SettingItem label="معدل الإطارات">
              <select value={settings.video.fps} onChange={(e) => handleChange('video.fps', e.target.value)} disabled={!settings.video.enabled} className="input">
                <option value="original">الأصلي</option>
                <option value="60">60 fps</option>
                <option value="30">30 fps</option>
                <option value="24">24 fps</option>
                <option value="15">15 fps</option>
              </select>
            </SettingItem>
            <SettingItem label="معدل البت">
              <div className="flex gap-1">
                <input type="text" value={settings.video.bitrate} onChange={(e) => handleChange('video.bitrate', e.target.value)} disabled={!settings.video.enabled || settings.video.codec === 'copy'} className="input flex-1" placeholder="اتركه فارغاً لـ CRF" />
                <select value={settings.video.bitrateUnit} onChange={(e) => handleChange('video.bitrateUnit', e.target.value)} className="input w-16">
                  <option value="k">k</option>
                  <option value="M">M</option>
                </select>
              </div>
            </SettingItem>
          </div>
        </SettingsGroup>
      )}

      {/* Audio Settings */}
      <SettingsGroup icon={<Music className="w-4 h-4" />} title="إعدادات الصوت" enabled={settings.audio.enabled} onToggle={(v) => handleChange('audio.enabled', v)}>
        <div className="grid grid-cols-2 gap-4">
          <SettingItem label="ترميز الصوت">
            <select value={settings.audio.codec} onChange={(e) => handleChange('audio.codec', e.target.value)} disabled={!settings.audio.enabled} className="input">
              <option value="aac">AAC</option>
              <option value="libmp3lame">MP3</option>
              <option value="libopus">Opus</option>
              <option value="flac">FLAC</option>
              <option value="pcm_s16le">PCM 16-bit</option>
              <option value="copy">نسخ (copy)</option>
            </select>
          </SettingItem>
          <SettingItem label="معدل بت الصوت">
            <select value={settings.audio.bitrate} onChange={(e) => handleChange('audio.bitrate', e.target.value)} disabled={!settings.audio.enabled || ['flac','pcm_s16le','copy'].includes(settings.audio.codec)} className="input">
              <option value="64k">64 kbps</option>
              <option value="128k">128 kbps</option>
              <option value="192k">192 kbps</option>
              <option value="256k">256 kbps</option>
              <option value="320k">320 kbps</option>
            </select>
          </SettingItem>
          <SettingItem label="معدل العينات">
            <select value={settings.audio.sampleRate} onChange={(e) => handleChange('audio.sampleRate', e.target.value)} disabled={!settings.audio.enabled} className="input">
              <option value="original">الأصلي</option>
              <option value="48000">48000 Hz</option>
              <option value="44100">44100 Hz</option>
              <option value="22050">22050 Hz</option>
            </select>
          </SettingItem>
          <SettingItem label="القنوات">
            <select value={settings.audio.channels} onChange={(e) => handleChange('audio.channels', e.target.value)} disabled={!settings.audio.enabled} className="input">
              <option value="original">الأصلي</option>
              <option value="2">Stereo</option>
              <option value="1">Mono</option>
            </select>
          </SettingItem>
        </div>
      </SettingsGroup>

      {/* Output Settings */}
      <SettingsGroup icon={<Download className="w-4 h-4" />} title="إعدادات المخرجات">
        <div className="grid grid-cols-2 gap-4">
          <SettingItem label="صيغة المخرج">
            <select value={settings.output.format} onChange={(e) => handleChange('output.format', e.target.value)} className="input">
              <option value="mp4">MP4</option>
              <option value="mkv">MKV</option>
              <option value="webm">WebM</option>
              <option value="avi">AVI</option>
              <option value="mov">MOV</option>
              <option value="mp3">MP3</option>
              <option value="aac">AAC</option>
              <option value="wav">WAV</option>
              <option value="flac">FLAC</option>
            </select>
          </SettingItem>
          <SettingItem label="طريقة التسمية">
            <select value={settings.output.naming} onChange={(e) => handleChange('output.naming', e.target.value)} className="input">
              <option value="suffix">لاحقة</option>
              <option value="prefix">سابقة</option>
              <option value="custom">مخصص</option>
            </select>
          </SettingItem>
          {settings.output.naming === 'suffix' && (
            <SettingItem label="اللاحقة">
              <input type="text" value={settings.output.suffix} onChange={(e) => handleChange('output.suffix', e.target.value)} className="input" placeholder="_converted" />
            </SettingItem>
          )}
          {settings.output.naming === 'prefix' && (
            <SettingItem label="السابقة">
              <input type="text" value={settings.output.prefix} onChange={(e) => handleChange('output.prefix', e.target.value)} className="input" placeholder="converted_" />
            </SettingItem>
          )}
          {settings.output.naming === 'custom' && (
            <SettingItem label="اسم مخصص">
              <input type="text" value={settings.output.customName} onChange={(e) => handleChange('output.customName', e.target.value)} className="input" placeholder="output" />
            </SettingItem>
          )}
          <SettingItem label="الكتابة فوق الملف">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.output.overwrite} onChange={(e) => handleChange('output.overwrite', e.target.checked)} className="w-4 h-4 rounded accent-accent" />
              <span className="text-sm text-text-secondary">الكتابة فوق الملف الموجود (-y)</span>
            </label>
          </SettingItem>
        </div>
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ icon, title, enabled, onToggle, children }: {
  icon: ReactNode; title: string; enabled?: boolean; onToggle?: (v: boolean) => void; children: ReactNode;
}) {
  return (
    <div className="bg-bg-dark border border-border-default rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-bg-medium border-b border-border-default">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
          <span className="text-accent">{icon}</span>
          {title}
        </div>
        {onToggle !== undefined && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={enabled ?? true} onChange={(e) => onToggle(e.target.checked)} className="w-4 h-4 rounded accent-accent" />
            <span className="text-xs text-text-muted">تفعيل</span>
          </label>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SettingItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-text-secondary font-medium">{label}</label>
      {children}
    </div>
  );
}
