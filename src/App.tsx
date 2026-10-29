/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StoryDocument, 
  StoryElement, 
  ToolTab, 
  CanvasBackground, 
  StoryTemplate 
} from './types/editor';
import { STORY_TEMPLATES } from './data/templates';
import { 
  saveProject, 
  saveDraft, 
  loadDraft 
} from './utils/storage';
import { generateThumbnail } from './utils/canvasRenderer';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { CanvasArea } from './components/CanvasArea';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ExportModal } from './components/ExportModal';
import { ProjectsModal } from './components/ProjectsModal';
import { DesignSystemModal } from './components/DesignSystemModal';
import { PreviewModal } from './components/PreviewModal';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // 1. Initial Document Setup
  const [doc, setDoc] = useState<StoryDocument>(() => {
    const draft = loadDraft();
    if (draft && draft.elements && draft.background) {
      return draft;
    }
    // Default to the first rich template (Forest Green / AI Vision)
    const initialTmpl = STORY_TEMPLATES[1] || STORY_TEMPLATES[0];
    return {
      ...initialTmpl.document,
      id: 'proj_' + Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  // 2. Undo / Redo History
  const [historyPast, setHistoryPast] = useState<StoryDocument[]>([]);
  const [historyFuture, setHistoryFuture] = useState<StoryDocument[]>([]);

  const pushHistory = useCallback((newDoc: StoryDocument) => {
    setHistoryPast((prev) => [...prev.slice(-30), doc]);
    setHistoryFuture([]);
    setDoc(newDoc);
  }, [doc]);

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((prev) => prev.slice(0, prev.length - 1));
    setHistoryFuture((prev) => [doc, ...prev]);
    setDoc(previous);
  }, [historyPast, doc]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryFuture((prev) => prev.slice(1));
    setHistoryPast((prev) => [...prev, doc]);
    setDoc(next);
  }, [historyFuture, doc]);

  // 3. Selection & Tools
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ToolTab>('templates');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0.38);

  // 4. Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 5. User Uploaded Images
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // 6. Save Toast Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Auto-fit initial zoom to window size on mount
  useEffect(() => {
    const updateDefaultZoom = () => {
      const availableHeight = window.innerHeight - 100;
      const calculatedZoom = Math.min(0.48, Math.max(0.25, availableHeight / 1920));
      setZoom(Number(calculatedZoom.toFixed(2)));
    };
    updateDefaultZoom();
    window.addEventListener('resize', updateDefaultZoom);
    return () => window.removeEventListener('resize', updateDefaultZoom);
  }, []);

  // Debounced Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(doc);
    }, 1500);
    return () => clearTimeout(timer);
  }, [doc]);

  // Global Keyboard Shortcuts (Undo/Redo, Save)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Don't trigger if typing in text inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProject();
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [handleUndo, handleRedo]);

  // Handle saving project explicitly with thumbnail
  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      const thumbnail = await generateThumbnail(doc);
      const updatedDoc: StoryDocument = {
        ...doc,
        thumbnail,
        updatedAt: Date.now()
      };
      await saveProject(updatedDoc);
      setDoc(updatedDoc);
      setSaveToast(`تم حفظ "${updatedDoc.name}" بنجاح في ذاكرة المتصفح!`);
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Element
  const handleAddElement = (element: StoryElement) => {
    const maxZ = doc.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const newElement = { ...element, zIndex: maxZ + 1 };
    const updated = {
      ...doc,
      elements: [...doc.elements, newElement],
      updatedAt: Date.now()
    };
    pushHistory(updated);
    setSelectedElementId(newElement.id);
  };

  // Update Element
  const handleUpdateElement = (id: string, updates: Partial<StoryElement>) => {
    const updatedElements = doc.elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updates } as StoryElement;
      }
      return el;
    });
    setDoc((prev) => ({
      ...prev,
      elements: updatedElements,
      updatedAt: Date.now()
    }));
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    const updated = {
      ...doc,
      elements: doc.elements.filter((el) => el.id !== id),
      updatedAt: Date.now()
    };
    pushHistory(updated);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Duplicate Element
  const handleDuplicateElement = (id: string) => {
    const original = doc.elements.find((el) => el.id === id);
    if (!original) return;

    const maxZ = doc.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const duplicated: StoryElement = {
      ...original,
      id: `${original.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${original.name} (نسخة)`,
      x: original.x + 30,
      y: original.y + 30,
      zIndex: maxZ + 1
    };

    const updated = {
      ...doc,
      elements: [...doc.elements, duplicated],
      updatedAt: Date.now()
    };
    pushHistory(updated);
    setSelectedElementId(duplicated.id);
  };

  // Layer Reordering
  const handleBringForward = (id: string) => {
    const el = doc.elements.find((e) => e.id === id);
    if (!el) return;
    const sorted = [...doc.elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((e) => e.id === id);
    if (index < sorted.length - 1) {
      const nextEl = sorted[index + 1];
      const tempZ = el.zIndex;
      el.zIndex = nextEl.zIndex;
      nextEl.zIndex = tempZ;
      pushHistory({ ...doc, elements: [...doc.elements] });
    }
  };

  const handleSendBackward = (id: string) => {
    const el = doc.elements.find((e) => e.id === id);
    if (!el) return;
    const sorted = [...doc.elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((e) => e.id === id);
    if (index > 0) {
      const prevEl = sorted[index - 1];
      const tempZ = el.zIndex;
      el.zIndex = prevEl.zIndex;
      prevEl.zIndex = tempZ;
      pushHistory({ ...doc, elements: [...doc.elements] });
    }
  };

  const handleBringToFront = (id: string) => {
    const maxZ = doc.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    handleUpdateElement(id, { zIndex: maxZ + 1 });
  };

  const handleSendToBack = (id: string) => {
    const minZ = doc.elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
    handleUpdateElement(id, { zIndex: Math.max(1, minZ - 1) });
  };

  // Background Change
  const handleChangeBackground = (bgUpdates: Partial<CanvasBackground>) => {
    const updatedBg = { ...doc.background, ...bgUpdates };
    pushHistory({ ...doc, background: updatedBg });
  };

  // Apply Template
  const handleApplyTemplate = (template: StoryTemplate) => {
    const updated: StoryDocument = {
      ...template.document,
      id: doc.id,
      createdAt: doc.createdAt,
      updatedAt: Date.now()
    };
    pushHistory(updated);
    setSelectedElementId(null);
  };

  // Upload Local Image
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setUploadedImages((prev) => [dataUrl, ...prev]);
        // Automatically add image to center of story
        handleAddElement({
          id: 'img_' + Date.now(),
          type: 'image',
          name: file.name.replace(/\.[^/.]+$/, ''),
          x: 140,
          y: 600,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 10,
          locked: false,
          hidden: false,
          src: dataUrl,
          objectFit: 'cover',
          borderRadius: 24,
          borderColor: '#2D6A4F',
          borderWidth: 2
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset current canvas to blank
  const handleResetCanvas = () => {
    const blankTmpl = STORY_TEMPLATES.find((t) => t.id === 'blank_canvas') || STORY_TEMPLATES[0];
    const newBlankDoc: StoryDocument = {
      ...blankTmpl.document,
      id: 'proj_' + Date.now(),
      name: 'قصة جديدة فارغة',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    pushHistory(newBlankDoc);
    setSelectedElementId(null);
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#080E0A] text-[#FAF6F0] overflow-hidden selection:bg-[#39FF14] selection:text-[#0E1A12] antialiased">
      {/* 1. TOP NAVBAR */}
      <Navbar
        projectName={doc.name}
        onRenameProject={(name) => {
          setDoc((prev) => ({ ...prev, name }));
        }}
        canUndo={historyPast.length > 0}
        canRedo={historyFuture.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(1.2, +(z + 0.05).toFixed(2)))}
        onZoomOut={() => setZoom((z) => Math.max(0.15, +(z - 0.05).toFixed(2)))}
        onResetZoom={() => setZoom(0.38)}
        showSafeZones={showSafeZones}
        onToggleSafeZones={() => setShowSafeZones((s) => !s)}
        onSave={handleSaveProject}
        isSaving={isSaving}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetCanvas={() => setIsResetConfirmOpen(true)}
      />

      {/* 2. MAIN 3-ZONE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Assets, Templates & Uploads */}
        <LeftSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onApplyTemplate={handleApplyTemplate}
          onAddElement={handleAddElement}
          background={doc.background}
          onChangeBackground={handleChangeBackground}
          uploadedImages={uploadedImages}
          onUploadImage={handleUploadImage}
        />

        {/* Center Live Story Canvas Viewport */}
        <CanvasArea
          document={doc}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          zoom={zoom}
          showSafeZones={showSafeZones}
        />

        {/* Right Sidebar: Properties & Layers Inspector */}
        <PropertiesPanel
          document={doc}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onChangeBackground={handleChangeBackground}
        />
      </div>

      {/* 3. MODALS */}
      {/* Export 1080x1920 Modal */}
      <ExportModal
        document={doc}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Saved Projects Gallery */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentDocument={doc}
        onOpenProject={(proj) => {
          setDoc(proj);
          setSelectedElementId(null);
        }}
        onNewBlankProject={() => {
          handleResetCanvas();
        }}
      />

      {/* Brand Guidelines & Design System */}
      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />

      {/* Story Clean Preview Modal */}
      <PreviewModal
        document={doc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1A12] border border-[#2D6A4F] rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-kufam font-black text-lg text-[#FAF6F0]">
                إعادة تعيين التصميم؟
              </h3>
              <p className="text-xs text-[#A5D6A7]/80 mt-1 leading-relaxed">
                هل أنت متأكد من رغبتك في مسح كافة العناصر الحالية والبدء بلوحة قصة جديدة فارغة؟
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleResetCanvas}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
              >
                نعم، إعادة التعيين
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 px-4 bg-[#14261B] hover:bg-[#1B2E21] text-[#FAF6F0] text-xs font-medium rounded-xl border border-[#2D6A4F]/40 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NOTIFICATION TOAST */}
      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0E1A12] border border-[#39FF14] text-[#FAF6F0] px-5 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}
