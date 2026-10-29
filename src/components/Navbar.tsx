/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Eye, 
  Download, 
  FolderOpen, 
  Save, 
  Sparkles, 
  RotateCcw,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  projectName: string;
  onRenameProject: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showSafeZones: boolean;
  onToggleSafeZones: () => void;
  onSave: () => void;
  isSaving: boolean;
  onOpenProjects: () => void;
  onOpenDesignSystem: () => void;
  onOpenPreview: () => void;
  onOpenExport: () => void;
  onResetCanvas: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  onRenameProject,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showSafeZones,
  onToggleSafeZones,
  onSave,
  isSaving,
  onOpenProjects,
  onOpenDesignSystem,
  onOpenPreview,
  onOpenExport,
  onResetCanvas
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectName);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onRenameProject(titleInput.trim());
    } else {
      setTitleInput(projectName);
    }
  };

  return (
    <header className="h-16 bg-[#0E1A12] border-b border-[#2D6A4F]/40 px-3 sm:px-6 flex items-center justify-between gap-3 select-none z-30 shrink-0">
      {/* Zone 1: Brand & Project Name */}
      <div className="flex items-center gap-3">
        {/* Brand Logo Box */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#0E1A12] border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14] font-kufam font-black text-xl shadow-[0_0_12px_rgba(57,255,20,0.25)]">
          <img src="assets/aistudio/Group 6.png" alt="" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-kufam font-bold text-sm sm:text-base text-[#FAF6F0] tracking-wide">
              لَمّاح
            </span>
            <span className="text-[10px] text-[#A5D6A7] font-mono border-r border-[#2D6A4F]/60 pr-2 hidden md:inline">
              Story Studio
            </span>

            {/* Editable Project Title */}
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleInput(projectName);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="bg-[#1B2E21] text-xs text-[#FAF6F0] px-2 py-0.5 rounded border border-[#39FF14] focus:outline-none max-w-[160px] sm:max-w-[220px]"
              />
            ) : (
              <button
                onClick={() => {
                  setTitleInput(projectName);
                  setIsEditingTitle(true);
                }}
                title="اضغط لتعديل اسم المشروع"
                className="text-xs text-[#C8E6C9] hover:text-white hover:bg-[#1B2E21] px-2 py-0.5 rounded transition truncate max-w-[140px] sm:max-w-[200px] text-right font-medium"
              >
                {projectName}
              </button>
            )}
          </div>
          <span className="text-[10px] text-[#A5D6A7]/70 hidden sm:block">
            روبوت الفحص الزراعي والذكاء الاصطناعي
          </span>
        </div>
      </div>

      {/* Zone 2: Editor Tools (History, Zoom, Guides) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* History: Undo / Redo */}
        <div className="flex items-center bg-[#14261B] rounded-lg p-0.5 border border-[#2D6A4F]/40">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="تراجع (Ctrl+Z)"
            className={`p-1.5 rounded-md transition ${
              canUndo
                ? 'text-[#FAF6F0] hover:bg-[#2D6A4F]/50'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="إعادة (Ctrl+Y)"
            className={`p-1.5 rounded-md transition ${
              canRedo
                ? 'text-[#FAF6F0] hover:bg-[#2D6A4F]/50'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden lg:flex items-center bg-[#14261B] rounded-lg p-0.5 border border-[#2D6A4F]/40 text-xs">
          <button
            onClick={onZoomOut}
            title="تصغير"
            className="p-1.5 text-[#C8E6C9] hover:text-white hover:bg-[#2D6A4F]/50 rounded-md transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onResetZoom}
            title="إعادة ضبط حجم العرض"
            className="px-2 py-1 text-[11px] font-mono text-[#FAF6F0] hover:bg-[#2D6A4F]/50 rounded transition"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            title="تكبير"
            className="p-1.5 text-[#C8E6C9] hover:text-white hover:bg-[#2D6A4F]/50 rounded-md transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Safe Zones Toggle */}
        <button
          onClick={onToggleSafeZones}
          title="إظهار / إخفاء حدود أمان إنستغرام"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition border ${
            showSafeZones
              ? 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/50'
              : 'text-[#C8E6C9] hover:bg-[#14261B] border-transparent'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="hidden xl:inline">حدود الأمان</span>
        </button>

        {/* Reset Canvas */}
        <button
          onClick={onResetCanvas}
          title="إعادة تعيين التصميم"
          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Brand Identity Reference */}
        <button
          onClick={onOpenDesignSystem}
          title="دليل الهوية البصرية لـ لَمّاح"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#FAF6F0] hover:text-[#39FF14] bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/50 rounded-lg transition"
        >
          <HelpCircle className="w-4 h-4 text-[#66BB6A]" />
          <span className="hidden lg:inline">دليل الهوية</span>
        </button>
      </div>

      {/* Zone 3: Primary Actions (Save, Projects, Preview, Export) */}
      <div className="flex items-center gap-2">
        {/* Save Project */}
        <button
          onClick={onSave}
          disabled={isSaving}
          title="حفظ المشروع في المتصفح"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FAF6F0] bg-[#1B2E21] hover:bg-[#2D6A4F] border border-[#2D6A4F]/60 rounded-lg transition"
        >
          <Save className="w-4 h-4 text-[#66BB6A]" />
          <span className="hidden sm:inline">{isSaving ? 'جارٍ الحفظ...' : 'حفظ'}</span>
        </button>

        {/* Saved Projects Gallery */}
        <button
          onClick={onOpenProjects}
          title="معرض المشاريع المحفوظة"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FAF6F0] bg-[#1B2E21] hover:bg-[#2D6A4F] border border-[#2D6A4F]/60 rounded-lg transition"
        >
          <FolderOpen className="w-4 h-4 text-[#FFCC80]" />
          <span className="hidden md:inline">مشاريعي</span>
        </button>

        {/* Preview Story */}
        <button
          onClick={onOpenPreview}
          title="معاينة القصة النهائية"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FAF6F0] bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/50 rounded-lg transition"
        >
          <Eye className="w-4 h-4 text-[#A5D6A7]" />
          <span className="hidden sm:inline">معاينة</span>
        </button>

        {/* Export Story */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#0E1A12] bg-[#39FF14] hover:bg-[#00FF66] rounded-lg transition shadow-[0_0_12px_rgba(57,255,20,0.35)] shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>تصدير 1080p</span>
        </button>
      </div>
    </header>
  );
};
