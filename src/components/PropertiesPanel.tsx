/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  StoryDocument, 
  StoryElement, 
  TextElement, 
  ImageElement, 
  ShapeElement, 
  CVOverlayElement, 
  BotanicalElement, 
  StickerElement, 
  BrandingElement,
  CanvasBackground
} from '../types/editor';
import { COLOR_SWATCHES, BRAND_COLORS, BOTANICAL_PATHS } from '../data/assets';
import { 
  Sliders, 
  Layers, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Scan, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  AlignRight, 
  AlignCenter, 
  AlignLeft, 
  Italic, 
  Bold,
  RotateCcw,
  Palette
} from 'lucide-react';

interface PropertiesPanelProps {
  document: StoryDocument;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<StoryElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onChangeBackground: (bg: Partial<CanvasBackground>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  document: doc,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onChangeBackground
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const selectedElement = doc.elements.find((el) => el.id === selectedElementId);

  return (
    <aside className="w-80 bg-[#0E1A12] border-r border-[#2D6A4F]/40 flex flex-col h-full select-none z-20 shrink-0">
      {/* Top Header Switcher (Properties vs Layers) */}
      <div className="p-3 border-b border-[#2D6A4F]/30 flex items-center gap-1 bg-[#0A130D]">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'properties'
              ? 'bg-[#1B2E21] text-[#39FF14] border border-[#39FF14]/40'
              : 'text-[#C8E6C9]/70 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>خصائص العنصر</span>
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'layers'
              ? 'bg-[#1B2E21] text-[#39FF14] border border-[#39FF14]/40'
              : 'text-[#C8E6C9]/70 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>الطبقات ({doc.elements.length})</span>
        </button>
      </div>

      {/* Panel Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-[#FAF6F0]">
        {activeTab === 'layers' ? (
          /* ================= LAYERS LIST ================= */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#A5D6A7]">
              <span>ترتيب الطبقات (من الأعلى للأسفل)</span>
              <span className="font-mono text-[10px]">{doc.elements.length} عناصر</span>
            </div>

            {doc.elements.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 bg-[#14261B] rounded-xl border border-dashed border-[#2D6A4F]/50">
                لا توجد عناصر في التصميم حالياً
              </div>
            ) : (
              <div className="space-y-1.5">
                {[...doc.elements]
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((el) => {
                    const isSelected = el.id === selectedElementId;
                    return (
                      <div
                        key={el.id}
                        onClick={() => onSelectElement(el.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B2E21] border-[#39FF14] shadow-[0_0_8px_rgba(57,255,20,0.2)]'
                            : 'bg-[#14261B] border-[#2D6A4F]/30 hover:border-[#2D6A4F]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate max-w-[150px]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-[#39FF14]' : 'bg-[#66BB6A]/40'
                            }`}
                          />
                          <span className="truncate font-medium text-xs">{el.name}</span>
                        </div>

                        {/* Quick Layer Actions */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onUpdateElement(el.id, { hidden: !el.hidden })}
                            title={el.hidden ? 'إظهار الطبقة' : 'إخفاء الطبقة'}
                            className={`p-1 rounded hover:bg-[#2D6A4F] ${
                              el.hidden ? 'text-neutral-500' : 'text-[#FAF6F0]'
                            }`}
                          >
                            {el.hidden ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onUpdateElement(el.id, { locked: !el.locked })}
                            title={el.locked ? 'فك القفل' : 'قفل الطبقة'}
                            className={`p-1 rounded hover:bg-[#2D6A4F] ${
                              el.locked ? 'text-yellow-400' : 'text-neutral-400'
                            }`}
                          >
                            {el.locked ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onBringForward(el.id)}
                            title="تقديم طبقة للأمام"
                            className="p-1 rounded hover:bg-[#2D6A4F] text-[#FAF6F0]"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSendBackward(el.id)}
                            title="تأخير طبقة للخلف"
                            className="p-1 rounded hover:bg-[#2D6A4F] text-[#FAF6F0]"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteElement(el.id)}
                            title="حذف الطبقة"
                            className="p-1 rounded hover:bg-red-950 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : selectedElement ? (
          /* ================= PROPERTIES OF SELECTED ELEMENT ================= */
          <div className="space-y-5">
            {/* Element Name & Layer Controls */}
            <div className="pb-3 border-b border-[#2D6A4F]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#39FF14] font-mono uppercase block">
                  {selectedElement.type}
                </span>
                <input
                  type="text"
                  value={selectedElement.name}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, { name: e.target.value })
                  }
                  className="bg-transparent font-bold text-xs text-[#FAF6F0] focus:outline-none border-b border-transparent hover:border-[#2D6A4F] focus:border-[#39FF14]"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDuplicateElement(selectedElement.id)}
                  title="مضاعفة العنصر"
                  className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-[#66BB6A]"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    onUpdateElement(selectedElement.id, { locked: !selectedElement.locked })
                  }
                  title={selectedElement.locked ? 'فك القفل' : 'قفل العنصر'}
                  className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-yellow-400"
                >
                  {selectedElement.locked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteElement(selectedElement.id)}
                  title="حذف العنصر"
                  className="p-1.5 bg-red-950/40 hover:bg-red-950 border border-red-500/40 rounded-lg text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Geometry: Position & Size */}
            <div className="space-y-2">
              <label className="font-bold text-xs text-[#FAF6F0] block">
                الأبعاد والموضع (Pixels)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                  <span className="text-[10px] text-[#A5D6A7]">العرض (Width)</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        width: Math.max(20, parseInt(e.target.value) || 20)
                      })
                    }
                    className="w-full bg-transparent font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                  <span className="text-[10px] text-[#A5D6A7]">الارتفاع (Height)</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        height: Math.max(20, parseInt(e.target.value) || 20)
                      })
                    }
                    className="w-full bg-transparent font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                  <span className="text-[10px] text-[#A5D6A7]">الموضع السيني (X)</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        x: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full bg-transparent font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                  <span className="text-[10px] text-[#A5D6A7]">الموضع الصادي (Y)</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        y: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full bg-transparent font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Rotation & Opacity */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-[#A5D6A7] mb-1">
                    <span>التدوير</span>
                    <span className="font-mono">{selectedElement.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedElement.rotation}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        rotation: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full accent-[#39FF14] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-[#A5D6A7] mb-1">
                    <span>الشفافية</span>
                    <span className="font-mono">{Math.round(selectedElement.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={selectedElement.opacity}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        opacity: parseFloat(e.target.value) || 1
                      })
                    }
                    className="w-full accent-[#39FF14] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Layer Depth (Front / Back) */}
            <div className="pt-2 border-t border-[#2D6A4F]/30 space-y-2">
              <label className="font-bold text-xs text-[#FAF6F0] block">ترتيب الطبقة</label>
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                <button
                  onClick={() => onBringToFront(selectedElement.id)}
                  className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-center"
                >
                  للأمام كلياً
                </button>
                <button
                  onClick={() => onBringForward(selectedElement.id)}
                  className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-center"
                >
                  خطوة للأمام
                </button>
                <button
                  onClick={() => onSendBackward(selectedElement.id)}
                  className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-center"
                >
                  خطوة للخلف
                </button>
                <button
                  onClick={() => onSendToBack(selectedElement.id)}
                  className="p-1.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-center"
                >
                  للخلف كلياً
                </button>
              </div>
            </div>

            {/* ============ 1. TEXT PROPERTIES ============ */}
            {selectedElement.type === 'text' && (
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="font-bold text-xs text-[#39FF14] block font-kufam">
                  محتوى النص وتنسيق الخطوط
                </label>

                {/* Text Content Area */}
                <div>
                  <textarea
                    rows={3}
                    value={(selectedElement as TextElement).content}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { content: e.target.value })
                    }
                    className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2.5 text-xs text-[#FAF6F0] focus:outline-none focus:border-[#39FF14] leading-relaxed text-right"
                  />
                </div>

                {/* Font Family Picker */}
                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">نوع الخط العربي</label>
                  <select
                    value={(selectedElement as TextElement).fontFamily}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        fontFamily: e.target.value as any
                      })
                    }
                    className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2 text-xs text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="Kufam">Kufam (كوفي تقني حديث للعناوين)</option>
                    <option value="Readex Pro">Readex Pro (عصري ومريح للقراءة)</option>
                    <option value="Cairo">Cairo (خط القاهرة الكلاسيكي)</option>
                    <option value="Tajawal">Tajawal (تجوال متوازن)</option>
                    <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic (تقني بحت)</option>
                  </select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                    <span className="text-[10px] text-[#A5D6A7]">حجم الخط (px)</span>
                    <input
                      type="number"
                      value={(selectedElement as TextElement).fontSize}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          fontSize: Math.max(12, parseInt(e.target.value) || 12)
                        })
                      }
                      className="w-full bg-transparent font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                    <span className="text-[10px] text-[#A5D6A7]">سُمك الخط</span>
                    <select
                      value={(selectedElement as TextElement).fontWeight}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          fontWeight: e.target.value as any
                        })
                      }
                      className="w-full bg-transparent text-xs focus:outline-none"
                    >
                      <option value="400">400 عادي</option>
                      <option value="500">500 متوسط</option>
                      <option value="700">700 عريض</option>
                      <option value="900">900 أسود بارز</option>
                    </select>
                  </div>
                </div>

                {/* Alignment & Italic */}
                <div className="flex items-center gap-1 p-1 bg-[#14261B] rounded-xl border border-[#2D6A4F]/40">
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, { textAlign: 'right' })
                    }
                    className={`flex-1 py-1 rounded-lg flex items-center justify-center ${
                      (selectedElement as TextElement).textAlign === 'right'
                        ? 'bg-[#2E7D32] text-white'
                        : 'text-[#C8E6C9]'
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, { textAlign: 'center' })
                    }
                    className={`flex-1 py-1 rounded-lg flex items-center justify-center ${
                      (selectedElement as TextElement).textAlign === 'center'
                        ? 'bg-[#2E7D32] text-white'
                        : 'text-[#C8E6C9]'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, { textAlign: 'left' })
                    }
                    className={`flex-1 py-1 rounded-lg flex items-center justify-center ${
                      (selectedElement as TextElement).textAlign === 'left'
                        ? 'bg-[#2E7D32] text-white'
                        : 'text-[#C8E6C9]'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle:
                          (selectedElement as TextElement).fontStyle === 'italic'
                            ? 'normal'
                            : 'italic'
                      })
                    }
                    className={`flex-1 py-1 rounded-lg flex items-center justify-center ${
                      (selectedElement as TextElement).fontStyle === 'italic'
                        ? 'bg-[#2E7D32] text-white'
                        : 'text-[#C8E6C9]'
                    }`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">لون النص</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as TextElement).color}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { color: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <div className="flex-1 flex gap-1 overflow-x-auto py-1">
                      {COLOR_SWATCHES.slice(0, 7).map((swatch) => (
                        <button
                          key={swatch.hex}
                          onClick={() =>
                            onUpdateElement(selectedElement.id, { color: swatch.hex })
                          }
                          className="w-6 h-6 rounded-md border border-white/10 shrink-0"
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background Box for Text */}
                <div className="pt-2 border-t border-[#2D6A4F]/30 space-y-2">
                  <label className="text-[11px] text-[#A5D6A7] block">خلفية النص (شارة/بطاقة)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateElement(selectedElement.id, {
                          backgroundColor:
                            (selectedElement as TextElement).backgroundColor &&
                            (selectedElement as TextElement).backgroundColor !== 'transparent'
                              ? 'transparent'
                              : '#39FF14',
                          backgroundPadding: 16,
                          borderRadius: 16
                        })
                      }
                      className="px-3 py-1 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-xs"
                    >
                      {(selectedElement as TextElement).backgroundColor &&
                      (selectedElement as TextElement).backgroundColor !== 'transparent'
                        ? 'إلغاء خلفية النص'
                        : 'تفعيل خلفية النص'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============ 2. IMAGE PROPERTIES ============ */}
            {selectedElement.type === 'image' && (
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="font-bold text-xs text-[#39FF14] block font-kufam">
                  تنسيق وتأثيرات الصورة
                </label>

                {/* Object Fit */}
                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">نمط الملاءمة (Fit)</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#14261B] rounded-xl border border-[#2D6A4F]/40">
                    {(['cover', 'contain', 'fill'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          onUpdateElement(selectedElement.id, { objectFit: mode })
                        }
                        className={`py-1 text-xs rounded-lg ${
                          (selectedElement as ImageElement).objectFit === mode
                            ? 'bg-[#2E7D32] text-white'
                            : 'text-[#C8E6C9]'
                        }`}
                      >
                        {mode === 'cover' ? 'تغطية' : mode === 'contain' ? 'احتواء' : 'تمدد'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rounded Corners */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#A5D6A7] mb-1">
                    <span>انحناء الزوايا (Radius)</span>
                    <span className="font-mono">{(selectedElement as ImageElement).borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(selectedElement as ImageElement).borderRadius}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        borderRadius: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full accent-[#39FF14] cursor-pointer"
                  />
                </div>

                {/* Border Width & Color */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40">
                    <span className="text-[10px] text-[#A5D6A7]">سُمك الإطار (px)</span>
                    <input
                      type="number"
                      value={(selectedElement as ImageElement).borderWidth || 0}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          borderWidth: parseInt(e.target.value) || 0
                        })
                      }
                      className="w-full bg-transparent font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40 flex items-center justify-between">
                    <span className="text-[10px] text-[#A5D6A7]">لون الإطار</span>
                    <input
                      type="color"
                      value={(selectedElement as ImageElement).borderColor || '#2E7D32'}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { borderColor: e.target.value })
                      }
                      className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============ 3. SHAPE PROPERTIES ============ */}
            {selectedElement.type === 'shape' && (
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="font-bold text-xs text-[#39FF14] block font-kufam">
                  تنسيق الشكل والألوان
                </label>

                {/* Fill Color */}
                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">لون التعبئة (Fill)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as ShapeElement).fillColor}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { fillColor: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <button
                      onClick={() =>
                        onUpdateElement(selectedElement.id, { fillColor: 'transparent' })
                      }
                      className="px-2 py-1 text-[11px] bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 rounded-lg text-[#C8E6C9]"
                    >
                      شفاف
                    </button>
                    <div className="flex-1 flex gap-1 overflow-x-auto py-1">
                      {COLOR_SWATCHES.slice(0, 5).map((s) => (
                        <button
                          key={s.hex}
                          onClick={() =>
                            onUpdateElement(selectedElement.id, { fillColor: s.hex })
                          }
                          className="w-6 h-6 rounded-md border border-white/10 shrink-0"
                          style={{ backgroundColor: s.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stroke Color & Width */}
                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">لون وسُمك الحدود (Stroke)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as ShapeElement).strokeColor}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { strokeColor: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <input
                      type="number"
                      value={(selectedElement as ShapeElement).strokeWidth}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          strokeWidth: Math.max(0, parseInt(e.target.value) || 0)
                        })
                      }
                      className="w-16 bg-[#14261B] p-1.5 rounded-lg border border-[#2D6A4F]/40 font-mono text-xs focus:outline-none text-center"
                    />
                    <span className="text-xs text-[#A5D6A7]">px</span>
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#A5D6A7] mb-1">
                    <span>انحناء الزوايا</span>
                    <span className="font-mono">{(selectedElement as ShapeElement).borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(selectedElement as ShapeElement).borderRadius}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        borderRadius: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full accent-[#39FF14] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ============ 4. CV OVERLAY PROPERTIES ============ */}
            {selectedElement.type === 'cv_overlay' && (
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="font-bold text-xs text-[#39FF14] block font-kufam">
                  بيانات الرؤية الحاسوبية (CV)
                </label>

                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">اسم الهدف المعروض</label>
                  <input
                    type="text"
                    value={(selectedElement as CVOverlayElement).label}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { label: e.target.value })
                    }
                    className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2 text-xs font-mono text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">نسبة الدقة / الثقة</label>
                  <input
                    type="text"
                    value={(selectedElement as CVOverlayElement).confidence}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { confidence: e.target.value })
                    }
                    className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2 text-xs font-mono text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">لون شعاع الكشف</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as CVOverlayElement).color}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { color: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <div className="flex-1 flex gap-1">
                      {['#39FF14', '#00FF66', '#66BB6A', '#2E7D32', '#FFD600', '#FF3D00'].map(
                        (c) => (
                          <button
                            key={c}
                            onClick={() =>
                              onUpdateElement(selectedElement.id, { color: c })
                            }
                            className="w-6 h-6 rounded-md border border-white/10"
                            style={{ backgroundColor: c }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#FAF6F0]">
                    <input
                      type="checkbox"
                      checked={(selectedElement as CVOverlayElement).showCrosshairs ?? true}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          showCrosshairs: e.target.checked
                        })
                      }
                      className="accent-[#39FF14]"
                    />
                    <span>إظهار مؤشر المركز (Reticle)</span>
                  </label>
                </div>
              </div>
            )}

            {/* ============ 5. BOTANICAL PROPERTIES ============ */}
            {selectedElement.type === 'botanical' && (
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="font-bold text-xs text-[#39FF14] block font-kufam">
                  ألوان وتنسيق العنصر النباتي
                </label>

                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">لون الزخرفة النباتية</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as BotanicalElement).color}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { color: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <div className="flex-1 flex gap-1 overflow-x-auto py-1">
                      {COLOR_SWATCHES.slice(0, 6).map((s) => (
                        <button
                          key={s.hex}
                          onClick={() =>
                            onUpdateElement(selectedElement.id, { color: s.hex })
                          }
                          className="w-6 h-6 rounded-md border border-white/10 shrink-0"
                          style={{ backgroundColor: s.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============ 6. STICKER PROPERTIES ============ */}
            {selectedElement.type === 'sticker' && (
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="font-bold text-xs text-[#39FF14] block font-kufam">
                  خصائص الملصق والتنويه
                </label>

                <div>
                  <label className="text-[11px] text-[#A5D6A7] block mb-1">
                    {(selectedElement as StickerElement).stickerType === 'link'
                      ? 'نص رابط المشاهدة'
                      : (selectedElement as StickerElement).stickerType === 'announcement'
                      ? 'عنوان التنويه أو الإشعار'
                      : (selectedElement as StickerElement).stickerType === 'play_button'
                      ? 'اسم زر التشغيل'
                      : 'السؤال أو العنوان'}
                  </label>
                  <input
                    type="text"
                    value={(selectedElement as StickerElement).title}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { title: e.target.value })
                    }
                    className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2 text-xs text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40 flex items-center justify-between">
                    <span className="text-[10px] text-[#A5D6A7]">لون الخلفية</span>
                    <input
                      type="color"
                      value={(selectedElement as StickerElement).backgroundColor || '#FAF6F0'}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { backgroundColor: e.target.value })
                      }
                      className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="bg-[#14261B] p-2 rounded-xl border border-[#2D6A4F]/40 flex items-center justify-between">
                    <span className="text-[10px] text-[#A5D6A7]">لون التمييز/الأيقونة</span>
                    <input
                      type="color"
                      value={(selectedElement as StickerElement).accentColor || '#39FF14'}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { accentColor: e.target.value })
                      }
                      className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                {(selectedElement as StickerElement).stickerType === 'poll' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#A5D6A7] block mb-1">الخيار الأول</label>
                      <input
                        type="text"
                        value={(selectedElement as StickerElement).option1 || ''}
                        onChange={(e) =>
                          onUpdateElement(selectedElement.id, { option1: e.target.value })
                        }
                        className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2 text-xs text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#A5D6A7] block mb-1">الخيار الثاني</label>
                      <input
                        type="text"
                        value={(selectedElement as StickerElement).option2 || ''}
                        onChange={(e) =>
                          onUpdateElement(selectedElement.id, { option2: e.target.value })
                        }
                        className="w-full bg-[#14261B] border border-[#2D6A4F]/60 rounded-xl p-2 text-xs text-[#FAF6F0] focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ================= NO ELEMENT SELECTED (CANVAS OVERVIEW) ================= */
          <div className="space-y-4">
            <div className="p-4 bg-[#14261B] rounded-2xl border border-[#2D6A4F]/40 space-y-2">
              <span className="text-[11px] text-[#39FF14] font-bold font-mono">
                CANVAS INSPECTOR
              </span>
              <h3 className="font-kufam font-bold text-sm text-[#FAF6F0]">
                لوحة الستوري (1080 × 1920)
              </h3>
              <p className="text-[11px] text-[#A5D6A7]/80 leading-relaxed">
                اضغط على أي عنصر داخل لوحة التصميم لتعديل خصائصه أو إضافة نصوص وأشكال من القائمة الجانبية.
              </p>
            </div>

            {/* Quick Canvas Settings */}
            <div className="space-y-3">
              <label className="font-bold text-xs text-[#FAF6F0] block">
                لون خلفية القصة الحالي
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={doc.background.color}
                  onChange={(e) => onChangeBackground({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-xs text-[#FAF6F0]">{doc.background.color}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
