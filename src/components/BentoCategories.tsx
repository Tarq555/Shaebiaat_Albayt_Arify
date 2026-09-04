import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Category, CategoryId, Language } from '../types';
import { CATEGORIES, IMAGES } from '../data/restaurantData';

interface BentoCategoriesProps {
  categories?: Category[];
  onSelectCategory: (categoryId: CategoryId) => void;
  lang: Language;
}

export const BentoCategories: React.FC<BentoCategoriesProps> = ({
  categories = CATEGORIES,
  onSelectCategory,
  lang
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="py-12 sm:py-16 bg-[#faf9f6] border-y border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b8860b]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              {isAr ? 'أقسام المطبخ اليمني التراثي' : 'Traditional Cuisine Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
              {isAr ? 'روائع المائدة والولائم الشعبية' : 'Explore Our Traditional Specialties'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl">
              {isAr
                ? 'تشكيلة متكاملة من أشهى ما جادت به المطابخ الشعبية واليمنية في مقرنا الحصري بالرياض.'
                : 'A curated selection from timeless heritage recipes prepared daily at our exclusive Riyadh flagship.'}
            </p>
          </div>

          <button
            id="view-all-categories-btn"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#141414] hover:text-[#b8860b] group self-start md:self-auto cursor-pointer"
          >
            <span>{isAr ? 'عرض كامل القائمة' : 'View Full Menu'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-[#d4af37]" />
          </button>
        </div>

        {/* Dynamic Bento & Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            let colSpan = 'lg:col-span-4';
            let minHeight = 'min-h-[260px]';
            
            // Logic for Bento Box layout pattern
            if (index === 0) {
              colSpan = 'lg:col-span-7 md:col-span-2';
              minHeight = 'min-h-[300px] sm:min-h-[340px]';
            } else if (index === 1) {
              colSpan = 'lg:col-span-5 md:col-span-2';
              minHeight = 'min-h-[300px] sm:min-h-[340px]';
            } else if (index % 5 === 0 || index % 5 === 1) {
              colSpan = 'lg:col-span-6 md:col-span-2';
            }

            return (
              <div
                key={cat.id}
                id={`bento-category-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(cat.id);
                  }
                }}
                className={`${colSpan} group relative rounded-3xl overflow-hidden cursor-pointer bg-white border border-[#d4af37]/30 shadow-sm hover:shadow-xl hover:border-[#d4af37] transition-all duration-300 ${minHeight} flex flex-col justify-end p-5 sm:p-6 focus:outline-none focus:ring-2 focus:ring-[#d4af37]`}
              >
                <img
                  src={cat.image || IMAGES.saltahBento}
                  alt={isAr ? cat.nameAr : cat.nameEn}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Prevent infinite loop if fallback image is also broken
                    if (target.src !== IMAGES.saltahBento) {
                      target.src = IMAGES.saltahBento;
                    }
                  }}
                />
                
                {/* Fixed the opacity value here (from black/92 to black/90) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="relative z-10 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {cat.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-sm">
                        {cat.badge}
                      </span>
                    )}
                    {cat.count !== undefined && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                        {isAr ? `${cat.count} أصناف` : `${cat.count} Items`}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading group-hover:text-[#d4af37] transition-colors">
                    {isAr ? cat.nameAr : cat.nameEn}
                  </h3>

                  {(cat.descriptionAr || cat.descriptionEn) && (
                    <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-xl font-body">
                      {isAr ? cat.descriptionAr : cat.descriptionEn}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#d4af37] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{isAr ? `تصفح أطباق ${cat.nameAr}` : `Explore ${cat.nameEn}`}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
