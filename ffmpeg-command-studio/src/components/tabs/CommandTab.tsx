// components/tabs/CommandTab.tsx
import { useState } from 'react';
import { Terminal, Copy, Download, RefreshCw, CheckCircle } from 'lucide-react';
import { useAppStore, selectSelectedFile } from '@store';
import { useFFmpegCommands } from '@hooks/useTauri';
import { clipboardApi, dialogApi } from '@lib/tauri';
import { highlightCommand } from '@lib/utils';
import type { FFmpegCommand } from '@types';

export default function CommandTab() {
  const selectedFile = useAppStore(selectSelectedFile);
  const addToast = useAppStore((state) => state.addToast);
  const { generateCommand } = useFFmpegCommands();
  const [generatedCommand, setGeneratedCommand] = useState<FFmpegCommand | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const cmd = await generateCommand();
      if (cmd) setGeneratedCommand(cmd);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await clipboardApi.writeText(text);
      addToast('تم النسخ إلى الحافظة', 'success');
    } catch {
      addToast('فشل النسخ', 'error');
    }
  };

  const handleExport = async () => {
    if (!generatedCommand) return;
    const savePath = await dialogApi.saveFile('commands.sh');
    if (savePath && typeof savePath === 'string') {
      addToast('تم التصدير', 'success');
    }
  };

  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted gap-4">
        <Terminal className="w-16 h-16 opacity-20" />
        <div className="text-center">
          <p className="text-xl text-text-secondary mb-2">اختر ملفاً أولاً</p>
          <p className="text-sm">حدد ملفاً من قائمة الانتظار لتوليد أمر FFmpeg</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">توليد الأمر</h2>
          <p className="text-sm text-text-muted">{selectedFile.name}</p>
        </div>
        <div className="flex gap-2">
          {generatedCommand && (
            <>
              <button onClick={handleExport} className="btn text-xs">
                <Download className="w-4 h-4" />
                تصدير
              </button>
              <button onClick={() => handleCopy(generatedCommand.command)} className="btn text-xs">
                <Copy className="w-4 h-4" />
                نسخ
              </button>
            </>
          )}
          <button onClick={handleGenerate} disabled={isGenerating} className="btn btn-primary text-xs">
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Terminal className="w-4 h-4" />
            )}
            {isGenerating ? 'جاري التوليد...' : 'توليد الأمر'}
          </button>
        </div>
      </div>

      {/* Command Display */}
      {generatedCommand ? (
        <div className="flex flex-col gap-4">
          <div className="bg-bg-darkest border border-border-default rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-bg-medium border-b border-border-default">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-text-secondary">الأمر الكامل</span>
              </div>
              <button
                onClick={() => handleCopy(generatedCommand.command)}
                className="btn btn-icon text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[300px]">
              <pre
                className="font-mono text-[12px] leading-relaxed text-text-primary whitespace-pre-wrap break-all"
                dangerouslySetInnerHTML={{ __html: highlightCommand(generatedCommand.command) }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-dark border border-border-default rounded-lg p-3">
              <p className="text-xs text-text-muted mb-1">ملف المدخل</p>
              <p className="text-sm text-text-primary truncate">{generatedCommand.inputFile}</p>
            </div>
            <div className="bg-bg-dark border border-border-default rounded-lg p-3">
              <p className="text-xs text-text-muted mb-1">ملف المخرج</p>
              <p className="text-sm text-text-primary truncate">{generatedCommand.outputFile}</p>
            </div>
          </div>

          {/* Parts breakdown */}
          <div className="bg-bg-dark border border-border-default rounded-xl p-4">
            <p className="text-sm text-text-secondary mb-3 font-semibold">تفصيل الأمر</p>
            <div className="flex flex-wrap gap-2">
              {generatedCommand.parts.map((part, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    part === 'ffmpeg' ? 'bg-accent text-bg-darkest font-bold' :
                    part.startsWith('-') ? 'bg-info-bg text-info border border-info/20' :
                    part.startsWith('"') ? 'bg-warning/10 text-yellow-400 border border-yellow-400/20' :
                    'bg-bg-medium text-text-primary border border-border-default'
                  }`}
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-text-muted gap-4">
          <Terminal className="w-12 h-12 opacity-20" />
          <p className="text-sm">اضغط "توليد الأمر" للبدء</p>
        </div>
      )}
    </div>
  );
}
