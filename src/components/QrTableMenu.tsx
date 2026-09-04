import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Trash2, Edit2, Check, X, Printer, QrCode,
  Copy, ExternalLink, Utensils, Sparkles, RefreshCw, Flame,
  Share2, ArrowLeft, ArrowRight, Shield, Download
} from 'lucide-react';
import { Language, RestaurantInfoType } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

export interface QrMenuItemRow {
  id: string;
  name: string;
  price: number;
  size: string;
  calories: number;
  category?: string;
}

const DEFAULT_QR_MENU_ITEMS: QrMenuItemRow[] = [
  { id: 'qr-1', name: 'نفر مندي لحم ضأن بلدي مع الرز الشعبي', price: 78, size: 'نفر (1-2 شخص)', calories: 1250, category: 'ولائم ومندي' },
  { id: 'qr-2', name: 'نصف حبة مندي دجاج محمر مع الرز', price: 26, size: 'نصف حبة', calories: 780, category: 'ولائم ومندي' },
  { id: 'qr-3', name: 'حبة كاملة مندي دجاج على الحطب', price: 48, size: 'حبة كاملة', calories: 1560, category: 'ولائم ومندي' },
  { id: 'qr-4', name: 'حنيذ لحم تيس بلدي في التنور', price: 82, size: 'نفر', calories: 1190, category: 'ولائم ومندي' },
  { id: 'qr-5', name: 'مدفون لحم بالقصدير على الجمر', price: 86, size: 'نفر', calories: 1260, category: 'ولائم ومندي' },
  { id: 'qr-6', name: 'كبسة حاشي برية بالرز النثري', price: 65, size: 'نفر', calories: 1180, category: 'ولائم ومندي' },
  { id: 'qr-7', name: 'فحسة لحم بلدي بالمقلى الحجري (تفور بالحلبة)', price: 32, size: 'مقلى حجر', calories: 680, category: 'فخاريات حجرية' },
  { id: 'qr-8', name: 'سلتة تراثية تقليدية بالمقلى الحجري', price: 24, size: 'مقلى حجر', calories: 490, category: 'فخاريات حجرية' },
  { id: 'qr-9', name: 'عقدة دجاج صعدة بالخضار والتوابل', price: 28, size: 'صحن وسط', calories: 540, category: 'فخاريات حجرية' },
  { id: 'qr-10', name: 'كبدة حاشي طازجة على الصاج', price: 32, size: 'صحن صاج', calories: 420, category: 'صاج ومقلقل' },
  { id: 'qr-11', name: 'مقلقل لحم غنم بلدي بالطماطم والفلفل', price: 34, size: 'صحن صاج', calories: 580, category: 'صاج ومقلقل' },
  { id: 'qr-12', name: 'تقاطيع ولحم راس متبل ومحمر', price: 28, size: 'صحن', calories: 510, category: 'صاج ومقلقل' },
  { id: 'qr-13', name: 'فول قلابة جمرية بالسمن والكمون', price: 14, size: 'فخار', calories: 340, category: 'إفطار وشعبيات' },
  { id: 'qr-14', name: 'شكشوكة عدنية بالجبن البلدي', price: 16, size: 'صحن', calories: 380, category: 'إفطار وشعبيات' },
  { id: 'qr-15', name: 'مطبق لحم مفروم مقرمش بالفرن', price: 15, size: 'حبة مقطعة', calories: 450, category: 'إفطار وشعبيات' },
  { id: 'qr-16', name: 'خبز ملوح يمني طازج من التنور', price: 3, size: 'رغيف كبير', calories: 290, category: 'مخبوزات التنور' },
  { id: 'qr-17', name: 'عريكة ملكي بالقشطة والعسل البلدي والتمر', price: 26, size: 'صحن ملكي', calories: 880, category: 'حلا ومعصوب' },
  { id: 'qr-18', name: 'معصوب بالقشطة والعسل والموز', price: 22, size: 'صحن', calories: 720, category: 'حلا ومعصوب' },
  { id: 'qr-19', name: 'بنت الصحن بالسمن البلدي والعسل', price: 28, size: 'طبق دائري', calories: 690, category: 'حلا ومعصوب' },
  { id: 'qr-20', name: 'براد شاي عدني كرك بالهيل والزعفران', price: 12, size: 'براد وسط', calories: 160, category: 'مشروبات ساخنة' },
  { id: 'qr-21', name: 'قهوة قشر يمنية بالزنجبيل والقرفة', price: 10, size: 'دلة صغيرة', calories: 45, category: 'مشروبات ساخنة' }
];

interface QrTableMenuProps {
  lang: Language;
  onReturnToHome: () => void;
  isAdmin?: boolean;
  restaurantInfo?: RestaurantInfoType;
}

export const QrTableMenu: React.FC<QrTableMenuProps> = ({
  lang,
  onReturnToHome,
  isAdmin = false,
  restaurantInfo
}) => {
  const isAr = lang === 'ar';
  const info = restaurantInfo || RESTAURANT_INFO;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Table items state with localStorage persistence
  const [items, setItems] = useState<QrMenuItemRow[]>(() => {
    try {
      const saved = localStorage.getItem('al_bait_qr_table_menu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading QR table menu', e);
    }
    return DEFAULT_QR_MENU_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('al_bait_qr_table_menu', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving QR table menu', e);
    }
  }, [items]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // New Row Form Modal / Drawer (for admin)
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [newCategory, setNewCategory] = useState('أطباق رئيسية');
  const [rowError, setRowError] = useState('');

  // Editing Row Inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editCalories, setEditCalories] = useState('');

  // Categories extraction
  const categories = Array.from(new Set(items.map((it) => it.category || (isAr ? 'أطباق عامة' : 'General'))));

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.size.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (item: QrMenuItemRow) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditSize(item.size);
    setEditCalories(item.calories ? item.calories.toString() : '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const priceNum = parseFloat(editPrice) || 0;
    const calNum = parseInt(editCalories, 10) || 0;

    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              name: editName.trim(),
              price: priceNum,
              size: editSize.trim() || (isAr ? 'عادي' : 'Regular'),
              calories: calNum
            }
          : it
      )
    );
    setEditingId(null);
  };

  const handleDeleteRow = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الصنف من جدول المنيو؟' : 'Are you sure you want to delete this row?')) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const handleAddNewRow = (e: React.FormEvent) => {
    e.preventDefault();
    setRowError('');

    if (!newName.trim()) {
      setRowError(isAr ? 'يرجى إدخال اسم الصنف' : 'Please enter dish name');
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setRowError(isAr ? 'يرجى إدخال سعر صحيح بالأرقام' : 'Please enter a valid numeric price');
      return;
    }

    const calNum = parseInt(newCalories, 10) || 0;

    const newRow: QrMenuItemRow = {
      id: `qr-${Date.now()}`,
      name: newName.trim(),
      price: priceNum,
      size: newSize.trim() || (isAr ? 'نفر' : 'Standard'),
      calories: calNum,
      category: newCategory
    };

    setItems((prev) => [newRow, ...prev]);
    setNewName('');
    setNewPrice('');
    setNewSize('');
    setNewCalories('');
    setIsAddingRow(false);
  };

  const handleResetToDefaults = () => {
    if (window.confirm(isAr ? 'هل تريد استعادة الجدول الافتراضي المعبأ مسبقاً؟' : 'Reset to default menu table?')) {
      setItems(DEFAULT_QR_MENU_ITEMS);
    }
  };

  const handleClearAllRows = () => {
    if (window.confirm(isAr ? 'هل تريد إفراغ الجدول بالكامل لتبدأ بتعبئته من الصفر؟' : 'Clear all rows to start empty?')) {
      setItems([]);
    }
  };

  // Direct QR Link URL
  const qrMenuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?view=qr-menu`
    : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(qrMenuUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }).catch(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // SVG QR Code generator (fallback high quality vector pattern)
  // Using public QR API for instant real working scannable QR image
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrMenuUrl)}&margin=10`;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#141414] print:bg-white print:text-black">
      
      {/* Top Utility Header (Hidden when printing) */}
      <header className="sticky top-0 z-40 bg-[#141414] text-white border-b border-[#d4af37]/40 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <button
            onClick={onReturnToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#d4af37] hover:text-[#ffe38a] transition-colors cursor-pointer"
          >
            <ArrowIcon className="w-4 h-4 rtl:rotate-180" />
            <span>{isAr ? 'العودة للموقع والصور' : 'Visit Full Website'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-[#d4af37] text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isAr ? 'نسخ رابط الباركود للطاولات' : 'Copy Table QR Link'}
            >
              <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'رابط الباركود' : 'QR Link')}</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isAr ? 'عرض رمز QR' : 'Show QR'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isAr ? 'طباعة القائمة' : 'Print Table Menu'}
            >
              <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">{isAr ? 'طباعة' : 'Print'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-8">
        
        {/* Restaurant Header Card for Table QR Scan */}
        <div className="text-center space-y-3 pb-6 border-b-2 border-dashed border-stone-300">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#141414] border-2 border-[#d4af37] text-[#d4af37] shadow-sm mb-1">
            <Utensils className="w-7 h-7" />
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#141414] font-heading tracking-tight">
            {isAr ? 'قائمة طعام شعبيات البيت الريفي' : 'Shaabiyat Al-Bait Al-Reefi Table Menu'}
          </h1>
          
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-xl mx-auto">
            {isAr
              ? 'المقر الحصري والوحيد بالرياض • ولائم المندي، الحنيذ، الفخاريات الحجرية، والصاج والشعبيات • خدمة 24 ساعة'
              : 'Exclusive Riyadh Flagship • Wood-Fired Mandi, Sizzling Stone Pots & Fresh Banquets • Open 24 Hours'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-700 pt-1">
            <span className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
              📞 {info.phoneDisplay}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              💬 واتساب: {info.whatsapp}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              📍 الرياض (المقر الحصري)
            </span>
          </div>

          <div className="pt-2 text-[11px] text-stone-500 italic print:hidden">
            {isAr ? '💡 هذا الجدول مخصص لقراء باركود الطاولات السريع؛ يعرض اسم الصنف، السعر، الحجم، والسعرات.' : '💡 Simplified QR table menu displaying dish names, prices, portion sizes, and calories.'}
          </div>
        </div>

        {/* Admin Quick Toolbar (When Admin logged in) */}
        {isAdmin && (
          <div className="p-4 rounded-2xl bg-[#141414] text-white border-2 border-[#d4af37] shadow-md flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs font-bold text-[#d4af37]">
                {isAr ? 'أدوات إدارة جدول المنيو (أنت مسجل كمدير):' : 'Table Menu Admin Tools:'}
              </span>
              <span className="text-[11px] text-stone-300">
                {isAr ? 'تستطيع تعبئة وتعديل وحذف أي خانة فوراً' : 'Edit, add, and customize rows directly'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAddingRow(true)}
                className="px-3 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{isAr ? 'إضافة صنف للجدول' : 'Add Dish'}</span>
              </button>

              <button
                onClick={handleResetToDefaults}
                className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-[#d4af37] text-stone-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title={isAr ? 'استعادة الجدول الجاهز' : 'Reset defaults'}
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'استعادة الافتراضي' : 'Reset'}</span>
              </button>

              <button
                onClick={handleClearAllRows}
                className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title={isAr ? 'إفراغ الجدول للبدء من الصفر' : 'Clear all'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'إفراغ الجدول' : 'Clear'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Search & Category Filter (Hidden in print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في أصناف المنيو...' : 'Search dish name or size...'}
              className="w-full ps-10 pe-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#d4af37] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#141414] text-[#d4af37]'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {isAr ? 'جميع الأصناف' : 'All'} ({items.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#141414] text-[#d4af37]'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* The Clean Minimal Menu Table (اسم الصنف | السعر | الحجم | السعرات) */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden print:border-black print:rounded-none">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-[#141414] text-[#d4af37] border-b border-[#d4af37]/40 text-xs sm:text-sm font-bold uppercase tracking-wider print:bg-stone-100 print:text-black">
                  <th className="py-3 px-4 text-start w-8 sm:w-12">#</th>
                  <th className="py-3 px-4 text-start font-heading">
                    {isAr ? 'اسم الصنف' : 'Dish Name'}
                  </th>
                  <th className="py-3 px-4 text-center font-heading w-24 sm:w-28">
                    {isAr ? 'السعر (ر.س)' : 'Price (SAR)'}
                  </th>
                  <th className="py-3 px-4 text-center font-heading w-24 sm:w-32">
                    {isAr ? 'الحجم' : 'Portion / Size'}
                  </th>
                  <th className="py-3 px-4 text-center font-heading w-24 sm:w-28">
                    {isAr ? 'السعرات' : 'Calories'}
                  </th>
                  {isAdmin && (
                    <th className="py-3 px-4 text-center w-24 print:hidden">
                      {isAr ? 'إجراء' : 'Actions'}
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm font-medium text-stone-800">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-stone-400">
                      <Utensils className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-bold text-sm text-stone-600">
                        {isAr ? 'الجدول فارغ حالياً' : 'No items in the menu table'}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {isAdmin
                          ? (isAr ? 'اضغط على زر "إضافة صنف للجدول" باللون الذهبي أعلاه للبدء بالتعبئة' : 'Click "Add Dish" above to populate rows')
                          : (isAr ? 'لم يتم العثور على أطباق مطابقة للبحث' : 'No matching items')}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isEditing = editingId === item.id;

                    if (isEditing) {
                      return (
                        <tr key={item.id} className="bg-amber-50/70">
                          <td className="py-3 px-3 text-stone-400 text-center">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-[#d4af37] rounded-md text-xs sm:text-sm font-bold focus:outline-none"
                              placeholder={isAr ? 'اسم الصنف...' : 'Dish name...'}
                              autoFocus
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 text-center bg-white border border-[#d4af37] rounded-md text-xs sm:text-sm font-bold focus:outline-none"
                              min="0"
                              step="0.5"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="text"
                              value={editSize}
                              onChange={(e) => setEditSize(e.target.value)}
                              className="w-24 px-2 py-1 text-center bg-white border border-[#d4af37] rounded-md text-xs sm:text-sm focus:outline-none"
                              placeholder={isAr ? 'الحجم...' : 'Size...'}
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              value={editCalories}
                              onChange={(e) => setEditCalories(e.target.value)}
                              className="w-20 px-2 py-1 text-center bg-white border border-[#d4af37] rounded-md text-xs sm:text-sm focus:outline-none"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3 text-center print:hidden">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                title={isAr ? 'حفظ' : 'Save'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 rounded-lg bg-stone-300 hover:bg-stone-400 text-stone-700 cursor-pointer"
                                title={isAr ? 'إلغاء' : 'Cancel'}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-amber-50/40 transition-colors group print:hover:bg-transparent"
                      >
                        <td className="py-3 px-4 text-stone-400 font-mono text-xs text-start">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 text-start font-bold text-[#141414]">
                          <span>{item.name}</span>
                          {item.category && selectedCategory === 'all' && (
                            <span className="ms-2 inline-block text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 font-normal print:hidden">
                              {item.category}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-[#b8860b] whitespace-nowrap">
                          {item.price} <span className="text-[11px] font-medium text-stone-500">{isAr ? 'ر.س' : 'SAR'}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-stone-600 text-xs sm:text-sm whitespace-nowrap">
                          {item.size || '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-stone-600 text-xs sm:text-sm whitespace-nowrap">
                          {item.calories ? (
                            <span className="inline-flex items-center gap-1">
                              <span>{item.calories}</span>
                              <span className="text-[10px] text-stone-400">{isAr ? 'سعرة' : 'kcal'}</span>
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4 text-center print:hidden">
                            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#d4af37]/20 text-stone-700 hover:text-[#b8860b] transition-colors cursor-pointer"
                                title={isAr ? 'تعديل هذا الصنف' : 'Edit row'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRow(item.id)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors cursor-pointer"
                                title={isAr ? 'حذف من الجدول' : 'Delete row'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary Footer */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <span>
              {isAr
                ? `إجمالي الأصناف المعروضة: ${filteredItems.length} صنف`
                : `Total listed dishes: ${filteredItems.length}`}
            </span>
            <span className="print:hidden">
              {isAr
                ? 'الأسعار شاملة ضريبة القيمة المضافة • يُطهى طازجاً يومياً'
                : 'All prices inclusive of VAT • Fresh daily'}
            </span>
          </div>
        </div>

        {/* Printable/Save QR Code Modal / View */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#d4af37] text-center space-y-5">
              
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 end-4 p-2 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#b8860b] text-xs font-bold">
                  <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isAr ? 'باركود الطاولات السريع' : 'Table QR Code'}</span>
                </span>
                <h3 className="text-xl font-extrabold text-[#141414] font-heading">
                  {isAr ? 'رمز الباركود الخاص بطاولات المطعم' : 'Restaurant Table QR Code'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isAr
                    ? 'اطبع هذا الرمز وضعه كملصق على الطاولات؛ عند مسحه بكاميرا الجوال سيفتح هذا الجدول مباشرة للزائر بدون الحاجة لتصفح الموقع كاملاً.'
                    : 'Print and place this QR on dining tables. Scanning opens this clean table menu directly.'}
                </p>
              </div>

              {/* QR Image Box */}
              <div className="p-4 bg-white border-2 border-dashed border-[#d4af37] rounded-2xl inline-block shadow-inner">
                <img
                  src={qrApiUrl}
                  alt="QR Menu Link"
                  className="w-56 h-56 mx-auto rounded-lg"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-mono text-stone-500 break-all bg-stone-100 p-2 rounded-xl">
                  {qrMenuUrl}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#141414] text-[#d4af37] hover:bg-stone-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedLink ? (isAr ? 'تم نسخ الرابط!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isAr ? 'طباعة' : 'Print'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Row Modal (Admin) */}
        {isAddingRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#d4af37] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#141414] text-[#d4af37] flex items-center justify-center">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <h3 className="text-base font-bold text-[#141414] font-heading">
                    {isAr ? 'إضافة صنف جديد لجدول المنيو' : 'Add New Row to Menu Table'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddingRow(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {rowError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {rowError}
                </div>
              )}

              <form onSubmit={handleAddNewRow} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'اسم الصنف *' : 'Dish Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={isAr ? 'مثال: مندي لحم ضأن بلدي' : 'e.g. Lamb Mandi Platter'}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'السعر (ر.س) *' : 'Price (SAR) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.5"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder={isAr ? 'مثال: 78' : '78'}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'الحجم / الكمية' : 'Size / Portion'}
                    </label>
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder={isAr ? 'مثال: نفر / صحن وسط / حبة' : 'e.g. 1 Person / Full'}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'السعرات الحرارية' : 'Calories (kcal)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newCalories}
                      onChange={(e) => setNewCalories(e.target.value)}
                      placeholder={isAr ? 'مثال: 850' : '850'}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'تصنيف الصنف' : 'Category'}
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder={isAr ? 'مثال: ولائم ومندي' : 'Mandi & Banquets'}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingRow(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#ffe38a] text-[#141414] text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
                  >
                    {isAr ? 'إضافة للجدول الآن' : 'Add to Table'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Footer Note */}
      <footer className="py-6 border-t border-stone-200 text-center text-xs text-stone-500 print:text-black">
        <p className="font-bold text-[#141414]">
          {isAr ? 'مطعم شعبيات البيت الريفي - المقر الحصري بالرياض' : 'Shaabiyat Al-Bait Al-Reefi - Exclusive Riyadh Flagship'}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">
          {isAr ? 'هاتف: ' : 'Phone: '} {info.phoneDisplay} • {info.openingHoursAr}
        </p>
      </footer>

    </div>
  );
};
