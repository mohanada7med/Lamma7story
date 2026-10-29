/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoryDocument } from '../types/editor';
import { 
  getAllProjects, 
  deleteProject, 
  exportProjectFile, 
  importProjectFile, 
  saveProject 
} from '../utils/storage';
import { 
  X, 
  FolderOpen, 
  Plus, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileCode
} from 'lucide-react';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocument: StoryDocument;
  onOpenProject: (project: StoryDocument) => void;
  onNewBlankProject: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentDocument,
  onOpenProject,
  onNewBlankProject
}) => {
  const [projects, setProjects] = useState<StoryDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Load saved projects
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const list = await getAllProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      setDeleteConfirmId(null);
      setImportStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Duplicate an existing project
  const handleDuplicate = async (project: StoryDocument) => {
    const dup: StoryDocument = {
      ...project,
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: `${project.name} (نسخة)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await saveProject(dup);
    await fetchProjects();
  };

  // Delete project
  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setDeleteConfirmId(null);
    await fetchProjects();
  };

  // Import JSON backup file
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imported = await importProjectFile(e.target.files[0]);
        await saveProject(imported);
        await fetchProjects();
        setImportStatus(`تم استيراد المشروع "${imported.name}" بنجاح!`);
        setTimeout(() => setImportStatus(null), 4000);
      } catch (err: any) {
        alert(err.message || 'فشل استيراد المشروع');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1A12] border border-[#2D6A4F] rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-[#FAF6F0]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D6A4F]/40 flex items-center justify-between bg-[#0A130D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B2E21] border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14]">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-kufam font-black text-base sm:text-lg">
                معرض المشاريع المحفوظة (Saved Projects)
              </h2>
              <p className="text-xs text-[#A5D6A7]/70">
                إدارة وحفظ ونقل تصاميم قصص لَمّاح عبر المتصفح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Import Project File */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/60 text-xs text-[#C8E6C9] hover:text-white rounded-xl cursor-pointer transition">
              <Upload className="w-4 h-4 text-[#39FF14]" />
              <span className="hidden sm:inline">استيراد مشروع (.json)</span>
              <input
                type="file"
                accept=".json,.lamma7"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-[#A5D6A7] hover:text-white hover:bg-[#1B2E21] rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Info Banner */}
        <div className="px-5 py-2.5 bg-[#1B2E21]/60 border-b border-[#2D6A4F]/30 text-[11px] text-[#C8E6C9] flex items-center justify-between">
          <span>
            💡 يتم حفظ مشاريعك محلياً في هذا المتصفح باستخدام IndexedDB. للنسخ الاحتياطي أو النقل لجهاز آخر، استخدم زر "تصدير ملف".
          </span>
          {importStatus && (
            <span className="text-[#39FF14] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {importStatus}
            </span>
          )}
        </div>

        {/* Project Gallery List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="p-16 text-center text-xs text-[#A5D6A7]">
              جارٍ تحميل المشاريع المحفوظة...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: New Blank Project */}
              <div
                onClick={() => {
                  onNewBlankProject();
                  onClose();
                }}
                className="h-72 rounded-2xl border-2 border-dashed border-[#2D6A4F]/60 hover:border-[#39FF14] bg-[#14261B]/40 hover:bg-[#14261B] flex flex-col items-center justify-center gap-3 cursor-pointer transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1B2E21] border border-[#2D6A4F] group-hover:border-[#39FF14] flex items-center justify-center text-[#39FF14] transition">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="font-kufam font-bold text-sm text-[#FAF6F0] group-hover:text-[#39FF14] transition block">
                    إنشاء قصة جديدة فارغة
                  </span>
                  <span className="text-[11px] text-[#A5D6A7]/60">
                    البدء من الصفر
                  </span>
                </div>
              </div>

              {/* Saved Projects Cards */}
              {projects.map((proj) => {
                const isCurrent = proj.id === currentDocument.id;
                const formattedDate = new Date(proj.updatedAt || Date.now()).toLocaleDateString('ar-EG', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={proj.id}
                    className={`h-72 rounded-2xl border flex flex-col justify-between overflow-hidden bg-[#14261B] transition ${
                      isCurrent
                        ? 'border-[#39FF14] ring-2 ring-[#39FF14]/30'
                        : 'border-[#2D6A4F]/40 hover:border-[#2D6A4F]'
                    }`}
                  >
                    {/* Top Preview Area / Thumbnail */}
                    <div
                      onClick={() => {
                        onOpenProject(proj);
                        onClose();
                      }}
                      className="flex-1 bg-[#09130D] relative flex items-center justify-center cursor-pointer group overflow-hidden"
                    >
                      {proj.thumbnail ? (
                        <img
                          src={proj.thumbnail}
                          alt={proj.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-500 group-hover:text-[#39FF14] transition">
                          <div className="w-10 h-10 rounded-xl bg-[#0E1A12] border border-[#2D6A4F] flex items-center justify-center text-lg font-kufam font-bold text-[#39FF14]">
                            ل
                          </div>
                          <span className="text-[11px] font-mono">1080 × 1920</span>
                        </div>
                      )}

                      {isCurrent && (
                        <span className="absolute top-2 right-2 bg-[#39FF14] text-[#0E1A12] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shadow">
                          مفتوح حالياً
                        </span>
                      )}
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="p-3 bg-[#0E1A12] border-t border-[#2D6A4F]/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs text-[#FAF6F0] truncate font-kufam">
                          {proj.name}
                        </h3>
                        <span className="text-[10px] text-[#A5D6A7]/70 font-mono">
                          {proj.elements?.length || 0} عناصر
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#A5D6A7]/60">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </span>

                        {/* Project Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => exportProjectFile(proj)}
                            title="تصدير ملف المشروع (.json)"
                            className="p-1 text-[#A5D6A7] hover:text-white hover:bg-[#1B2E21] rounded"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(proj)}
                            title="نسخ المشروع"
                            className="p-1 text-[#66BB6A] hover:bg-[#1B2E21] rounded"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(proj.id)}
                            title="حذف المشروع"
                            className="p-1 text-red-400 hover:bg-red-950/40 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation Box */}
                      {deleteConfirmId === proj.id && (
                        <div className="p-2 bg-red-950/90 border border-red-500/50 rounded-xl flex items-center justify-between text-[11px] text-red-200">
                          <span>هل تريد حذف هذا المشروع نهائياً؟</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(proj.id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
                            >
                              حذف
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
