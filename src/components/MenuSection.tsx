import React, { useState, useMemo } from 'react';
import {
  Search, Flame, Sparkles, Plus, Star, Clock, Users,
  MapPin, Check, Soup, UtensilsCrossed, Cookie, Award, Coffee,
  Edit3, Fish, Heart, Sun, Zap, Salad, ChefHat, Eye, MessageCircle, Crown as CrownIcon,
  BookOpen
} from 'lucide-react';
import { MenuItem, CategoryId, Category, Language, Currency, CartItem } from '../types';
import { CATEGORIES, RESTAURANT_INFO } from '../data/restaurantData';
import { formatPrice } from '../utils/currency';

interface MenuSectionProps {
  menuItems: MenuItem[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onSelectDish: (dish: MenuItem) => void;
  onQuickAddToCart: (dish: MenuItem) => void;
  cartItems: CartItem[];
  lang: Language;
  currency: Currency;
  isAdmin?: boolean;
  onEditDishAdmin?: (dish: MenuItem) => void;
  categories?: Category[];
  catalogOnlyMode?: boolean;
  showPrices?: boolean;
  whatsappNumber?: string;
  onOpenReadyMenu?: () => void;
  enableReadyMenu?: boolean;
  readyMenuTitle?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  selectedCategory,
  onSelectCategory,
  onSelectDish,
  onQuickAddToCart,
  cartItems,
  lang,
  currency,
  isAdmin = false,
  onEditDishAdmin,
  categories = CATEGORIES,
  catalogOnlyMode = true,
  showPrices = true,
  whatsappNumber = RESTAURANT_INFO.whatsapp,
  onOpenReadyMenu,
  enableReadyMenu = true,
  readyMenuTitle
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'chef' | 'spicy' | 'veg'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Feature toggle filter
      if (activeFilter === 'popular' && !item.isPopular) return false;
      if (activeFilter === 'chef' && !item.isChefSpecial) return false;
      if (activeFilter === 'spicy' && !item.isSpicy) return false;
      if (activeFilter === 'veg' && !item.isVegetarian) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitleAr = item.titleAr.toLowerCase().includes(q);
        const matchTitleEn = item.titleEn.toLowerCase().includes(q);
        const matchDescAr = item.descAr.toLowerCase().includes(q);
        const matchDescEn = item.descEn.toLowerCase().includes(q);
        const matchRegion = (item.originRegion || '').toLowerCase().includes(q);
        return matchTitleAr || matchTitleEn || matchDescAr || matchDescEn || matchRegion;
      }

      return true;
    });
  }, [menuItems, selectedCategory, activeFilter, searchQuery]);

  const handleQuickAdd = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    onQuickAddToCart(dish);
    setRecentlyAddedId(dish.id);
    setTimeout(() => setRecentlyAddedId(null), 800);
  };

  const getCartQuantity = (dishId: string) => {
    const found = cartItems.find((c) => c.dish.id === dishId);
    return found ? found.quantity : 0;
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Soup': return <Soup className="w-4 h-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Cookie': return <Cookie className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Fish': return <Fish className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Sun': return <Sun className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Salad': return <Salad className="w-4 h-4" />;
      case 'ChefHat': return <ChefHat className="w-4 h-4" />;
      default: return <UtensilsCrossed className="w-4 h-4" />;
    }
  };

  const currentCategoryMeta = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="menu-section" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf9f6] border border-[#d4af37]/30 text-[#b8860b] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isAr ? 'كتالوج الأطباق الفاخرة' : 'Signature Culinary Catalog'}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
            {isAr ? 'قائمة الطعام والولائم الأصيلة' : 'Heritage Dishes & Feasts Menu'}
          </h2>
          
          <p className="text-sm sm:text-base text-stone-600 font-body">
            {isAr
              ? 'مُطهوة على حطب السمر الطبيعي وبالأواني الفخارية والصخرية البركانية الفائرة.'
              : 'Slow-smoked over natural desert wood in traditional clay ovens and bubbling stone pots.'}
          </p>
        </div>

        {/* Search & Quick Feature Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#faf9f6] border border-[#d4af37]/25 shadow-xs">
          
          {/* Search Input & Ready Menu Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 grow max-w-xl">
            <div className="relative grow">
              <input
                id="menu-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن طبق (مندي، فحسة، كبدة، معصوب...)' : 'Search dishes (Mandi, Fahsa, Liver...)'}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#141414] placeholder:text-stone-400 focus:outline-hidden focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
              <Search className="w-4 h-4 text-[#b8860b] absolute start-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {enableReadyMenu && onOpenReadyMenu && (
              <button
                id="menu-open-ready-brochure-btn"
                type="button"
                onClick={onOpenReadyMenu}
                className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
                title={isAr ? 'استعراض قائمة الطعام الجاهزة' : 'View Ready Menu'}
              >
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                <span>{isAr ? (readyMenuTitle || 'المنيو الجاهز (بروشور)') : (readyMenuTitle || 'Ready Menu Brochure')}</span>
              </button>
            )}
          </div>

          {/* Feature Badges Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'popular'
                  ? 'bg-[#d4af37] text-[#141414] font-extrabold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {isAr ? 'الأكثر طلباً' : 'Popular'}
            </button>
            <button
              onClick={() => setActiveFilter('chef')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'chef'
                  ? 'bg-[#d4af37] text-[#141414] font-extrabold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {isAr ? 'اختيار الشيف' : "Chef's Pick"}
            </button>
            <button
              onClick={() => setActiveFilter('spicy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'spicy'
                  ? 'bg-[#d4af37] text-[#141414] font-extrabold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {isAr ? 'حار 🌶️' : 'Spicy 🌶️'}
            </button>
            <button
              onClick={() => setActiveFilter('veg')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'veg'
                  ? 'bg-[#d4af37] text-[#141414] font-extrabold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {isAr ? 'نباتي' : 'Vegetarian'}
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            id="category-pill-all"
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                : 'bg-[#faf9f6] text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
            <span>{isAr ? 'كافة الأقسام' : 'All Categories'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/15">
              {menuItems.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const countInCat = menuItems.filter((i) => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                    : 'bg-[#faf9f6] text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="text-[#d4af37]">{getCategoryIcon(cat.iconName || 'UtensilsCrossed')}</span>
                <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-800">
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner if single category selected */}
        {currentCategoryMeta && selectedCategory !== 'all' && (
          <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#141414] font-heading flex items-center gap-2">
                <span className="text-[#d4af37]">{getCategoryIcon(currentCategoryMeta.iconName || 'UtensilsCrossed')}</span>
                <span>{isAr ? currentCategoryMeta.nameAr : currentCategoryMeta.nameEn}</span>
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {isAr ? currentCategoryMeta.descriptionAr : currentCategoryMeta.descriptionEn}
              </p>
            </div>
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-bold text-[#b8860b] hover:underline shrink-0 cursor-pointer"
            >
              {isAr ? 'عرض الكل' : 'Show All'}
            </button>
          </div>
        )}

        {/* Dishes Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#faf9f6] border border-dashed border-stone-300">
            <UtensilsCrossed className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#141414] mb-1 font-heading">
              {isAr ? 'لم يتم العثور على أطباق مطابقة' : 'No Dishes Found'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isAr ? 'جرب البحث بكلمات أخرى أو اختر قسماً آخر.' : 'Try searching for other keywords or clear filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                onSelectCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#141414] text-[#d4af37] text-xs font-bold hover:bg-black transition-colors border border-[#d4af37]/40 cursor-pointer"
            >
              {isAr ? 'إعادة ضبط عوامل التصفية' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((dish) => {
              const inCartQty = getCartQuantity(dish.id);
              const isJustAdded = recentlyAddedId === dish.id;

              return (
                <div
                  key={dish.id}
                  id={`dish-card-${dish.id}`}
                  onClick={() => onSelectDish(dish)}
                  className="group relative bg-white rounded-3xl border border-[#d4af37]/30 hover:border-[#d4af37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Dish Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={dish.image}
                      alt={isAr ? dish.titleAr : dish.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Feature Badges */}
                    <div className="absolute top-2.5 start-2.5 flex flex-col gap-1 z-10">
                      {dish.isChefSpecial && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs flex items-center gap-1">
                          <CrownIcon className="w-3 h-3 text-[#d4af37]" />
                          <span>{isAr ? 'اختيار الشيف' : "Chef's Pick"}</span>
                        </span>
                      )}
                      {dish.isPopular && !dish.isChefSpecial && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#d4af37] text-[#141414] shadow-xs">
                          {isAr ? 'الأكثر طلباً' : 'Popular'}
                        </span>
                      )}
                      {dish.isSpicy && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs">
                          {isAr ? 'حار 🌶️' : 'Spicy 🌶️'}
                        </span>
                      )}
                    </div>

                    {/* Direct Admin Edit Button */}
                    {isAdmin && onEditDishAdmin && (
                      <button
                        type="button"
                        id={`admin-edit-btn-${dish.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDishAdmin(dish);
                        }}
                        className="absolute top-2.5 end-2.5 z-20 p-2 rounded-xl bg-black/85 hover:bg-black text-[#d4af37] backdrop-blur-xs border border-[#d4af37]/50 shadow-md transition-transform hover:scale-110 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                        title={isAr ? 'تعديل هذا الطبق في لوحة التحكم' : 'Edit Dish in Admin'}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isAr ? 'تعديل' : 'Edit'}</span>
                      </button>
                    )}

                    {/* Origin Region Pill */}
                    {dish.originRegion && (
                      <div className="absolute bottom-2.5 start-2.5 z-10 flex items-center gap-1 text-[11px] text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <MapPin className="w-3 h-3 text-[#d4af37]" />
                        <span>{dish.originRegion}</span>
                      </div>
                    )}
                  </div>

                  {/* Dish Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#141414] group-hover:text-[#b8860b] transition-colors line-clamp-1 font-heading">
                          {isAr ? dish.titleAr : dish.titleEn}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#b8860b] shrink-0 bg-[#faf9f6] px-2 py-0.5 rounded-md border border-[#d4af37]/30">
                          <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                          <span>{dish.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
                        {isAr ? dish.descAr : dish.descEn}
                      </p>
                    </div>

                    {/* Metadata Specs */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#b8860b]" />
                        <span>{dish.prepTimeMinutes} {isAr ? 'د' : 'min'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#b8860b]" />
                        <span>{dish.serves}</span>
                      </div>
                    </div>

                    {/* Price & Action Footer */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 block">{isAr ? 'السعر' : 'Price'}</span>
                        {showPrices ? (
                          <div className="text-base sm:text-lg font-extrabold text-[#141414] font-heading">
                            {formatPrice(dish.price, currency, lang)}
                          </div>
                        ) : (
                          <div className="text-xs font-bold text-[#b8860b]">
                            {isAr ? 'متوفر بالفرع' : 'In Branch'}
                          </div>
                        )}
                      </div>

                      {catalogOnlyMode ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`view-dish-${dish.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDish(dish);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{isAr ? 'استعراض' : 'View'}</span>
                          </button>

                          <a
                            id={`whatsapp-dish-${dish.id}`}
                            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              isAr
                                ? `السلام عليكم، أود الاستفسار وطلب طبق: (${dish.titleAr}) من شعبيات البيت الريفي بالرياض`
                                : `Hello, inquiring about: (${dish.titleEn}) from Shaabiyat Al-Bait Al-Reefi`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center justify-center cursor-pointer"
                            title={isAr ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp'}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <button
                          id={`quick-add-${dish.id}`}
                          onClick={(e) => handleQuickAdd(e, dish)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isJustAdded
                              ? 'bg-emerald-700 text-white scale-95'
                              : inCartQty > 0
                              ? 'bg-[#d4af37] text-[#141414]'
                              : 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 hover:bg-black'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{isAr ? 'أُضيف' : 'Added'}</span>
                            </>
                          ) : inCartQty > 0 ? (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{inCartQty}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isAr ? 'إضافة' : 'Add'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
