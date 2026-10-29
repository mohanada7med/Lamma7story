/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ElementType = 
  | 'text' 
  | 'image' 
  | 'shape' 
  | 'cv_overlay' 
  | 'botanical' 
  | 'sticker' 
  | 'branding';

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number; // in logical 1080x1920 canvas space
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number; // 0 to 1
  zIndex: number;
  locked: boolean;
  hidden: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: 'Kufam' | 'Readex Pro' | 'Cairo' | 'Tajawal' | 'IBM Plex Sans Arabic' | 'sans-serif' | 'monospace';
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'bold' | 'normal';
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: 'right' | 'center' | 'left';
  lineHeight: number;
  letterSpacing: number;
  textDirection: 'rtl' | 'ltr';
  backgroundColor?: string;
  backgroundPadding?: number;
  borderRadius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius: number;
  borderColor?: string;
  borderWidth?: number;
  filterBrightness?: number; // 0 to 200, default 100
  filterContrast?: number; // 0 to 200, default 100
  filterGrayscale?: number; // 0 to 100, default 0
  filterBlur?: number; // 0 to 20, default 0
}

export type ShapeType = 'rect' | 'circle' | 'pill' | 'line' | 'card' | 'badge' | 'hud_panel';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDasharray?: string; // e.g. "4,4"
  borderRadius: number;
  backdropBlur?: boolean;
}

export type CVOverlayStyle = 
  | 'bounding_box' 
  | 'scanline' 
  | 'reticle' 
  | 'hud_card' 
  | 'tech_brackets';

export interface CVOverlayElement extends BaseElement {
  type: 'cv_overlay';
  style: CVOverlayStyle;
  label: string; // e.g. "TARGET 01: LEAF_HEALTHY"
  confidence: string; // e.g. "98.4% Leaf Diagnostic"
  color: string; // e.g. "#39FF14" or "#66BB6A"
  secondaryColor?: string;
  showCrosshairs?: boolean;
  showConfidence?: boolean;
  activeAnimation?: boolean;
}

export type BotanicalType = 
  | 'leaf_single' 
  | 'sprout' 
  | 'branch' 
  | 'seedling' 
  | 'wheat' 
  | 'plant_cross' 
  | 'circuit_leaf' 
  | 'corn_field';

export interface BotanicalElement extends BaseElement {
  type: 'botanical';
  botanicalType: BotanicalType;
  color: string;
  secondaryColor?: string;
  strokeWidth?: number;
}

export type StickerType = 
  | 'poll' 
  | 'question' 
  | 'metric' 
  | 'slider'
  | 'video_teaser'
  | 'announcement'
  | 'link'
  | 'play_button';

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerType: StickerType;
  title: string;
  subtitle?: string;
  option1?: string;
  option2?: string;
  badgeText?: string;
  linkText?: string;
  duration?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
}

export type BrandingType = 'logo_mark' | 'logo_full' | 'tech_tag' | 'ig_header' | 'ig_footer';

export interface BrandingElement extends BaseElement {
  type: 'branding';
  brandType: BrandingType;
  label?: string;
  sublabel?: string;
  badgeNumber?: string;
  color: string;
  textColor: string;
}

export type StoryElement = 
  | TextElement 
  | ImageElement 
  | ShapeElement 
  | CVOverlayElement 
  | BotanicalElement 
  | StickerElement 
  | BrandingElement;

export interface CanvasBackground {
  type: 'color' | 'gradient' | 'image';
  color: string;
  gradientAngle: number;
  gradientStops: { offset: number; color: string }[];
  imageSrc?: string;
  overlayColor: string;
  overlayOpacity: number; // 0 to 1
  texture: 'none' | 'grid' | 'dots';
}

export interface StoryDocument {
  id: string;
  name: string;
  width: 1080;
  height: 1920;
  background: CanvasBackground;
  elements: StoryElement[];
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}

export interface StoryTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  document: Omit<StoryDocument, 'id' | 'createdAt' | 'updatedAt'>;
  previewThumbnail?: string;
}

export interface HistoryState {
  past: StoryDocument[];
  present: StoryDocument;
  future: StoryDocument[];
}

export type ToolTab = 
  | 'templates' 
  | 'announcements'
  | 'background' 
  | 'text' 
  | 'shapes' 
  | 'cv' 
  | 'botanical' 
  | 'stickers' 
  | 'branding' 
  | 'uploads' 
  | 'layers';
