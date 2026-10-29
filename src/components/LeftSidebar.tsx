/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Palette, 
  Type, 
  Square, 
  Scan, 
  Leaf, 
  MessageSquareHeart, 
  ShieldCheck, 
  Upload, 
  Layers,
  Plus,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Megaphone,
  Video,
  Play
} from 'lucide-react';
import { ToolTab, StoryElement, CanvasBackground, StoryTemplate } from '../types/editor';
import { STORY_TEMPLATES } from '../data/templates';
import { BRAND_COLORS, COLOR_SWATCHES, GRADIENT_PRESETS, PRESET_BACKGROUND_IMAGES, BOTANICAL_PATHS } from '../data/assets';

interface LeftSidebarProps {
  activeTab: ToolTab;
  onSelectTab: (tab: ToolTab) => void;
  onApplyTemplate: (template: StoryTemplate) => void;
  onAddElement: (element: StoryElement) => void;
  background: CanvasBackground;
  onChangeBackground: (bg: Partial<CanvasBackground>) => void;
  uploadedImages: string[];
  onUploadImage: (file: File) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onSelectTab,
  onApplyTemplate,
  onAddElement,
  background,
  onChangeBackground,
  uploadedImages,
  onUploadImage
}) => {
  const [templateFilter, setTemplateFilter] = useState<string>('all');

  const navItems: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: 'القوالب', icon: <LayoutTemplate className="w-5 h-5" /> },
    { id: 'announcements', label: 'تنويهات وفيديو', icon: <Megaphone className="w-5 h-5" /> },
    { id: 'background', label: 'الخلفية', icon: <Palette className="w-5 h-5" /> },
    { id: 'text', label: 'نصوص', icon: <Type className="w-5 h-5" /> },
    { id: 'shapes', label: 'أشكال', icon: <Square className="w-5 h-5" /> },
    { id: 'cv', label: 'ذكاء اصطناعي', icon: <Scan className="w-5 h-5" /> },
    { id: 'botanical', label: 'نباتات', icon: <Leaf className="w-5 h-5" /> },
    { id: 'stickers', label: 'ملصقات', icon: <MessageSquareHeart className="w-5 h-5" /> },
    { id: 'branding', label: 'هوية لمّاح', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'uploads', label: 'رفوعاتي', icon: <Upload className="w-5 h-5" /> }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-full select-none border-l border-[#2D6A4F]/40 bg-[#0E1A12] z-20 shrink-0">
      {/* Icon Navigation Column */}
      <nav className="w-16 sm:w-20 bg-[#0A130D] border-l border-[#2D6A4F]/30 flex flex-col items-center py-3 gap-1 overflow-y-auto shrink-0">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-14 sm:w-16 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                isActive
                  ? 'bg-[#1B2E21] text-[#39FF14] border border-[#39FF14]/40 font-bold shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                  : 'text-[#C8E6C9]/70 hover:text-[#FAF6F0] hover:bg-[#14261B]'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Detail Drawer Panel */}
      <aside className="w-72 sm:w-80 bg-[#0E1A12] flex flex-col border-r border-[#2D6A4F]/30 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#2D6A4F]/30 flex items-center justify-between">
          <h2 className="font-kufam font-bold text-sm text-[#FAF6F0] flex items-center gap-2">
            {navItems.find((n) => n.id === activeTab)?.icon}
            <span>{navItems.find((n) => n.id === activeTab)?.label}</span>
          </h2>
          <span className="text-[11px] text-[#A5D6A7]/60 font-mono">
            LAMMA7 ASSETS
          </span>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* 1. TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                اختر قالباً كبداية سريعة. جميع النصوص والصور والألوان تبقى قابلة للتعديل والتحريك بعد الاختيار:
              </p>

              <div className="space-y-2.5">
                {STORY_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => onApplyTemplate(tmpl)}
                    className="p-3 rounded-xl bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] transition cursor-pointer group text-right"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#FAF6F0] group-hover:text-[#39FF14] transition font-kufam">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] text-[#A5D6A7] bg-[#0E1A12] px-2 py-0.5 rounded border border-[#2D6A4F]/50">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A5D6A7]/70 leading-normal line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1.5. ANNOUNCEMENTS & VIDEO TEASER TAB */}
          {activeTab === 'announcements' && (
            <div className="space-y-5">
              {/* Quick Template Shortcuts */}
              <div className="p-3 bg-[#1B2E21]/60 rounded-2xl border border-[#2D6A4F]/60 space-y-2">
                <span className="text-[10px] text-[#39FF14] font-bold font-mono">
                  READY-TO-USE TEMPLATES
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const tmpl = STORY_TEMPLATES.find((t) => t.id === 'new_video_teaser');
                      if (tmpl) onApplyTemplate(tmpl);
                    }}
                    className="p-2.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#39FF14]/50 rounded-xl text-right transition flex flex-col gap-1 group"
                  >
                    <span className="text-xs font-bold text-[#39FF14] flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>قالب فيديو جديد</span>
                    </span>
                    <span className="text-[10px] text-[#A5D6A7]/70">تطبيق ستوري الفيديو</span>
                  </button>

                  <button
                    onClick={() => {
                      const tmpl = STORY_TEMPLATES.find((t) => t.id === 'general_announcement');
                      if (tmpl) onApplyTemplate(tmpl);
                    }}
                    className="p-2.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#FFCC00]/50 rounded-xl text-right transition flex flex-col gap-1 group"
                  >
                    <span className="text-xs font-bold text-[#FFCC00] flex items-center gap-1">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>قالب تنويه هام</span>
                    </span>
                    <span className="text-[10px] text-[#A5D6A7]/70">تطبيق ستوري الإشعار</span>
                  </button>
                </div>
              </div>

              {/* Category A: New Video Elements */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#39FF14] flex items-center gap-1.5 font-kufam border-b border-[#2D6A4F]/30 pb-1.5">
                  <Video className="w-4 h-4" />
                  <span>عناصر تنويه الفيديو الجديد</span>
                </h3>

                {/* 1. New Video Badge */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'video_badge_' + Date.now(),
                      type: 'text',
                      name: 'شارة فيديو جديد',
                      x: 140,
                      y: 200,
                      width: 800,
                      height: 70,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      content: '🎬 فيديو جديد نزل الآن على يوتيوب',
                      fontSize: 32,
                      fontFamily: 'Readex Pro',
                      fontWeight: '800',
                      fontStyle: 'normal',
                      color: '#0E1A12',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      letterSpacing: 1,
                      textDirection: 'rtl',
                      backgroundColor: '#39FF14',
                      backgroundPadding: 16,
                      borderRadius: 24
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                      شارة: فيديو جديد نزل الآن 🎬
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      شارة خضراء ناصعة تلفت انتباه المتابعين فوراً
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#39FF14]" />
                </button>

                {/* 2. Glowing Play Button Overlay */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'play_btn_' + Date.now(),
                      type: 'sticker',
                      name: 'زر تشغيل فيديو مضيء',
                      x: 440,
                      y: 760,
                      width: 200,
                      height: 200,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 12,
                      locked: false,
                      hidden: false,
                      stickerType: 'play_button',
                      title: 'PLAY',
                      backgroundColor: 'rgba(14, 26, 18, 0.85)',
                      textColor: '#FFFFFF',
                      accentColor: '#39FF14',
                      borderRadius: 100
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1B2E21] border border-[#39FF14] flex items-center justify-center text-[#39FF14]">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                        زر تشغيل الفيديو (Play Button)
                      </div>
                      <div className="text-[11px] text-[#A5D6A7]/70">
                        يوضع فوق صور الحقل لتوضيح وجود مقطع
                      </div>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#39FF14]" />
                </button>

                {/* 3. Link Sticker */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'link_stk_' + Date.now(),
                      type: 'sticker',
                      name: 'ملصق رابط المشاهدة',
                      x: 140,
                      y: 1550,
                      width: 800,
                      height: 120,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      stickerType: 'link',
                      title: 'شاهد الفيديو كاملاً على يوتيوب 🔗',
                      linkText: 'lamma7.ai/youtube',
                      backgroundColor: '#FAF6F0',
                      textColor: '#0E1A12',
                      accentColor: '#2E7D32',
                      borderRadius: 28
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                      ملصق رابط المشاهدة (Watch Link)
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      ملصق إنستغرام الأنيق لدعوة المتابعين للنقر
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#39FF14]" />
                </button>

                {/* 4. Video Duration Tag */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'dur_tag_' + Date.now(),
                      type: 'text',
                      name: 'شارة مدة الفيديو',
                      x: 140,
                      y: 1100,
                      width: 320,
                      height: 50,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      content: '⏱ 06:45 دقيقة · 4K',
                      fontSize: 24,
                      fontFamily: 'Readex Pro',
                      fontWeight: '700',
                      fontStyle: 'normal',
                      color: '#FAF6F0',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      letterSpacing: 1,
                      textDirection: 'rtl',
                      backgroundColor: '#0E1A12',
                      backgroundPadding: 12,
                      borderRadius: 16
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                      شارة مدة الفيديو والجودة (Duration)
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      ⏱ 06:45 دقيقة · 4K
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#39FF14]" />
                </button>
              </div>

              {/* Category B: General Notices & Announcements */}
              <div className="space-y-3 pt-3 border-t border-[#2D6A4F]/40">
                <h3 className="text-xs font-bold text-[#FFCC00] flex items-center gap-1.5 font-kufam border-b border-[#2D6A4F]/30 pb-1.5">
                  <Megaphone className="w-4 h-4" />
                  <span>عناصر التنويهات والإشعارات العامة</span>
                </h3>

                {/* 1. Important Announcement Banner */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'notice_banner_' + Date.now(),
                      type: 'sticker',
                      name: 'شريط تنويه هام',
                      x: 100,
                      y: 160,
                      width: 880,
                      height: 110,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      stickerType: 'announcement',
                      title: '📢 تنويه هام لمتابعي مشروع لَمّاح',
                      backgroundColor: '#FFCC00',
                      textColor: '#0E1A12',
                      accentColor: '#E65100',
                      borderRadius: 24
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#FFCC00] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#FFCC00] group-hover:text-white transition">
                      شريط: 📢 تنويه هام لمتابعي لَمّاح
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      شريط أصفر بارز للإعلانات الرسمية والتنبيهات
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#FFCC00]" />
                </button>

                {/* 2. Urgent Alert Badge */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'urgent_badge_' + Date.now(),
                      type: 'text',
                      name: 'شارة تنبيه عاجل',
                      x: 140,
                      y: 220,
                      width: 800,
                      height: 60,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      content: '⚠️ إشعار عاجل ومهم',
                      fontSize: 28,
                      fontFamily: 'Readex Pro',
                      fontWeight: '800',
                      fontStyle: 'normal',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      letterSpacing: 1,
                      textDirection: 'rtl',
                      backgroundColor: '#E65100',
                      backgroundPadding: 14,
                      borderRadius: 20
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-orange-500 rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-orange-400">
                      شارة: ⚠️ إشعار عاجل ومهم
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      شارة برتقالية للتحذيرات والمواعيد العاجلة
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-orange-400" />
                </button>

                {/* 3. Coming Soon Teaser */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'soon_badge_' + Date.now(),
                      type: 'text',
                      name: 'شارة ترقبوا قريباً',
                      x: 140,
                      y: 220,
                      width: 800,
                      height: 60,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      content: '⏳ ترقبوا المفاجأة قريباً في الحقل...',
                      fontSize: 28,
                      fontFamily: 'Readex Pro',
                      fontWeight: '700',
                      fontStyle: 'normal',
                      color: '#0E1A12',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      letterSpacing: 1,
                      textDirection: 'rtl',
                      backgroundColor: '#66BB6A',
                      backgroundPadding: 14,
                      borderRadius: 20
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#66BB6A] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#66BB6A]">
                      شارة: ⏳ ترقبوا قريباً في الحقل...
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      للتشويق قبل إطلاق الميزة أو نزول التقرير
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#66BB6A]" />
                </button>

                {/* 4. Event Date & Time HUD Strip */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'event_date_' + Date.now(),
                      type: 'text',
                      name: 'شريط الموعد والمكان',
                      x: 100,
                      y: 1200,
                      width: 880,
                      height: 80,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 10,
                      locked: false,
                      hidden: false,
                      content: '🗓️ الخميس القادم · ⏰ 10:00 صباحاً · 📍 مدرج الهندسة',
                      fontSize: 28,
                      fontFamily: 'Readex Pro',
                      fontWeight: '700',
                      fontStyle: 'normal',
                      color: '#39FF14',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      letterSpacing: 0,
                      textDirection: 'rtl',
                      backgroundColor: '#122217',
                      backgroundPadding: 16,
                      borderRadius: 22
                    })
                  }
                  className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                      شريط الموعد والمكان (Event Strip)
                    </div>
                    <div className="text-[11px] text-[#A5D6A7]/70">
                      مع أيقونات التاريخ والساعة وموقع الحدث
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#39FF14]" />
                </button>
              </div>
            </div>
          )}

          {/* 2. BACKGROUND & COLORS TAB */}
          {activeTab === 'background' && (
            <div className="space-y-5">
              {/* Background Type Toggle */}
              <div>
                <label className="text-xs font-bold text-[#FAF6F0] block mb-2 font-kufam">
                  نوع الخلفية
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#14261B] rounded-lg border border-[#2D6A4F]/40 text-xs">
                  <button
                    onClick={() => onChangeBackground({ type: 'color' })}
                    className={`py-1.5 rounded-md transition ${
                      background.type === 'color'
                        ? 'bg-[#2E7D32] text-white font-bold'
                        : 'text-[#C8E6C9] hover:text-white'
                    }`}
                  >
                    لون مصمت
                  </button>
                  <button
                    onClick={() => onChangeBackground({ type: 'gradient' })}
                    className={`py-1.5 rounded-md transition ${
                      background.type === 'gradient'
                        ? 'bg-[#2E7D32] text-white font-bold'
                        : 'text-[#C8E6C9] hover:text-white'
                    }`}
                  >
                    تدرج لوني
                  </button>
                  <button
                    onClick={() => onChangeBackground({ type: 'image' })}
                    className={`py-1.5 rounded-md transition ${
                      background.type === 'image'
                        ? 'bg-[#2E7D32] text-white font-bold'
                        : 'text-[#C8E6C9] hover:text-white'
                    }`}
                  >
                    صورة خلفية
                  </button>
                </div>
              </div>

              {/* Color Swatches */}
              {background.type === 'color' && (
                <div>
                  <label className="text-xs font-bold text-[#FAF6F0] block mb-2">
                    ألوان هوية لَمّاح
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.hex}
                        onClick={() => onChangeBackground({ color: swatch.hex })}
                        title={swatch.name}
                        className={`h-9 rounded-lg border transition relative flex items-center justify-center ${
                          background.color.toLowerCase() === swatch.hex.toLowerCase()
                            ? 'border-[#39FF14] ring-2 ring-[#39FF14]/40 scale-105'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="color"
                      value={background.color}
                      onChange={(e) => onChangeBackground({ color: e.target.value })}
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#FAF6F0]">{background.color}</span>
                  </div>
                </div>
              )}

              {/* Gradient Presets */}
              {background.type === 'gradient' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#FAF6F0] block">
                    تدرجات هوية لَمّاح الزراعية
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_PRESETS.map((grad, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          onChangeBackground({
                            gradientAngle: grad.angle,
                            gradientStops: grad.stops
                          })
                        }
                        className="h-16 rounded-xl border border-white/10 p-2 text-right flex flex-col justify-end transition hover:scale-[1.02] hover:border-[#39FF14]"
                        style={{
                          background: `linear-gradient(${grad.angle}deg, ${grad.stops
                            .map((s) => `${s.color} ${s.offset * 100}%`)
                            .join(', ')})`
                        }}
                      >
                        <span className="text-[11px] font-bold text-white drop-shadow">
                          {grad.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Background Photos */}
              {background.type === 'image' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#FAF6F0] block">
                    صور الحقل والتقنية الجاهزة
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_BACKGROUND_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => onChangeBackground({ imageSrc: img.url })}
                        className={`relative h-24 rounded-xl overflow-hidden border group transition ${
                          background.imageSrc === img.url
                            ? 'border-[#39FF14] ring-2 ring-[#39FF14]/40'
                            : 'border-[#2D6A4F]/50 hover:border-[#39FF14]'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                          <span className="text-[10px] text-white font-medium truncate">
                            {img.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Texture & Scrim Overlay */}
              <div className="pt-3 border-t border-[#2D6A4F]/30 space-y-3">
                <label className="text-xs font-bold text-[#FAF6F0] block font-kufam">
                  النقش والتعتيم (Overlay)
                </label>
                
                {/* Texture Choice */}
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <button
                    onClick={() => onChangeBackground({ texture: 'none' })}
                    className={`py-1.5 rounded-lg border transition ${
                      background.texture === 'none'
                        ? 'bg-[#1B2E21] border-[#39FF14] text-[#39FF14]'
                        : 'bg-[#14261B] border-[#2D6A4F]/40 text-[#C8E6C9]'
                    }`}
                  >
                    بدون نقش
                  </button>
                  <button
                    onClick={() => onChangeBackground({ texture: 'grid' })}
                    className={`py-1.5 rounded-lg border transition ${
                      background.texture === 'grid'
                        ? 'bg-[#1B2E21] border-[#39FF14] text-[#39FF14]'
                        : 'bg-[#14261B] border-[#2D6A4F]/40 text-[#C8E6C9]'
                    }`}
                  >
                    شبكة تقنية
                  </button>
                  <button
                    onClick={() => onChangeBackground({ texture: 'dots' })}
                    className={`py-1.5 rounded-lg border transition ${
                      background.texture === 'dots'
                        ? 'bg-[#1B2E21] border-[#39FF14] text-[#39FF14]'
                        : 'bg-[#14261B] border-[#2D6A4F]/40 text-[#C8E6C9]'
                    }`}
                  >
                    نقاط الحقل
                  </button>
                </div>

                {/* Dark Scrim Opacity Slider */}
                <div>
                  <div className="flex justify-between text-xs text-[#A5D6A7] mb-1">
                    <span>نسبة تعتيم الخلفية لتوضيح النص</span>
                    <span className="font-mono">{Math.round(background.overlayOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={background.overlayOpacity}
                    onChange={(e) =>
                      onChangeBackground({ overlayOpacity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#39FF14] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. TEXT ELEMENTS TAB */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                اضغط لإضافة نص إلى منتصف لوحة القصة. يمكنك لاحقاً تعديل الخط، الحجم، اللون والاتجاه:
              </p>

              {/* Add Preset Text Styles */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'text_' + Date.now(),
                    type: 'text',
                    name: 'عنوان رئيسي',
                    x: 100,
                    y: 600,
                    width: 880,
                    height: 180,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 10,
                    locked: false,
                    hidden: false,
                    content: 'اكتب عنوانك الرئيسي هنا',
                    fontSize: 64,
                    fontFamily: 'Kufam',
                    fontWeight: '900',
                    fontStyle: 'normal',
                    color: '#FAF6F0',
                    textAlign: 'right',
                    lineHeight: 1.35,
                    letterSpacing: 0,
                    textDirection: 'rtl'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-kufam font-black text-lg text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                    عنوان رئيسي عريض (Heading)
                  </div>
                  <div className="text-[11px] text-[#A5D6A7]/70">خط كوفي Kufam 64px Bold</div>
                </div>
                <Plus className="w-5 h-5 text-[#39FF14]" />
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: 'text_' + Date.now(),
                    type: 'text',
                    name: 'عنوان فرعي',
                    x: 100,
                    y: 800,
                    width: 880,
                    height: 120,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 10,
                    locked: false,
                    hidden: false,
                    content: 'اكتب هنا عنواناً فرعياً يوضح تفاصيل القصة',
                    fontSize: 42,
                    fontFamily: 'Readex Pro',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    color: '#C8E6C9',
                    textAlign: 'right',
                    lineHeight: 1.4,
                    letterSpacing: 0,
                    textDirection: 'rtl'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-readex font-bold text-sm text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                    عنوان فرعي (Subheading)
                  </div>
                  <div className="text-[11px] text-[#A5D6A7]/70">خط Readex Pro 42px Medium</div>
                </div>
                <Plus className="w-5 h-5 text-[#39FF14]" />
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: 'text_' + Date.now(),
                    type: 'text',
                    name: 'فقرة نصية',
                    x: 100,
                    y: 950,
                    width: 880,
                    height: 200,
                    rotation: 0,
                    opacity: 0.9,
                    zIndex: 10,
                    locked: false,
                    hidden: false,
                    content: 'أضف هنا فقرة نصية تشرح الملاحظات والتجارب التي قام بها فريق لَمّاح في الحقل.',
                    fontSize: 32,
                    fontFamily: 'Readex Pro',
                    fontWeight: '400',
                    fontStyle: 'normal',
                    color: '#E9E3D8',
                    textAlign: 'right',
                    lineHeight: 1.7,
                    letterSpacing: 0,
                    textDirection: 'rtl'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-readex text-xs text-[#FAF6F0] group-hover:text-[#39FF14] transition">
                    نص فقرة توضيحي (Body Text)
                  </div>
                  <div className="text-[11px] text-[#A5D6A7]/70">قراءة مريحة 32px Regular</div>
                </div>
                <Plus className="w-5 h-5 text-[#39FF14]" />
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: 'text_' + Date.now(),
                    type: 'text',
                    name: 'شارة تصنيف خضراء',
                    x: 100,
                    y: 450,
                    width: 400,
                    height: 60,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 10,
                    locked: false,
                    hidden: false,
                    content: 'تحديث الحقل #03',
                    fontSize: 26,
                    fontFamily: 'Readex Pro',
                    fontWeight: '700',
                    fontStyle: 'normal',
                    color: '#0E1A12',
                    textAlign: 'center',
                    lineHeight: 1.4,
                    letterSpacing: 1,
                    textDirection: 'rtl',
                    backgroundColor: '#39FF14',
                    backgroundPadding: 12,
                    borderRadius: 20
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#39FF14]">شارة تصنيف ملونة (Badge)</div>
                  <div className="text-[11px] text-[#A5D6A7]/70">خلفية خضراء مع زوايا ناعمة</div>
                </div>
                <Plus className="w-5 h-5 text-[#39FF14]" />
              </button>
            </div>
          )}

          {/* 4. SHAPES TAB */}
          {activeTab === 'shapes' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                أضف إطارات وبطاقات زجاجية لحمل النصوص وحماية تباين القراءة:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {/* HUD Glass Panel */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'shape_' + Date.now(),
                      type: 'shape',
                      name: 'بطاقة زجاجية HUD',
                      x: 90,
                      y: 900,
                      width: 900,
                      height: 520,
                      rotation: 0,
                      opacity: 0.9,
                      zIndex: 5,
                      locked: false,
                      hidden: false,
                      shapeType: 'hud_panel',
                      fillColor: '#0E1A12',
                      strokeColor: '#39FF14',
                      strokeWidth: 2,
                      borderRadius: 32
                    })
                  }
                  className="p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-center flex flex-col items-center justify-center gap-2 transition"
                >
                  <div className="w-12 h-8 rounded-lg bg-[#0E1A12] border border-[#39FF14]/70"></div>
                  <span className="text-xs font-bold text-[#FAF6F0]">بطاقة HUD زجاجية</span>
                </button>

                {/* Rounded Card */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'shape_' + Date.now(),
                      type: 'shape',
                      name: 'مستطيل مدور',
                      x: 100,
                      y: 700,
                      width: 880,
                      height: 400,
                      rotation: 0,
                      opacity: 0.85,
                      zIndex: 5,
                      locked: false,
                      hidden: false,
                      shapeType: 'rect',
                      fillColor: '#1B2E21',
                      strokeColor: '#2D6A4F',
                      strokeWidth: 2,
                      borderRadius: 24
                    })
                  }
                  className="p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-center flex flex-col items-center justify-center gap-2 transition"
                >
                  <div className="w-12 h-8 rounded-md bg-[#1B2E21] border border-[#2D6A4F]"></div>
                  <span className="text-xs font-bold text-[#FAF6F0]">بطاقة خضراء</span>
                </button>

                {/* Circle */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'shape_' + Date.now(),
                      type: 'shape',
                      name: 'دائرة إنجاز',
                      x: 390,
                      y: 500,
                      width: 300,
                      height: 300,
                      rotation: 0,
                      opacity: 1,
                      zIndex: 5,
                      locked: false,
                      hidden: false,
                      shapeType: 'circle',
                      fillColor: '#14261B',
                      strokeColor: '#66BB6A',
                      strokeWidth: 3,
                      borderRadius: 150
                    })
                  }
                  className="p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-center flex flex-col items-center justify-center gap-2 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-[#14261B] border border-[#66BB6A]"></div>
                  <span className="text-xs font-bold text-[#FAF6F0]">دائرة تركيز</span>
                </button>

                {/* Divider Line */}
                <button
                  onClick={() =>
                    onAddElement({
                      id: 'shape_' + Date.now(),
                      type: 'shape',
                      name: 'خط فاصل أفقي',
                      x: 100,
                      y: 900,
                      width: 880,
                      height: 4,
                      rotation: 0,
                      opacity: 0.6,
                      zIndex: 5,
                      locked: false,
                      hidden: false,
                      shapeType: 'line',
                      fillColor: '#39FF14',
                      strokeColor: '#39FF14',
                      strokeWidth: 4,
                      borderRadius: 2
                    })
                  }
                  className="p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-center flex flex-col items-center justify-center gap-2 transition"
                >
                  <div className="w-12 h-1 bg-[#39FF14] rounded my-4"></div>
                  <span className="text-xs font-bold text-[#FAF6F0]">خط فاصل أخضر</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. COMPUTER VISION TAB */}
          {activeTab === 'cv' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                عناصر الرؤية الحاسوبية ونماذج الكشف بالذكاء الاصطناعي لروبوت لَمّاح:
              </p>

              {/* Bounding Box */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'cv_' + Date.now(),
                    type: 'cv_overlay',
                    name: 'مربع تحديد الآفة',
                    x: 140,
                    y: 600,
                    width: 800,
                    height: 520,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 8,
                    locked: false,
                    hidden: false,
                    style: 'bounding_box',
                    label: 'TARGET 01: LEAF_HEALTHY',
                    confidence: '98.4%',
                    color: '#39FF14',
                    showCrosshairs: true,
                    showConfidence: true
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#39FF14] flex items-center gap-1.5 font-mono">
                    <Scan className="w-4 h-4" />
                    <span>BOUNDING BOX (إطار التحديد)</span>
                  </div>
                  <div className="text-[11px] text-[#A5D6A7]/70">
                    مع علامة الهدف ونسبة الدقة ومؤشر المركز
                  </div>
                </div>
                <Plus className="w-4 h-4 text-[#39FF14]" />
              </button>

              {/* Laser Scanline */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'cv_' + Date.now(),
                    type: 'cv_overlay',
                    name: 'شعاع مسح ليزري',
                    x: 60,
                    y: 500,
                    width: 960,
                    height: 12,
                    rotation: 0,
                    opacity: 0.9,
                    zIndex: 9,
                    locked: false,
                    hidden: false,
                    style: 'scanline',
                    label: 'ACTIVE SCAN',
                    confidence: '60 FPS',
                    color: '#39FF14',
                    activeAnimation: true
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#FAF6F0] flex items-center gap-1.5 font-mono">
                    <div className="w-2.5 h-2.5 bg-[#39FF14] rounded-full animate-ping"></div>
                    <span>SCANLINE (شعاع مسح ليزري)</span>
                  </div>
                  <div className="text-[11px] text-[#A5D6A7]/70">
                    شعاع المسح الضوئي الأخضر للكاميرا
                  </div>
                </div>
                <Plus className="w-4 h-4 text-[#39FF14]" />
              </button>

              {/* Reticle */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'cv_' + Date.now(),
                    type: 'cv_overlay',
                    name: 'مؤشر تقاطع Reticle',
                    x: 440,
                    y: 700,
                    width: 200,
                    height: 200,
                    rotation: 0,
                    opacity: 0.8,
                    zIndex: 8,
                    locked: false,
                    hidden: false,
                    style: 'reticle',
                    label: 'CENTER_LOCK',
                    confidence: '',
                    color: '#39FF14'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#FAF6F0] font-mono">
                    AIM RETICLE (مؤشر التصويب)
                  </div>
                  <div className="text-[11px] text-[#A5D6A7]/70">
                    دائرة تركيز رقمية لعدسة الروبوت
                  </div>
                </div>
                <Plus className="w-4 h-4 text-[#39FF14]" />
              </button>
            </div>
          )}

          {/* 6. BOTANICAL TAB */}
          {activeTab === 'botanical' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                زخارف نباتية مصممة خصيصاً لمشروع لَمّاح الزراعي:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(BOTANICAL_PATHS).map(([key, asset]) => (
                  <button
                    key={key}
                    onClick={() =>
                      onAddElement({
                        id: 'botanical_' + Date.now(),
                        type: 'botanical',
                        name: asset.label,
                        x: 440,
                        y: 700,
                        width: 200,
                        height: 200,
                        rotation: 0,
                        opacity: 0.9,
                        zIndex: 6,
                        locked: false,
                        hidden: false,
                        botanicalType: key as any,
                        color: '#66BB6A',
                        secondaryColor: '#2E7D32'
                      })
                    }
                    className="p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-center flex flex-col items-center justify-center gap-2 transition group"
                  >
                    <svg
                      viewBox={asset.viewBox}
                      className="w-12 h-12 text-[#66BB6A] group-hover:scale-110 transition"
                      fill="currentColor"
                    >
                      <path d={asset.path} />
                    </svg>
                    <span className="text-[11px] font-bold text-[#FAF6F0] line-clamp-1">
                      {asset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. STICKERS TAB */}
          {activeTab === 'stickers' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                ملصقات إنستغرام تفاعلية لزيادة تفاعل المتابعين في الستوري:
              </p>

              {/* Poll Sticker */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'sticker_' + Date.now(),
                    type: 'sticker',
                    name: 'ملصق تصويت',
                    x: 100,
                    y: 750,
                    width: 880,
                    height: 450,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 12,
                    locked: false,
                    hidden: false,
                    stickerType: 'poll',
                    title: 'هل تعتقد أن الروبوتات ستغير مستقبل الزراعة؟',
                    option1: 'نعم، بكل تأكيد 🌿',
                    option2: 'نحتاج مزيداً من الوقت ⚙️',
                    backgroundColor: '#FAF6F0',
                    textColor: '#0E1A12',
                    accentColor: '#2E7D32',
                    borderRadius: 32
                  })
                }
                className="w-full p-3.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition"
              >
                <div className="text-xs font-bold text-[#FAF6F0] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14]"></span>
                  <span>ملصق استطلاع رأي (Poll Sticker)</span>
                </div>
                <div className="text-[11px] text-[#A5D6A7]/70">
                  سؤال مع خيارين تصويت قابلين للتخصيص
                </div>
              </button>

              {/* Question Sticker */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'sticker_' + Date.now(),
                    type: 'sticker',
                    name: 'صندوق أسئلة',
                    x: 100,
                    y: 750,
                    width: 880,
                    height: 420,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 12,
                    locked: false,
                    hidden: false,
                    stickerType: 'question',
                    title: 'ايش حابين تسألوا فريق لَمّاح عن الروبوت؟',
                    backgroundColor: '#FAF6F0',
                    textColor: '#0E1A12',
                    accentColor: '#2E7D32',
                    borderRadius: 32
                  })
                }
                className="w-full p-3.5 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition"
              >
                <div className="text-xs font-bold text-[#FAF6F0] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14]"></span>
                  <span>صندوق الأسئلة (Questions Box)</span>
                </div>
                <div className="text-[11px] text-[#A5D6A7]/70">
                  دعوة للمتابعين لكتابة أسئلتهم واستفساراتهم
                </div>
              </button>
            </div>
          )}

          {/* 8. BRANDING TAB */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                شعارات وعلامات التوثيق لمشروع لَمّاح:
              </p>

              {/* Full Brand Watermark */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'brand_' + Date.now(),
                    type: 'branding',
                    name: 'شعار لَمّاح الكامل',
                    x: 100,
                    y: 100,
                    width: 450,
                    height: 70,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 15,
                    locked: false,
                    hidden: false,
                    brandType: 'logo_full',
                    label: 'لَمّاح | LAMMA7',
                    sublabel: 'مشروع تخرج الروبوت الزراعي',
                    color: '#39FF14',
                    textColor: '#FAF6F0'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition"
              >
                <div className="text-xs font-bold text-[#FAF6F0]">شعار لَمّاح الكامل مع العنوان الفرعي</div>
                <div className="text-[11px] text-[#A5D6A7]/70">أيقونة "ل" الخضراء مع النص</div>
              </button>

              {/* Logo Mark Only */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'brand_' + Date.now(),
                    type: 'branding',
                    name: 'أيقونة حرف ل',
                    x: 100,
                    y: 100,
                    width: 90,
                    height: 90,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 15,
                    locked: false,
                    hidden: false,
                    brandType: 'logo_mark',
                    color: '#39FF14',
                    textColor: '#FAF6F0'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition"
              >
                <div className="text-xs font-bold text-[#FAF6F0]">أيقونة الحرف "ل" المضيئة</div>
                <div className="text-[11px] text-[#A5D6A7]/70">رمز الشعار المختصر للزوايا</div>
              </button>

              {/* IG Header Bar */}
              <button
                onClick={() =>
                  onAddElement({
                    id: 'brand_' + Date.now(),
                    type: 'branding',
                    name: 'رأس هوية القصة',
                    x: 60,
                    y: 80,
                    width: 960,
                    height: 90,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 15,
                    locked: false,
                    hidden: false,
                    brandType: 'ig_header',
                    label: 'lamma7.robotics',
                    sublabel: 'الروبوت الزراعي الذكي',
                    color: '#39FF14',
                    textColor: '#FAF6F0'
                  })
                }
                className="w-full p-3 bg-[#14261B] hover:bg-[#1B2E21] border border-[#2D6A4F]/40 hover:border-[#39FF14] rounded-xl text-right transition"
              >
                <div className="text-xs font-bold text-[#FAF6F0]">شريط حساب إنستغرام التوثيقي</div>
                <div className="text-[11px] text-[#A5D6A7]/70">مع شرائط التقدم وعلامة التحقق</div>
              </button>
            </div>
          )}

          {/* 9. UPLOADS TAB */}
          {activeTab === 'uploads' && (
            <div className="space-y-4">
              <p className="text-xs text-[#C8E6C9]/80 leading-relaxed">
                ارفع صور من جهازك (صور الروبوت، تجارب الحقل، أو شعارات شفافة PNG):
              </p>

              {/* Upload Button */}
              <label className="w-full p-4 border-2 border-dashed border-[#2D6A4F] hover:border-[#39FF14] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#14261B]/60 hover:bg-[#1B2E21] transition">
                <Upload className="w-6 h-6 text-[#39FF14]" />
                <span className="text-xs font-bold text-[#FAF6F0]">اختر صورة من جهازك</span>
                <span className="text-[10px] text-[#A5D6A7]/60">PNG, JPG, WEBP مدعومة</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Gallery */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#FAF6F0]">الصور المرفوعة</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedImages.map((src, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          onAddElement({
                            id: 'img_' + Date.now(),
                            type: 'image',
                            name: `صورة مرفوعة ${idx + 1}`,
                            x: 140,
                            y: 600,
                            width: 800,
                            height: 600,
                            rotation: 0,
                            opacity: 1,
                            zIndex: 10,
                            locked: false,
                            hidden: false,
                            src,
                            objectFit: 'cover',
                            borderRadius: 24,
                            borderColor: '#2D6A4F',
                            borderWidth: 2
                          })
                        }
                        className="relative h-24 rounded-xl overflow-hidden border border-[#2D6A4F]/50 hover:border-[#39FF14] cursor-pointer group transition"
                      >
                        <img src={src} alt="Uploaded" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Plus className="w-5 h-5 text-[#39FF14]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
