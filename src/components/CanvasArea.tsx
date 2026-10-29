/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  StoryDocument, 
  StoryElement, 
  TextElement, 
  ImageElement, 
  ShapeElement, 
  CVOverlayElement, 
  BotanicalElement, 
  StickerElement, 
  BrandingElement 
} from '../types/editor';
import { BOTANICAL_PATHS } from '../data/assets';
import { 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  RotateCw,
  Scan,
  Sparkles
} from 'lucide-react';

interface CanvasAreaProps {
  document: StoryDocument;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<StoryElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  zoom: number;
  showSafeZones: boolean;
}

type HandleType = 'tl' | 'tr' | 'bl' | 'br' | 'tm' | 'bm' | 'ml' | 'mr' | 'rotate';

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  document: doc,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  zoom,
  showSafeZones
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging and Resizing State
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<HandleType | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState<{ x: number; y: number; width: number; height: number; rotation: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0
  });

  // Snapping Guides
  const [showSnapX, setShowSnapX] = useState(false);
  const [showSnapY, setShowSnapY] = useState(false);

  // Selected element helper
  const selectedElement = doc.elements.find((el) => el.id === selectedElementId);

  // Handle Canvas Background Click (Deselect)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-background-layer')) {
      onSelectElement(null);
    }
  };

  // Start dragging element
  const handleElementMouseDown = (e: React.MouseEvent, element: StoryElement) => {
    e.stopPropagation();
    if (element.locked) {
      onSelectElement(element.id);
      return;
    }

    onSelectElement(element.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation
    });
  };

  // Start resize or rotation handle
  const handleHandleMouseDown = (e: React.MouseEvent, handle: HandleType) => {
    e.stopPropagation();
    if (!selectedElement || selectedElement.locked) return;

    setActiveHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: selectedElement.x,
      y: selectedElement.y,
      width: selectedElement.width,
      height: selectedElement.height,
      rotation: selectedElement.rotation
    });
  };

  // Global mouse move for drag & resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedElement) return;

      const scale = zoom; // ratio between screen pixels and canvas units

      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) / scale;
        const deltaY = (e.clientY - dragStart.y) / scale;

        let newX = Math.round(elementStart.x + deltaX);
        let newY = Math.round(elementStart.y + deltaY);

        // Snap to center X (canvas width = 1080)
        const centerX = newX + selectedElement.width / 2;
        if (Math.abs(centerX - 540) < 15) {
          newX = 540 - selectedElement.width / 2;
          setShowSnapX(true);
        } else {
          setShowSnapX(false);
        }

        // Snap to center Y (canvas height = 1920)
        const centerY = newY + selectedElement.height / 2;
        if (Math.abs(centerY - 960) < 15) {
          newY = 960 - selectedElement.height / 2;
          setShowSnapY(true);
        } else {
          setShowSnapY(false);
        }

        onUpdateElement(selectedElement.id, { x: newX, y: newY });
      } else if (activeHandle) {
        if (activeHandle === 'rotate') {
          // Calculate angle relative to center of element in screen space
          if (!canvasRef.current) return;
          const canvasRect = canvasRef.current.getBoundingClientRect();
          const elemScreenCenterX = canvasRect.left + (elementStart.x + elementStart.width / 2) * scale;
          const elemScreenCenterY = canvasRect.top + (elementStart.y + elementStart.height / 2) * scale;

          const rad = Math.atan2(e.clientY - elemScreenCenterY, e.clientX - elemScreenCenterX);
          let deg = Math.round((rad * 180) / Math.PI + 90);
          if (deg < 0) deg += 360;
          if (deg >= 360) deg -= 360;

          // Snap to 0, 90, 180, 270 if close
          if (Math.abs(deg) < 5 || Math.abs(deg - 360) < 5) deg = 0;
          if (Math.abs(deg - 90) < 5) deg = 90;
          if (Math.abs(deg - 180) < 5) deg = 180;
          if (Math.abs(deg - 270) < 5) deg = 270;

          onUpdateElement(selectedElement.id, { rotation: deg });
        } else {
          // Resizing
          const deltaX = (e.clientX - dragStart.x) / scale;
          const deltaY = (e.clientY - dragStart.y) / scale;

          let newWidth = elementStart.width;
          let newHeight = elementStart.height;
          let newX = elementStart.x;
          let newY = elementStart.y;

          if (activeHandle === 'br') {
            newWidth = Math.max(40, elementStart.width + deltaX);
            newHeight = Math.max(20, elementStart.height + deltaY);
          } else if (activeHandle === 'bl') {
            newWidth = Math.max(40, elementStart.width - deltaX);
            newHeight = Math.max(20, elementStart.height + deltaY);
            newX = elementStart.x + deltaX;
          } else if (activeHandle === 'tr') {
            newWidth = Math.max(40, elementStart.width + deltaX);
            newHeight = Math.max(20, elementStart.height - deltaY);
            newY = elementStart.y + deltaY;
          } else if (activeHandle === 'tl') {
            newWidth = Math.max(40, elementStart.width - deltaX);
            newHeight = Math.max(20, elementStart.height - deltaY);
            newX = elementStart.x + deltaX;
            newY = elementStart.y + deltaY;
          } else if (activeHandle === 'mr') {
            newWidth = Math.max(40, elementStart.width + deltaX);
          } else if (activeHandle === 'ml') {
            newWidth = Math.max(40, elementStart.width - deltaX);
            newX = elementStart.x + deltaX;
          } else if (activeHandle === 'bm') {
            newHeight = Math.max(20, elementStart.height + deltaY);
          } else if (activeHandle === 'tm') {
            newHeight = Math.max(20, elementStart.height - deltaY);
            newY = elementStart.y + deltaY;
          }

          onUpdateElement(selectedElement.id, {
            width: Math.round(newWidth),
            height: Math.round(newHeight),
            x: Math.round(newX),
            y: Math.round(newY)
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveHandle(null);
      setShowSnapX(false);
      setShowSnapY(false);
    };

    if (isDragging || activeHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeHandle, dragStart, elementStart, selectedElement, zoom, onUpdateElement]);

  // Keyboard navigation / shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElement) return;

      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteElement(selectedElement.id);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        onDuplicateElement(selectedElement.id);
      } else if (e.key === 'Escape') {
        onSelectElement(null);
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        onUpdateElement(selectedElement.id, {
          x: selectedElement.x + dx,
          y: selectedElement.y + dy
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, onDeleteElement, onDuplicateElement, onSelectElement, onUpdateElement]);

  // Background styling
  const bg = doc.background;
  let bgStyle: React.CSSProperties = {
    backgroundColor: bg.color
  };

  if (bg.type === 'gradient') {
    bgStyle = {
      background: `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientStops
        .map((s) => `${s.color} ${s.offset * 100}%`)
        .join(', ')})`
    };
  }

  return (
    <main
      ref={containerRef}
      onClick={handleCanvasClick}
      className="flex-1 bg-[#070D09] overflow-auto flex items-center justify-center p-4 lg:p-8 relative selection:bg-none"
    >
      {/* Centered Canvas Container with scale transform */}
      <div
        style={{
          width: 1080 * zoom,
          height: 1920 * zoom,
          minWidth: 1080 * zoom,
          minHeight: 1920 * zoom
        }}
        className="relative transition-all duration-75 flex items-center justify-center"
      >
        {/* Real 1080x1920 Story Frame */}
        <div
          ref={canvasRef}
          id="lamma7-live-story-canvas"
          style={{
            width: 1080,
            height: 1920,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            ...bgStyle
          }}
          className="absolute top-0 left-0 rounded-[48px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border-4 border-[#1B2E21] select-none"
        >
          {/* Background Image Layer if selected */}
          {bg.type === 'image' && bg.imageSrc && (
            <div className="absolute inset-0 pointer-events-none canvas-background-layer">
              <img
                src={bg.imageSrc}
                alt="Story Background"
                className="w-full h-full object-cover scale-105"
              />
            </div>
          )}

          {/* Texture Mesh Overlay */}
          {bg.texture === 'grid' && (
            <div className="absolute inset-0 tech-grid pointer-events-none opacity-50 canvas-background-layer" />
          )}
          {bg.texture === 'dots' && (
            <div className="absolute inset-0 tech-dots pointer-events-none opacity-50 canvas-background-layer" />
          )}

          {/* Scrim Overlay */}
          {bg.overlayOpacity > 0 && (
            <div
              style={{
                backgroundColor: bg.overlayColor,
                opacity: bg.overlayOpacity
              }}
              className="absolute inset-0 pointer-events-none canvas-background-layer"
            />
          )}

          {/* Center Snapping Guide Lines */}
          {showSnapX && (
            <div className="absolute top-0 bottom-0 left-[540px] w-[2px] bg-[#39FF14] z-50 pointer-events-none shadow-[0_0_8px_#39FF14]" />
          )}
          {showSnapY && (
            <div className="absolute left-0 right-0 top-[960px] h-[2px] bg-[#39FF14] z-50 pointer-events-none shadow-[0_0_8px_#39FF14]" />
          )}

          {/* Safe Zones (Toggled by user) */}
          {showSafeZones && (
            <div className="absolute inset-0 z-40 pointer-events-none border-y-[190px] border-red-500/20 flex flex-col justify-between p-6">
              <div className="bg-red-950/85 text-red-300 border border-red-500/40 text-xs px-3 py-1.5 rounded-lg w-fit font-mono font-bold">
                منطقة غير آمنة (شريط إنستغرام العلوي) — Safe Zone IG
              </div>
              <div className="bg-red-950/85 text-red-300 border border-red-500/40 text-xs px-3 py-1.5 rounded-lg w-fit self-end font-mono font-bold">
                منطقة غير آمنة (شريط الرد السفلي) — Safe Zone Reply
              </div>
            </div>
          )}

          {/* Render Elements in Layer Order */}
          {[...doc.elements]
            .filter((el) => !el.hidden)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => {
              const isSelected = element.id === selectedElementId;

              return (
                <div
                  key={element.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectElement(element.id);
                  }}
                  onMouseDown={(e) => handleElementMouseDown(e, element)}
                  style={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: `rotate(${element.rotation}deg)`,
                    opacity: element.opacity,
                    zIndex: element.zIndex,
                    cursor: element.locked ? 'default' : isDragging && isSelected ? 'grabbing' : 'grab'
                  }}
                  className={`group transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-[#39FF14] ring-offset-2 ring-offset-transparent'
                      : 'hover:ring-1 hover:ring-[#39FF14]/50'
                  }`}
                >
                  {/* Actual Element Content */}
                  <div className="w-full h-full relative overflow-hidden pointer-events-none">
                    {renderElementPreview(element)}
                  </div>

                  {/* On-Canvas Selection Chrome (Handles & Quick Toolbar) */}
                  {isSelected && !element.locked && (
                    <>
                      {/* 8 Resize Handles */}
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'tl')}
                        className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-[#39FF14] rounded-full cursor-nwse-resize pointer-events-auto shadow hover:scale-125 transition"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'tr')}
                        className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#39FF14] rounded-full cursor-nesw-resize pointer-events-auto shadow hover:scale-125 transition"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'bl')}
                        className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-[#39FF14] rounded-full cursor-nesw-resize pointer-events-auto shadow hover:scale-125 transition"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'br')}
                        className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#39FF14] rounded-full cursor-nwse-resize pointer-events-auto shadow hover:scale-125 transition"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'tm')}
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-white border border-[#39FF14] rounded cursor-ns-resize pointer-events-auto shadow"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'bm')}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-white border border-[#39FF14] rounded cursor-ns-resize pointer-events-auto shadow"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'ml')}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-4 bg-white border border-[#39FF14] rounded cursor-ew-resize pointer-events-auto shadow"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'mr')}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-4 bg-white border border-[#39FF14] rounded cursor-ew-resize pointer-events-auto shadow"
                      />

                      {/* Top Rotation Handle */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                        <div
                          onMouseDown={(e) => handleHandleMouseDown(e, 'rotate')}
                          title="تدوير العنصر"
                          className="w-7 h-7 bg-[#0E1A12] border border-[#39FF14] text-[#39FF14] rounded-full flex items-center justify-center cursor-grab hover:bg-[#39FF14] hover:text-[#0E1A12] shadow-lg transition"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </div>
                        <div className="w-[1.5px] h-3 bg-[#39FF14]"></div>
                      </div>

                      {/* Quick Floating Action Bar Above Element */}
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute -top-16 right-0 bg-[#0E1A12]/95 border border-[#2D6A4F] backdrop-blur px-2 py-1 rounded-xl flex items-center gap-1 text-xs text-[#FAF6F0] shadow-2xl pointer-events-auto z-50"
                      >
                        <button
                          onClick={() => onBringForward(element.id)}
                          title="تقديم طبقة للأمام"
                          className="p-1.5 hover:bg-[#2D6A4F] rounded-lg transition"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSendBackward(element.id)}
                          title="تأخير طبقة للخلف"
                          className="p-1.5 hover:bg-[#2D6A4F] rounded-lg transition"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateElement(element.id)}
                          title="مضاعفة العنصر (Ctrl+D)"
                          className="p-1.5 hover:bg-[#2D6A4F] rounded-lg transition text-[#66BB6A]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            onUpdateElement(element.id, { locked: !element.locked })
                          }
                          title={element.locked ? 'فك القفل' : 'قفل العنصر'}
                          className="p-1.5 hover:bg-[#2D6A4F] rounded-lg transition text-yellow-400"
                        >
                          {element.locked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onDeleteElement(element.id)}
                          title="حذف (Delete)"
                          className="p-1.5 hover:bg-red-950 text-red-400 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
};

/**
 * Preview renderer for story elements inside the live editor
 */
function renderElementPreview(el: StoryElement) {
  switch (el.type) {
    case 'text': {
      const textEl = el as TextElement;
      const fontFamily =
        textEl.fontFamily === 'Kufam'
          ? "'Kufam', sans-serif"
          : textEl.fontFamily === 'Cairo'
          ? "'Cairo', sans-serif"
          : textEl.fontFamily === 'Tajawal'
          ? "'Tajawal', sans-serif"
          : textEl.fontFamily === 'IBM Plex Sans Arabic'
          ? "'IBM Plex Sans Arabic', sans-serif"
          : "'Readex Pro', sans-serif";

      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            color: textEl.color,
            fontSize: `${textEl.fontSize}px`,
            fontFamily,
            fontWeight: textEl.fontWeight,
            fontStyle: textEl.fontStyle,
            textAlign: textEl.textAlign,
            lineHeight: textEl.lineHeight,
            letterSpacing: `${textEl.letterSpacing}px`,
            direction: textEl.textDirection,
            backgroundColor: textEl.backgroundColor || 'transparent',
            padding: textEl.backgroundPadding ? `${textEl.backgroundPadding}px` : '0px',
            borderRadius: textEl.borderRadius ? `${textEl.borderRadius}px` : '0px',
            textShadow: textEl.shadowColor
              ? `${textEl.shadowOffsetX || 0}px ${textEl.shadowOffsetY || 0}px ${
                  textEl.shadowBlur || 0
                }px ${textEl.shadowColor}`
              : 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
          className="flex flex-col justify-start select-none"
        >
          {textEl.content}
        </div>
      );
    }

    case 'image': {
      const imgEl = el as ImageElement;
      const filterStr = [
        imgEl.filterBrightness ? `brightness(${imgEl.filterBrightness}%)` : '',
        imgEl.filterContrast ? `contrast(${imgEl.filterContrast}%)` : '',
        imgEl.filterGrayscale ? `grayscale(${imgEl.filterGrayscale}%)` : '',
        imgEl.filterBlur ? `blur(${imgEl.filterBlur}px)` : ''
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <div
          style={{
            borderRadius: `${imgEl.borderRadius}px`,
            border: imgEl.borderWidth ? `${imgEl.borderWidth}px solid ${imgEl.borderColor}` : 'none'
          }}
          className="w-full h-full overflow-hidden"
        >
          <img
            src={imgEl.src}
            alt="Layer"
            style={{
              filter: filterStr || 'none',
              objectFit: imgEl.objectFit
            }}
            className="w-full h-full"
          />
        </div>
      );
    }

    case 'shape': {
      const shapeEl = el as ShapeElement;
      if (shapeEl.shapeType === 'circle') {
        return (
          <div
            style={{
              backgroundColor: shapeEl.fillColor,
              borderColor: shapeEl.strokeColor,
              borderWidth: `${shapeEl.strokeWidth}px`
            }}
            className="w-full h-full rounded-full"
          />
        );
      } else if (shapeEl.shapeType === 'line') {
        return (
          <div className="w-full h-full flex items-center">
            <div
              style={{
                backgroundColor: shapeEl.fillColor || shapeEl.strokeColor,
                height: `${shapeEl.strokeWidth || 3}px`
              }}
              className="w-full rounded"
            />
          </div>
        );
      } else if (shapeEl.shapeType === 'hud_panel') {
        return (
          <div
            style={{
              backgroundColor: shapeEl.fillColor,
              borderColor: shapeEl.strokeColor,
              borderWidth: `${shapeEl.strokeWidth}px`,
              borderRadius: `${shapeEl.borderRadius || 24}px`
            }}
            className="w-full h-full relative overflow-hidden backdrop-blur-md"
          >
            {/* Top gradient glow line */}
            <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-l from-[#39FF14] via-[#2D6A4F] to-transparent" />
          </div>
        );
      } else {
        return (
          <div
            style={{
              backgroundColor: shapeEl.fillColor,
              borderColor: shapeEl.strokeColor,
              borderWidth: `${shapeEl.strokeWidth}px`,
              borderRadius:
                shapeEl.shapeType === 'pill'
                  ? `${shapeEl.height / 2}px`
                  : `${shapeEl.borderRadius}px`
            }}
            className="w-full h-full"
          />
        );
      }
    }

    case 'cv_overlay': {
      const cvEl = el as CVOverlayElement;
      const col = cvEl.color || '#39FF14';

      if (cvEl.style === 'scanline') {
        return (
          <div
            style={{
              background: `linear-gradient(to right, transparent, ${col}, transparent)`
            }}
            className="w-full h-full shadow-[0_0_15px_#39FF14] animate-scan"
          />
        );
      }

      if (cvEl.style === 'bounding_box') {
        return (
          <div
            style={{ borderColor: col }}
            className="w-full h-full border-2 rounded-lg relative backdrop-blur-[2px]"
          >
            {/* Corner Crosshairs */}
            <div
              style={{ borderColor: col }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4"
            />
            <div
              style={{ borderColor: col }}
              className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4"
            />
            <div
              style={{ borderColor: col }}
              className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4"
            />
            <div
              style={{ borderColor: col }}
              className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4"
            />

            {/* Target Label Tag */}
            {cvEl.label && (
              <div
                style={{ borderColor: col, color: col }}
                className="absolute -top-9 right-0 bg-[#0E1A12]/95 border px-3 py-1 rounded-t text-sm font-mono flex items-center gap-2 shadow-lg"
              >
                <span
                  style={{ backgroundColor: col }}
                  className="w-2 h-2 rounded-full animate-ping"
                />
                <span>{cvEl.label}</span>
              </div>
            )}

            {/* Reticle in center */}
            {cvEl.showCrosshairs && (
              <div className="absolute inset-0 flex items-center justify-center opacity-70 animate-reticle">
                <div
                  style={{ borderColor: col }}
                  className="w-12 h-12 border-2 border-dashed rounded-full"
                />
              </div>
            )}

            {/* Bottom Confidence text */}
            {cvEl.showConfidence && cvEl.confidence && (
              <div className="absolute -bottom-7 left-0 right-0 flex justify-between text-xs font-mono text-[#E9E3D8] px-1">
                <span>CONFIDENCE: {cvEl.confidence}</span>
                <span>CAM_01_FPS: 60</span>
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          style={{ borderColor: col }}
          className="w-full h-full border-2 rounded-full flex items-center justify-center"
        >
          <div style={{ backgroundColor: col }} className="w-full h-[2px]" />
          <div style={{ backgroundColor: col }} className="h-full w-[2px] absolute" />
        </div>
      );
    }

    case 'botanical': {
      const botEl = el as BotanicalElement;
      const asset = BOTANICAL_PATHS[botEl.botanicalType] || BOTANICAL_PATHS.leaf_single;
      return (
        <svg viewBox={asset.viewBox} className="w-full h-full" fill={botEl.color}>
          <path d={asset.path} />
        </svg>
      );
    }

    case 'sticker': {
      const stEl = el as StickerElement;

      if (stEl.stickerType === 'play_button') {
        return (
          <div
            style={{
              backgroundColor: stEl.backgroundColor,
              borderColor: stEl.accentColor,
              borderWidth: '4px'
            }}
            className="w-full h-full rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm cursor-pointer group"
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '24px solid transparent',
                borderBottom: '24px solid transparent',
                borderLeft: `38px solid ${stEl.accentColor}`,
                marginLeft: '8px'
              }}
              className="drop-shadow-[0_0_10px_#39FF14]"
            />
          </div>
        );
      }

      if (stEl.stickerType === 'link') {
        return (
          <div
            style={{
              backgroundColor: stEl.backgroundColor,
              borderRadius: `${stEl.borderRadius || stEl.height / 2}px`,
              color: stEl.textColor
            }}
            className="w-full h-full px-6 flex items-center justify-center gap-3 shadow-xl border border-black/10 font-readex font-bold text-xl select-none"
          >
            <span className="text-2xl">🔗</span>
            <span>{stEl.title}</span>
          </div>
        );
      }

      if (stEl.stickerType === 'announcement') {
        return (
          <div
            style={{
              backgroundColor: stEl.backgroundColor,
              borderRadius: `${stEl.borderRadius}px`,
              color: stEl.textColor,
              borderColor: stEl.accentColor,
              borderWidth: '3px'
            }}
            className="w-full h-full px-6 flex items-center justify-center gap-3 shadow-2xl font-kufam font-black text-2xl select-none"
          >
            <span>{stEl.title}</span>
          </div>
        );
      }

      if (stEl.stickerType === 'poll') {
        return (
          <div
            style={{
              backgroundColor: stEl.backgroundColor,
              borderRadius: `${stEl.borderRadius}px`,
              color: stEl.textColor
            }}
            className="w-full h-full p-6 flex flex-col justify-between shadow-2xl border border-black/10 text-center"
          >
            <div className="font-kufam font-black text-2xl leading-snug">{stEl.title}</div>
            <div className="grid grid-cols-2 gap-4">
              <div
                style={{ backgroundColor: stEl.accentColor }}
                className="text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center shadow"
              >
                {stEl.option1}
              </div>
              <div className="bg-black/5 text-[#0E1A12] font-bold py-4 rounded-2xl text-lg flex items-center justify-center border border-black/10">
                {stEl.option2}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          style={{
            backgroundColor: stEl.backgroundColor,
            borderRadius: `${stEl.borderRadius}px`,
            color: stEl.textColor
          }}
          className="w-full h-full p-6 flex flex-col justify-between shadow-2xl border border-black/10 text-center"
        >
          <div>
            <div className="text-sm font-bold opacity-60 mb-1">اسأل فريق لَمّاح | LAMMA7</div>
            <div className="font-kufam font-bold text-2xl leading-snug">{stEl.title}</div>
          </div>
          <div className="bg-white/90 border border-[#D7CCC8] rounded-2xl py-3 px-4 text-base text-gray-400 text-right">
            اكتب سؤالك هنا...
          </div>
        </div>
      );
    }

    case 'branding': {
      const brEl = el as BrandingElement;
      if (brEl.brandType === 'ig_header') {
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* IG Progress Bars */}
            <div className="flex gap-2 w-full">
              <div className="h-1.5 flex-1 bg-white/90 rounded-full" />
              <div className="h-1.5 flex-1 bg-white/30 rounded-full" />
              <div className="h-1.5 flex-1 bg-white/30 rounded-full" />
            </div>
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{ borderColor: brEl.color }}
                  className="w-12 h-12 rounded-full border-2 p-[2px] bg-gradient-to-tr from-[#39FF14] to-[#2D6A4F]"
                >
                  <div className="w-full h-full bg-[#0E1A12] rounded-full flex items-center justify-center font-kufam font-black text-[#39FF14] text-lg">
                    ل
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white font-readex">
                      {brEl.label}
                    </span>
                    <span className="text-[#39FF14] text-xs">✓</span>
                  </div>
                  <span className="text-xs text-[#A5D6A7]/80">{brEl.sublabel}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full h-full flex items-center gap-4 text-right">
          <div
            style={{ borderColor: brEl.color }}
            className="w-16 h-16 rounded-2xl bg-[#0E1A12] border-2 flex items-center justify-center font-kufam font-black text-[#39FF14] text-3xl shadow-lg shrink-0"
          >
            ل
          </div>
          {brEl.brandType === 'logo_full' && (
            <div>
              <div
                style={{ color: brEl.textColor }}
                className="font-kufam font-black text-2xl leading-none mb-1"
              >
                {brEl.label}
              </div>
              <div className="text-xs text-[#A5D6A7]/70 font-readex">{brEl.sublabel}</div>
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
