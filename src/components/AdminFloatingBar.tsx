import React from 'react';
import { Shield, Plus, Settings, Calendar, LogOut, FolderPlus } from 'lucide-react';
import { Language, AdminTab } from '../types';

interface AdminFloatingBarProps {
  lang: Language;
  onOpenAdmin: (tab?: AdminTab) => void;
  onOpenCreateDish: () => void;
  onLogout: () => void;
}

export const AdminFloatingBar: React.FC<AdminFloatingBarProps> = ({
  lang,
  onOpenAdmin,
  onOpenCreateDish,
  onLogout
}) => {
  const isAr = lang === 'ar';

  return (
    <aside
      aria-label={isAr ? 'شريط تحكم المدير' : 'Admin Control Bar'}
      className="sticky top-0 z-50 bg-[#141414] text-white border-b border-[#d4af37]/40 py-2.5 px-3 sm:px-6 shadow-md transition-all animate-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Admin Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
          <div className="flex items-center gap-1.5 font-bold text-[#d4af37]">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'وضع المدير مفعّل (Admin Mode)' : 'Admin Mode Active'}</span>
          </div>
          <span className="hidden md:inline text-[11px] text-stone-400">
            {isAr ? '| تحكم شامل بالأصناف، الأقسام، والصور والمحتوى' : '| Full control over dishes, categories, images & info'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            id="admin-bar-add-dish-btn"
            onClick={onOpenCreateDish}
            className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isAr ? 'إضافة صنف جديد' : 'Add Item'}</span>
          </button>

          <button
            id="admin-bar-categories-btn"
            onClick={() => onOpenAdmin('categories')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-stone-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isAr ? 'إدارة الأقسام' : 'Categories'}</span>
          </button>

          <button
            id="admin-bar-reservations-btn"
            onClick={() => onOpenAdmin('reservations')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-stone-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">{isAr ? 'سجل الحجوزات' : 'Reservations'}</span>
          </button>

          <button
            id="admin-bar-settings-btn"
            onClick={() => onOpenAdmin('dishes')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-stone-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
          </button>

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
