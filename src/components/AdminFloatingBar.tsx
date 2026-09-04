import React from 'react';
import { Shield, Plus, Settings, Calendar, LogOut, FolderPlus, QrCode, Users, Eye, Edit3 } from 'lucide-react';
import { Language, AdminTab } from '../types';

interface AdminFloatingBarProps {
  lang: Language;
  onOpenAdmin: (tab?: AdminTab) => void;
  onOpenCreateDish: () => void;
  onOpenQrMenu: () => void;
  onLogout: () => void;
  liveEditMode?: boolean;
  onToggleLiveEdit?: () => void;
}

export const AdminFloatingBar: React.FC<AdminFloatingBarProps> = ({
  lang,
  onOpenAdmin,
  onOpenCreateDish,
  onOpenQrMenu,
  onLogout,
  liveEditMode = true,
  onToggleLiveEdit
}) => {
  const isAr = lang === 'ar';

  return (
    <aside
      aria-label={isAr ? 'شريط تحكم المدير المباشر' : 'Live Admin Control Bar'}
      className="sticky top-0 z-50 bg-[#141414] text-white border-b-2 border-[#d4af37] py-2.5 px-3 sm:px-6 shadow-lg transition-all animate-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Admin Mode Badge & Live In-Context Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
          <div className="flex items-center gap-1.5 font-bold text-[#d4af37]">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'وضع التعديل المباشر مفعّل' : 'Live Visual Edit Active'}</span>
          </div>
          <span className="hidden lg:inline text-[11px] text-stone-300">
            {isAr ? '• تصفح كزائر وعدّل فوراً أي طبق أو صورة بضغطة واحدة' : '• Browse as visitor and edit dishes instantly'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          
          {/* Toggle Live Edit Visual Pencils */}
          {onToggleLiveEdit && (
            <button
              onClick={onToggleLiveEdit}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                liveEditMode
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#ffe38a]'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title={isAr ? 'إظهار/إخفاء أزرار التعديل على الأطباق' : 'Toggle live edit buttons'}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{liveEditMode ? (isAr ? 'أزرار التعديل: ظاهرة' : 'Edit Mode: ON') : (isAr ? 'معاينة كزائر' : 'Visitor View')}</span>
            </button>
          )}

          {/* Quick Add Dish */}
          <button
            id="admin-bar-add-dish-btn"
            onClick={onOpenCreateDish}
            className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isAr ? 'إضافة صنف جديد' : 'Add Item'}</span>
          </button>

          {/* Standalone QR Table Menu */}
          <button
            id="admin-bar-qr-menu-btn"
            onClick={onOpenQrMenu}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-stone-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title={isAr ? 'صفحة جدول منيو الباركود للطاولات' : 'Standalone QR Table Menu'}
          >
            <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isAr ? 'منيو الباركود' : 'QR Menu'}</span>
          </button>

          {/* Marketing Leads & Subscribers */}
          <button
            id="admin-bar-subscribers-btn"
            onClick={() => onOpenAdmin('subscribers')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-stone-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title={isAr ? 'قائمة المشتركين والعروض التسويقية' : 'Subscribers & Marketing Leads'}
          >
            <Users className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">{isAr ? 'المشتركون' : 'Leads'}</span>
          </button>

          {/* Full Admin Dashboard */}
          <button
            id="admin-bar-settings-btn"
            onClick={() => onOpenAdmin('dishes')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-stone-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden md:inline">{isAr ? 'لوحة التحكم الشاملة' : 'Dashboard'}</span>
          </button>

          {/* Logout */}
          <button
            id="admin-bar-logout-btn"
            onClick={onLogout}
            className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title={isAr ? 'تسجيل خروج المدير' : 'Logout Admin'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
