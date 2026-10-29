/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Sparkles, Check, Keyboard } from 'lucide-react';
import { BRAND_COLORS, COLOR_SWATCHES } from '../data/assets';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1A12] border border-[#2D6A4F] rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl text-[#FAF6F0]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D6A4F]/40 flex items-center justify-between bg-[#0A130D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#0E1A12] border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14] font-kufam font-black text-xl">
              ل
            </div>
            <div>
              <h2 className="font-kufam font-black text-base sm:text-lg">
                دليل هوية نظام القصص لـ "لَمّاح | LAMMA7"
              </h2>
              <p className="text-xs text-[#A5D6A7]/70">
                Instagram Story Design System & Visual Guidelines
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-[#FAF6F0]">
          {/* Section 1: Official Colors */}
          <div className="space-y-3">
            <h3 className="font-kufam font-bold text-sm text-[#39FF14] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#39FF14]"></span>
              <span>1. لوحة الألوان الرسمية للمشروع (Official Brand Palette)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#2E7D32] mb-2 shadow"></div>
                <div className="font-bold text-xs">Primary Green</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#2E7D32</div>
                <div className="text-[10px] text-[#A5D6A7]/60">الأخضر الأساسي</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#66BB6A] mb-2 shadow"></div>
                <div className="font-bold text-xs text-[#14261B]">Secondary Green</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#66BB6A</div>
                <div className="text-[10px] text-[#A5D6A7]/60">أخضر الأوراق النضرة</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#795548] mb-2 shadow"></div>
                <div className="font-bold text-xs">Soil Brown</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#795548</div>
                <div className="text-[10px] text-[#A5D6A7]/60">بني التربة الزراعية</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#39FF14] mb-2 shadow"></div>
                <div className="font-bold text-xs text-[#0E1A12]">Electric Lime (CV)</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#39FF14</div>
                <div className="text-[10px] text-[#A5D6A7]/60">رؤية الحاسب والكشف</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#0E1A12] border border-white/20 mb-2"></div>
                <div className="font-bold text-xs">Deep Forest</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#0E1A12</div>
                <div className="text-[10px] text-[#A5D6A7]/60">الخلفية الداكنة العميقة</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#FAF6F0] mb-2 shadow"></div>
                <div className="font-bold text-xs text-[#0E1A12]">Warm Cream</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#FAF6F0</div>
                <div className="text-[10px] text-[#A5D6A7]/60">أبيض كريمي ناعم للنصوص</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#1B2E21] mb-2"></div>
                <div className="font-bold text-xs">Earth Olive</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#1B2E21</div>
                <div className="text-[10px] text-[#A5D6A7]/60">زيتوني البطاقات والأسطح</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50">
                <div className="h-10 rounded-xl bg-[#2D6A4F] mb-2"></div>
                <div className="font-bold text-xs">Botanical Green</div>
                <div className="font-mono text-[10px] text-[#A5D6A7]">#2D6A4F</div>
                <div className="text-[10px] text-[#A5D6A7]/60">أخضر نباتي للإطارات</div>
              </div>
            </div>
          </div>

          {/* Section 2: Typography & Philosophy */}
          <div className="space-y-3 pt-3 border-t border-[#2D6A4F]/40">
            <h3 className="font-kufam font-bold text-sm text-[#39FF14] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#39FF14]"></span>
              <span>2. القواعد الطبوغرافية وهوية الخطوط العربية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50 space-y-1.5">
                <div className="font-kufam font-black text-xl text-[#FAF6F0]">خط العناوين: Kufam</div>
                <p className="text-[11px] text-[#C8E6C9] leading-relaxed">
                  خط عربي كوفي هندسي متقن يجمع بين الأصالة العربية والطابع التقني لروبوتات الذكاء الاصطناعي.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#14261B] border border-[#2D6A4F]/50 space-y-1.5">
                <div className="font-readex font-bold text-lg text-[#FAF6F0]">خط الشروح: Readex Pro</div>
                <p className="text-[11px] text-[#C8E6C9] leading-relaxed">
                  خط حديث ومريح للغاية في القراءة على شاشات الجوال وقصص إنستغرام السريعة.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Keyboard Shortcuts */}
          <div className="space-y-3 pt-3 border-t border-[#2D6A4F]/40">
            <h3 className="font-kufam font-bold text-sm text-[#39FF14] flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              <span>3. اختصارات لوحة المفاتيح في المحرر (Shortcuts)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#2D6A4F]/30 flex justify-between items-center">
                <span>تراجع عن التعديل (Undo)</span>
                <kbd className="px-2 py-0.5 bg-[#0A130D] rounded border border-white/20 font-mono text-white">Ctrl + Z</kbd>
              </div>
              <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#2D6A4F]/30 flex justify-between items-center">
                <span>إعادة التعديل (Redo)</span>
                <kbd className="px-2 py-0.5 bg-[#0A130D] rounded border border-white/20 font-mono text-white">Ctrl + Y</kbd>
              </div>
              <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#2D6A4F]/30 flex justify-between items-center">
                <span>مضاعفة العنصر المحدد</span>
                <kbd className="px-2 py-0.5 bg-[#0A130D] rounded border border-white/20 font-mono text-white">Ctrl + D</kbd>
              </div>
              <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#2D6A4F]/30 flex justify-between items-center">
                <span>حذف العنصر المحدد</span>
                <kbd className="px-2 py-0.5 bg-[#0A130D] rounded border border-white/20 font-mono text-white">Delete / Backspace</kbd>
              </div>
              <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#2D6A4F]/30 flex justify-between items-center">
                <span>تحريك دقيق للعنصر (1px)</span>
                <kbd className="px-2 py-0.5 bg-[#0A130D] rounded border border-white/20 font-mono text-white">الأسهم Arrow Keys</kbd>
              </div>
              <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#2D6A4F]/30 flex justify-between items-center">
                <span>تحريك سريع للعنصر (10px)</span>
                <kbd className="px-2 py-0.5 bg-[#0A130D] rounded border border-white/20 font-mono text-white">Shift + الأسهم</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
