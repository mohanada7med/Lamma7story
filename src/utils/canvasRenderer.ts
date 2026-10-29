/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoryDocument, StoryElement, TextElement, ImageElement, ShapeElement, CVOverlayElement, BotanicalElement, StickerElement, BrandingElement } from '../types/editor';
import { BOTANICAL_PATHS } from '../data/assets';

// Image cache to avoid re-fetching when rendering multiple times
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      // If CORS failed or image failed, resolve a 1x1 fallback to avoid crashing export
      console.warn('Failed to load image for canvas render:', src);
      resolve(img);
    };
    img.src = src;
  });
}

/**
 * Helper to split text into lines that fit within a maxWidth
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Render complete StoryDocument to an HTMLCanvasElement
 */
export async function renderStoryToCanvas(
  doc: StoryDocument,
  targetWidth = 1080,
  targetHeight = 1920
): Promise<HTMLCanvasElement> {
  // Ensure custom web fonts are fully loaded
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness timeout
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  const scale = targetWidth / 1080;
  ctx.save();
  ctx.scale(scale, scale);

  // 1. Render Background
  const bg = doc.background;
  if (bg.type === 'color') {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, 1080, 1920);
  } else if (bg.type === 'gradient') {
    const angleRad = (bg.gradientAngle * Math.PI) / 180;
    const x1 = 540 - Math.sin(angleRad) * 540;
    const y1 = 960 - Math.cos(angleRad) * 960;
    const x2 = 540 + Math.sin(angleRad) * 540;
    const y2 = 960 + Math.cos(angleRad) * 960;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    for (const stop of bg.gradientStops) {
      grad.addColorStop(Math.min(1, Math.max(0, stop.offset)), stop.color);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);
  } else if (bg.type === 'image' && bg.imageSrc) {
    try {
      const img = await loadImage(bg.imageSrc);
      if (img.naturalWidth > 0) {
        // Draw image cover
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = 1080 / 1920;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (imgRatio > canvasRatio) {
          sw = img.naturalHeight * canvasRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / canvasRatio;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1080, 1920);
      } else {
        ctx.fillStyle = bg.color || '#0E1A12';
        ctx.fillRect(0, 0, 1080, 1920);
      }
    } catch {
      ctx.fillStyle = bg.color || '#0E1A12';
      ctx.fillRect(0, 0, 1080, 1920);
    }
  }

  // Texture Overlay
  if (bg.texture === 'grid') {
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x <= 1080; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1920);
      ctx.stroke();
    }
    for (let y = 0; y <= 1920; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }
  } else if (bg.texture === 'dots') {
    ctx.fillStyle = 'rgba(82, 183, 136, 0.15)';
    const step = 32;
    for (let x = 16; x < 1080; x += step) {
      for (let y = 16; y < 1920; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Color Overlay Scrim
  if (bg.overlayOpacity > 0) {
    ctx.fillStyle = bg.overlayColor || '#000000';
    ctx.globalAlpha = bg.overlayOpacity;
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.globalAlpha = 1;
  }

  // 2. Render Elements sorted by zIndex
  const sortedElements = [...doc.elements]
    .filter((el) => !el.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  for (const element of sortedElements) {
    ctx.save();

    // Element transformation: translation, rotation, opacity
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;

    ctx.translate(centerX, centerY);
    if (element.rotation) {
      ctx.rotate((element.rotation * Math.PI) / 180);
    }
    ctx.globalAlpha = element.opacity;
    ctx.translate(-element.width / 2, -element.height / 2);

    // Render by type
    switch (element.type) {
      case 'text':
        await renderTextElement(ctx, element);
        break;
      case 'image':
        await renderImageElement(ctx, element);
        break;
      case 'shape':
        renderShapeElement(ctx, element);
        break;
      case 'cv_overlay':
        renderCVOverlayElement(ctx, element);
        break;
      case 'botanical':
        renderBotanicalElement(ctx, element);
        break;
      case 'sticker':
        renderStickerElement(ctx, element);
        break;
      case 'branding':
        renderBrandingElement(ctx, element);
        break;
    }

    ctx.restore();
  }

  ctx.restore();
  return canvas;
}

/**
 * Text Element Rendering
 */
async function renderTextElement(ctx: CanvasRenderingContext2D, el: TextElement) {
  ctx.save();

  // Background box if present
  if (el.backgroundColor && el.backgroundColor !== 'transparent') {
    const pad = el.backgroundPadding || 0;
    ctx.fillStyle = el.backgroundColor;
    if (el.borderRadius && el.borderRadius > 0 && typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(-pad, -pad, el.width + pad * 2, el.height + pad * 2, el.borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(-pad, -pad, el.width + pad * 2, el.height + pad * 2);
    }
  }

  // Setup font
  const style = el.fontStyle === 'italic' ? 'italic' : 'normal';
  const weight = el.fontWeight || 'normal';
  const family = el.fontFamily || 'Readex Pro';
  ctx.font = `${style} ${weight} ${el.fontSize}px "${family}", sans-serif`;
  ctx.direction = el.textDirection || 'rtl';
  ctx.textBaseline = 'top';

  if (el.shadowColor && el.shadowBlur) {
    ctx.shadowColor = el.shadowColor;
    ctx.shadowBlur = el.shadowBlur;
    ctx.shadowOffsetX = el.shadowOffsetX || 0;
    ctx.shadowOffsetY = el.shadowOffsetY || 0;
  }

  // Wrap text
  const lines = wrapText(ctx, el.content, el.width);
  const lineHeight = el.fontSize * (el.lineHeight || 1.4);

  let drawX = 0;
  if (el.textAlign === 'center') {
    ctx.textAlign = 'center';
    drawX = el.width / 2;
  } else if (el.textAlign === 'left') {
    ctx.textAlign = 'left';
    drawX = 0;
  } else {
    // Default right for RTL
    ctx.textAlign = 'right';
    drawX = el.width;
  }

  lines.forEach((line, index) => {
    const yPos = index * lineHeight;

    if (el.strokeColor && el.strokeWidth) {
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = el.strokeWidth;
      ctx.strokeText(line, drawX, yPos);
    }

    ctx.fillStyle = el.color;
    ctx.fillText(line, drawX, yPos);
  });

  ctx.restore();
}

/**
 * Image Element Rendering
 */
async function renderImageElement(ctx: CanvasRenderingContext2D, el: ImageElement) {
  if (!el.src) return;
  try {
    const img = await loadImage(el.src);
    if (!img.naturalWidth) return;

    ctx.save();

    // Clip rounded corners
    if (el.borderRadius && el.borderRadius > 0 && typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(0, 0, el.width, el.height, el.borderRadius);
      ctx.clip();
    }

    // Apply filters if defined
    const filters: string[] = [];
    if (el.filterBrightness && el.filterBrightness !== 100) {
      filters.push(`brightness(${el.filterBrightness}%)`);
    }
    if (el.filterContrast && el.filterContrast !== 100) {
      filters.push(`contrast(${el.filterContrast}%)`);
    }
    if (el.filterGrayscale) {
      filters.push(`grayscale(${el.filterGrayscale}%)`);
    }
    if (el.filterBlur) {
      filters.push(`blur(${el.filterBlur}px)`);
    }
    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }

    // Draw object fit cover / contain / fill
    if (el.objectFit === 'cover') {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = el.width / el.height;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgRatio > targetRatio) {
        sw = img.naturalHeight * targetRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / targetRatio;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, el.width, el.height);
    } else {
      ctx.drawImage(img, 0, 0, el.width, el.height);
    }

    ctx.restore();

    // Border
    if (el.borderWidth && el.borderColor) {
      ctx.save();
      ctx.strokeStyle = el.borderColor;
      ctx.lineWidth = el.borderWidth;
      if (el.borderRadius && typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(0, 0, el.width, el.height, el.borderRadius);
        ctx.stroke();
      } else {
        ctx.strokeRect(0, 0, el.width, el.height);
      }
      ctx.restore();
    }
  } catch (err) {
    console.warn('Failed to render image on canvas:', err);
  }
}

/**
 * Shape Element Rendering
 */
function renderShapeElement(ctx: CanvasRenderingContext2D, el: ShapeElement) {
  ctx.save();

  if (el.strokeDasharray) {
    const dashes = el.strokeDasharray.split(',').map((n) => parseFloat(n.trim()));
    ctx.setLineDash(dashes);
  }

  ctx.fillStyle = el.fillColor;
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;

  const w = el.width;
  const h = el.height;

  if (el.shapeType === 'circle') {
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    if (el.fillColor !== 'transparent') ctx.fill();
    if (el.strokeWidth > 0 && el.strokeColor !== 'transparent') ctx.stroke();
  } else if (el.shapeType === 'line') {
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  } else if (el.shapeType === 'hud_panel') {
    // Glassmorphism HUD Card with top gradient accent line
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, el.borderRadius || 24);
      if (el.fillColor !== 'transparent') ctx.fill();
      if (el.strokeWidth > 0) ctx.stroke();

      // Top glowing accent line
      const topGrad = ctx.createLinearGradient(0, 0, w, 0);
      topGrad.addColorStop(0, 'rgba(57, 255, 20, 0.9)');
      topGrad.addColorStop(0.6, 'rgba(45, 106, 79, 0.4)');
      topGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = topGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(w - 20, 0);
      ctx.stroke();
    } else {
      ctx.fillRect(0, 0, w, h);
    }
  } else {
    // Rect / pill / card / badge
    const rad = el.shapeType === 'pill' ? h / 2 : el.borderRadius;
    if (rad > 0 && typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, rad);
      if (el.fillColor !== 'transparent') ctx.fill();
      if (el.strokeWidth > 0 && el.strokeColor !== 'transparent') ctx.stroke();
    } else {
      if (el.fillColor !== 'transparent') ctx.fillRect(0, 0, w, h);
      if (el.strokeWidth > 0 && el.strokeColor !== 'transparent') ctx.strokeRect(0, 0, w, h);
    }
  }

  ctx.restore();
}

/**
 * Computer Vision Overlay Rendering
 */
function renderCVOverlayElement(ctx: CanvasRenderingContext2D, el: CVOverlayElement) {
  ctx.save();
  const w = el.width;
  const h = el.height;
  const col = el.color || '#39FF14';

  if (el.style === 'scanline') {
    // High-tech laser scanline
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, col);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (el.style === 'bounding_box') {
    // Target Bounding Box
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, w, h);

    // Corner crosshairs
    const cornerSize = 20;
    ctx.lineWidth = 4;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(w - cornerSize, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, cornerSize);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(0, h - cornerSize);
    ctx.lineTo(0, h);
    ctx.lineTo(cornerSize, h);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(w - cornerSize, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, h - cornerSize);
    ctx.stroke();

    // Center reticle
    if (el.showCrosshairs) {
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w / 2 - 32, h / 2);
      ctx.lineTo(w / 2 + 32, h / 2);
      ctx.moveTo(w / 2, h / 2 - 32);
      ctx.lineTo(w / 2, h / 2 + 32);
      ctx.stroke();
    }

    // Top Target Label Tag
    if (el.label) {
      ctx.font = 'bold 20px monospace';
      const labelMetrics = ctx.measureText(el.label);
      const tagW = labelMetrics.width + 36;
      const tagH = 36;

      ctx.fillStyle = 'rgba(14, 26, 18, 0.9)';
      ctx.fillRect(0, -tagH, tagW, tagH);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, -tagH, tagW, tagH);

      // Green indicator dot
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(14, -tagH / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = col;
      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.label, 26, -tagH / 2);
    }

    // Bottom Confidence Bar
    if (el.showConfidence && el.confidence) {
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = 'rgba(233, 227, 216, 0.9)';
      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`CONFIDENCE: ${el.confidence}`, 4, h + 8);
    }
  } else if (el.style === 'reticle') {
    // Reticle Center Mark
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w / 2 - w / 2, h / 2);
    ctx.lineTo(w / 2 + w / 2, h / 2);
    ctx.moveTo(w / 2, h / 2 - h / 2);
    ctx.lineTo(w / 2, h / 2 + h / 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Botanical Element SVG Path Rendering
 */
function renderBotanicalElement(ctx: CanvasRenderingContext2D, el: BotanicalElement) {
  const asset = BOTANICAL_PATHS[el.botanicalType] || BOTANICAL_PATHS.leaf_single;
  if (!asset) return;

  ctx.save();
  // Scale to element width and height from 100x100 viewBox
  const scaleX = el.width / 100;
  const scaleY = el.height / 100;
  ctx.scale(scaleX, scaleY);

  const path = new Path2D(asset.path);
  ctx.fillStyle = el.color;
  ctx.fill(path);

  ctx.strokeStyle = el.secondaryColor || el.color;
  ctx.lineWidth = el.strokeWidth || 2;
  ctx.stroke(path);

  ctx.restore();
}

/**
 * Sticker Element Rendering (Poll, Question, Slider)
 */
function renderStickerElement(ctx: CanvasRenderingContext2D, el: StickerElement) {
  ctx.save();
  const w = el.width;
  const h = el.height;

  // Specialized Video & Announcement Stickers
  if (el.stickerType === 'play_button') {
    // Glowing circular play button overlay
    ctx.fillStyle = el.backgroundColor || 'rgba(14, 26, 18, 0.85)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = el.accentColor || '#39FF14';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Triangle Play symbol
    ctx.fillStyle = el.accentColor || '#39FF14';
    const triSize = Math.min(w, h) * 0.32;
    ctx.beginPath();
    ctx.moveTo(w / 2 + triSize * 0.7, h / 2);
    ctx.lineTo(w / 2 - triSize * 0.45, h / 2 - triSize * 0.65);
    ctx.lineTo(w / 2 - triSize * 0.45, h / 2 + triSize * 0.65);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }

  if (el.stickerType === 'link') {
    // Instagram Style Link Sticker (Pill shaped with link text)
    ctx.fillStyle = el.backgroundColor || '#FAF6F0';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, el.borderRadius || h / 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(45, 106, 79, 0.3)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = el.textColor || '#0E1A12';
    ctx.font = 'bold 30px "Readex Pro", sans-serif';
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(el.title || 'شاهد الفيديو الآن 🔗', w / 2, h / 2);
    ctx.restore();
    return;
  }

  if (el.stickerType === 'announcement') {
    // High-visibility Announcement Banner
    ctx.fillStyle = el.backgroundColor || '#FFCC00';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, el.borderRadius || 24);
      ctx.fill();
      ctx.strokeStyle = el.accentColor || '#E65100';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = el.textColor || '#0E1A12';
    ctx.font = '900 34px "Kufam", sans-serif';
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(el.title || '📢 تنويه هام', w / 2, h / 2);
    ctx.restore();
    return;
  }

  // Background Box
  ctx.fillStyle = el.backgroundColor || '#FAF6F0';
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, el.borderRadius || 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(45, 106, 79, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillRect(0, 0, w, h);
  }

  if (el.stickerType === 'poll') {
    // Question title
    ctx.font = 'bold 36px "Kufam", sans-serif';
    ctx.fillStyle = el.textColor || '#0E1A12';
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const lines = wrapText(ctx, el.title, w - 80);
    lines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, 50 + idx * 48);
    });

    // Two poll option buttons
    const optY = h - 140;
    const optW = (w - 80) / 2;
    const optH = 90;

    // Option 1
    ctx.fillStyle = el.accentColor || '#2E7D32';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(w - 30 - optW, optY, optW, optH, 20);
      ctx.fill();
    } else {
      ctx.fillRect(w - 30 - optW, optY, optW, optH);
    }
    ctx.font = 'bold 28px "Readex Pro", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'middle';
    ctx.fillText(el.option1 || 'نعم 🌿', w - 30 - optW / 2, optY + optH / 2);

    // Option 2
    ctx.fillStyle = 'rgba(14, 26, 18, 0.08)';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(30, optY, optW, optH, 20);
      ctx.fill();
    } else {
      ctx.fillRect(30, optY, optW, optH);
    }
    ctx.fillStyle = el.textColor || '#0E1A12';
    ctx.fillText(el.option2 || 'لا ⚙️', 30 + optW / 2, optY + optH / 2);
  } else {
    // Question / Feedback box
    ctx.font = 'bold 24px "Readex Pro", sans-serif';
    ctx.fillStyle = 'rgba(14, 26, 18, 0.6)';
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('اسأل فريق لَمّاح | LAMMA7', w / 2, 40);

    ctx.font = 'bold 36px "Kufam", sans-serif';
    ctx.fillStyle = el.textColor || '#0E1A12';
    const lines = wrapText(ctx, el.title, w - 80);
    lines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, 90 + idx * 48);
    });

    // Simulated response field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const inputY = h - 130;
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(40, inputY, w - 80, 80, 20);
      ctx.fill();
      ctx.strokeStyle = '#D7CCC8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.fillRect(40, inputY, w - 80, 80);
    }
    ctx.font = '24px "Readex Pro", sans-serif';
    ctx.fillStyle = '#9E9E9E';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('اكتب سؤالك هنا...', w - 70, inputY + 40);
  }

  ctx.restore();
}

/**
 * Branding Element Rendering (LAMMA7 Logo, watermark, IG header)
 */
function renderBrandingElement(ctx: CanvasRenderingContext2D, el: BrandingElement) {
  ctx.save();
  const w = el.width;
  const h = el.height;

  if (el.brandType === 'logo_full' || el.brandType === 'logo_mark') {
    // LAMMA7 Icon Square with Arabic "ل"
    const boxSize = Math.min(h, 70);
    ctx.fillStyle = 'rgba(14, 26, 18, 0.85)';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(w - boxSize, (h - boxSize) / 2, boxSize, boxSize, 16);
      ctx.fill();
      ctx.strokeStyle = el.color || '#39FF14';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillRect(w - boxSize, (h - boxSize) / 2, boxSize, boxSize);
    }

    // Stylized "ل" lettermark
    ctx.font = '900 36px "Kufam", sans-serif';
    ctx.fillStyle = el.color || '#39FF14';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ل', w - boxSize / 2, h / 2);

    if (el.brandType === 'logo_full') {
      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.font = 'bold 30px "Kufam", sans-serif';
      ctx.fillStyle = el.textColor || '#FAF6F0';
      ctx.fillText(el.label || 'لَمّاح | LAMMA7', w - boxSize - 20, h / 2 - 14);

      ctx.font = '20px "Readex Pro", sans-serif';
      ctx.fillStyle = 'rgba(233, 227, 216, 0.7)';
      ctx.fillText(el.sublabel || 'مشروع تخرج الروبوت الزراعي', w - boxSize - 20, h / 2 + 18);
    }
  } else if (el.brandType === 'ig_header') {
    // Simulated IG Story Author Header with progress bars
    const barW = (w - 20) / 3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, barW, 4);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(barW + 10, 0, barW, 4);
    ctx.fillRect(barW * 2 + 20, 0, barW, 4);

    // Avatar
    ctx.fillStyle = el.color || '#39FF14';
    ctx.beginPath();
    ctx.arc(w - 35, 45, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0E1A12';
    ctx.beginPath();
    ctx.arc(w - 35, 45, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '900 24px "Kufam", sans-serif';
    ctx.fillStyle = el.color || '#39FF14';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ل', w - 35, 45);

    // Username & Badge
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.font = 'bold 26px "Readex Pro", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(el.label || 'lamma7.robotics', w - 80, 36);

    ctx.font = '20px "Readex Pro", sans-serif';
    ctx.fillStyle = 'rgba(233, 227, 216, 0.7)';
    ctx.fillText(el.sublabel || 'الروبوت الزراعي الذكي', w - 80, 64);
  }

  ctx.restore();
}

/**
 * Generate a thumbnail data URL (e.g. 270x480) for storage and gallery preview
 */
export async function generateThumbnail(doc: StoryDocument): Promise<string> {
  const canvas = await renderStoryToCanvas(doc, 270, 480);
  return canvas.toDataURL('image/jpeg', 0.85);
}
