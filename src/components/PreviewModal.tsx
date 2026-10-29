/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StoryDocument } from '../types/editor';
import { renderStoryToCanvas } from '../utils/canvasRenderer';
import { X, Download, Loader2, Maximize2 } from 'lucide-react';

interface PreviewModalProps {
  document: StoryDocument;
  isOpen: boolean;
  onClose: () => void;
  onOpenExport: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onOpenExport
}) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setPreviewSrc(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    renderStoryToCanvas(doc, 1080, 1920)
      .then((canvas) => {
        if (!isMounted) return;
        setPreviewSrc(canvas.toDataURL('image/png'));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Preview render failed:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, doc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none">
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-[#39FF14] font-kufam font-black flex items-center justify-center">
            ل
          </div>
          <div>
            <h3 className="font-kufam font-bold text-sm text-[#FAF6F0]">{doc.name}</h3>
            <span className="text-[10px] text-[#A5D6A7]/70 font-mono">1080 × 1920 PX · LIVE PREVIEW</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenExport();
            }}
            className="px-3.5 py-1.5 bg-[#39FF14] hover:bg-[#00FF66] text-[#0E1A12] text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(57,255,20,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>تصدير الصورة</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] text-white rounded-xl border border-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Phone Container */}
      <div className="flex-1 flex items-center justify-center p-2 w-full my-auto overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-xs text-[#A5D6A7]">
            <Loader2 className="w-8 h-8 text-[#39FF14] animate-spin" />
            <span>جارٍ تصيير المعاينة...</span>
          </div>
        ) : previewSrc ? (
          <div className="relative h-full max-h-[82vh] aspect-[9/16] rounded-[44px] overflow-hidden shadow-[0_0_70px_rgba(0,0,0,0.9)] border-4 border-[#1B2E21] bg-[#0E1A12]">
            <img
              src={previewSrc}
              alt="Story Preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : null}
      </div>

      {/* Bottom Hint */}
      <div className="text-[11px] text-[#A5D6A7]/60 font-mono z-10">
        Instagram Story Frame (9:16 Aspect Ratio)
      </div>
    </div>
  );
};
