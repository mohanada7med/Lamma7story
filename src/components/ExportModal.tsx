/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoryDocument } from '../types/editor';
import { renderStoryToCanvas } from '../utils/canvasRenderer';
import { X, Download, CheckCircle2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  document: StoryDocument;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  document: doc,
  isOpen,
  onClose
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState<number>(0.95);
  const [fileName, setFileName] = useState<string>(
    `${(doc.name || 'lamma7-story').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')}_1080x1920`
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setDownloadSuccess(false);
      return;
    }

    let isMounted = true;
    setIsRendering(true);

    // Render off-screen full resolution preview
    renderStoryToCanvas(doc, 1080, 1920)
      .then((canvas) => {
        if (!isMounted) return;
        const url = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', quality);
        setPreviewUrl(url);
        setIsRendering(false);
      })
      .catch((err) => {
        console.error('Failed to generate export preview:', err);
        if (isMounted) setIsRendering(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, doc, format, quality]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const canvas = await renderStoryToCanvas(doc, 1080, 1920);
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const extension = format === 'png' ? 'png' : 'jpg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsDownloading(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          const cleanName = (fileName.trim() || 'lamma7_story').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
          link.href = url;
          link.download = `${cleanName}.${extension}`;
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setIsDownloading(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 4000);
        },
        mimeType,
        quality
      );
    } catch (err) {
      console.error('Download failed:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1A12] border border-[#2D6A4F] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-[#FAF6F0]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D6A4F]/40 flex items-center justify-between bg-[#0A130D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B2E21] border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-kufam font-black text-base sm:text-lg">
                تصدير قصة إنستغرام بأعلى دقة (1080 × 1920)
              </h2>
              <p className="text-xs text-[#A5D6A7]/70">
                صورة نقية خالية من أشرطة الأدوات ومقابض التحكم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A5D6A7] hover:text-white hover:bg-[#1B2E21] rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Settings Form (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 text-xs">
            {/* File Name */}
            <div>
              <label className="block font-bold text-[#FAF6F0] mb-1.5 font-kufam">
                اسم الملف عند التنزيل
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-[#14261B] border border-[#2D6A4F]/70 rounded-xl px-3 py-2 text-xs font-mono text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
              />
            </div>

            {/* Format Choice */}
            <div>
              <label className="block font-bold text-[#FAF6F0] mb-1.5 font-kufam">
                صيغة الصورة
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormat('png')}
                  className={`py-2 px-3 rounded-xl border text-center transition ${
                    format === 'png'
                      ? 'bg-[#1B2E21] border-[#39FF14] text-[#39FF14] font-bold shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                      : 'bg-[#14261B] border-[#2D6A4F]/40 text-[#C8E6C9]'
                  }`}
                >
                  <span className="block font-bold text-xs">PNG (موصى بها)</span>
                  <span className="text-[10px] text-[#A5D6A7]/60">أعلى نقاء وشفافية</span>
                </button>
                <button
                  onClick={() => setFormat('jpeg')}
                  className={`py-2 px-3 rounded-xl border text-center transition ${
                    format === 'jpeg'
                      ? 'bg-[#1B2E21] border-[#39FF14] text-[#39FF14] font-bold shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                      : 'bg-[#14261B] border-[#2D6A4F]/40 text-[#C8E6C9]'
                  }`}
                >
                  <span className="block font-bold text-xs">JPG / JPEG</span>
                  <span className="text-[10px] text-[#A5D6A7]/60">حجم ملف مضغوط</span>
                </button>
              </div>
            </div>

            {/* Quality Slider (for JPG) */}
            {format === 'jpeg' && (
              <div>
                <div className="flex justify-between text-xs text-[#A5D6A7] mb-1">
                  <span>جودة الضغط</span>
                  <span className="font-mono">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-[#39FF14] cursor-pointer"
                />
              </div>
            )}

            {/* Technical Export Specs */}
            <div className="p-3 bg-[#14261B] rounded-2xl border border-[#2D6A4F]/40 space-y-2 mt-auto">
              <span className="text-[10px] text-[#39FF14] font-bold font-mono">
                EXPORT SPECIFICATIONS
              </span>
              <div className="space-y-1 text-[11px] text-[#A5D6A7]/80">
                <div className="flex justify-between">
                  <span>الأبعاد الدقيقة:</span>
                  <span className="font-mono text-[#FAF6F0]">1080 × 1920 PX</span>
                </div>
                <div className="flex justify-between">
                  <span>نسبة العرض للارتفاع:</span>
                  <span className="font-mono text-[#FAF6F0]">9:16 (Instagram Standard)</span>
                </div>
                <div className="flex justify-between">
                  <span>دقة الخطوط العربية:</span>
                  <span className="font-mono text-[#FAF6F0]">Native TrueType Raster</span>
                </div>
              </div>
            </div>

            {/* Success message */}
            {downloadSuccess && (
              <div className="p-3 bg-[#39FF14]/15 border border-[#39FF14] rounded-xl flex items-center gap-2 text-xs text-[#39FF14] font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>تم تنزيل قصة إنستغرام بنجاح بأعلى دقة!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDownload}
                disabled={isRendering || isDownloading}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#39FF14] hover:bg-[#00FF66] text-[#0E1A12] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ معالجة التصدير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تنزيل الصورة الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Live Image Preview (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-[#070D09] rounded-2xl p-4 border border-[#2D6A4F]/30 min-h-[420px]">
            {isRendering ? (
              <div className="flex flex-col items-center gap-3 text-xs text-[#A5D6A7]">
                <Loader2 className="w-8 h-8 text-[#39FF14] animate-spin" />
                <span>جارٍ معالجة وتصيير الصورة بدقة 1080×1920...</span>
              </div>
            ) : previewUrl ? (
              <div className="relative max-h-[500px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#2D6A4F]/60">
                <img
                  src={previewUrl}
                  alt="Story Render Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="text-xs text-neutral-500">فشل تجهيز المعاينة</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
