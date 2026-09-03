import React, { useState, useEffect } from 'react';
import {
  Sparkles, Maximize2, X, ChevronRight, ChevronLeft,
  Camera, Utensils, Building2, Users, Flame, Award
} from 'lucide-react';
import { Language } from '../types';
import { IMAGES } from '../data/restaurantData';

interface GalleryItem {
  id: string;
  category: 'dishes' | 'interior' | 'majlis' | 'presentation' | 'events';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  image: string;
  tagAr: string;
  tagEn: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    category: 'interior',
    titleAr: 'واجهة ومبنى صرح شعبيات البيت الريفي بالرياض',
    titleEn: 'Riyadh Flagship Landmark Facade',
    descAr: 'المقر المعتمد والفريد بالرياض بتصميم تراثي أصيل يحاكي دفء البيوت الشعبية القديمة.',
    descEn: 'Authentic heritage facade welcoming guests in the heart of Riyadh.',
    image: '/restaurant_building.jpg',
    tagAr: 'المقر والواجهة',
    tagEn: 'Flagship Facade'
  },
  {
    id: 'g-2',
    category: 'dishes',
    titleAr: 'وليمة المندي الملكي بلحم التيس البلدي',
    titleEn: 'Royal Mandi Platter with Local Lamb',
    descAr: 'مطهو على حطب السمر الطبيعي في حفر الطين بعناية لأكثر من 4 ساعات.',
    descEn: 'Slow-cooked over natural wood embers in traditional earthen pits.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'أطباق شعبية',
    tagEn: 'Traditional Mains'
  },
  {
    id: 'g-3',
    category: 'presentation',
    titleAr: 'فحسة اللحم البلدي في المدرة الحجرية البركانية',
    titleEn: 'Sizzling Stone Pot Fahsa',
    descAr: 'تُقدَّم وهي تفور بالنار والحلية الشعبية على طاولة الضيوف مباشرة.',
    descEn: 'Served bubbling hot in volcanic stone pots with fenugreek froth.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'فنون التقديم',
    tagEn: 'Presentation'
  },
  {
    id: 'g-4',
    category: 'majlis',
    titleAr: 'الجلسات العائلية التراثية الخاصة',
    titleEn: 'Private Heritage Family Majlis',
    descAr: 'خصوصية تامة، وسائد سدو تقليدية، وأجواء هادئة تسع العائلات الكبيرة.',
    descEn: 'Complete privacy with traditional Sadu cushions and spacious seating.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'جلسات عائلية',
    tagEn: 'Family Majlis'
  },
  {
    id: 'g-5',
    category: 'presentation',
    titleAr: 'خبز الملوح والتنور الطيني الطازج',
    titleEn: 'Fresh Tandoor Bread',
    descAr: 'يُخبز باليد على جدران التنور الحار فور تلقي الطلب ليصلك مقرمشاً وطازجاً.',
    descEn: 'Handmade and freshly baked on hot clay walls to crisp perfection.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'التنور والمخبوزات',
    tagEn: 'Tandoor Breads'
  },
  {
    id: 'g-6',
    category: 'events',
    titleAr: 'ضيافة الولائم والمناسبات الخاصة بالرياض',
    titleEn: 'Banquets & Private Gatherings Hospitality',
    descAr: 'تجهيز صواني الذبائح الكاملة، صحون المظبي، والمقبلات الشعبية الفاخرة.',
    descEn: 'Full feast arrangements for weddings, corporate banquets, and celebrations.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'ولائم ومناسبات',
    tagEn: 'Feasts & Events'
  },
  {
    id: 'g-7',
    category: 'dishes',
    titleAr: 'مقلقل كبدة الحاشي واللحم الطازج على الصاج',
    titleEn: 'Fresh Hashi Liver Sajiya',
    descAr: 'تُقلى مع البصل والفلفل الأخضر وبهارات البيت الريفي الخاصة.',
    descEn: 'Sautéed fresh daily on high heat cast iron with special house aromatics.',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'صاجيات طازجة',
    tagEn: 'Sajiya'
  },
  {
    id: 'g-8',
    category: 'majlis',
    titleAr: 'صالات كبار الشخصيات VIP للضيافة',
    titleEn: 'VIP Reception Halls',
    descAr: 'مجهزة بأفخم الديكورات التراثية لاستقبال ضيوفك بإكرام وتقدير يليق بهم.',
    descEn: 'Equipped with regal heritage décor to host esteemed guests with honor.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'صالات VIP',
    tagEn: 'VIP Halls'
  },
  {
    id: 'g-9',
    category: 'dishes',
    titleAr: 'المعصوب والعريكة الملكية بالعسل الدوعني',
    titleEn: 'Royal Masoub with Doani Honey',
    descAr: 'سمن بلدي فاخر، قشطة طازجة، حبة سوداء وعسل سدر جبلي أصيل.',
    descEn: 'Layered with pure local ghee, fresh cream, nigella seeds, and mountain honey.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    tagAr: 'حلويات ملكية',
    tagEn: 'Royal Sweets'
  }
];

interface GallerySectionProps {
  lang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  // Close lightbox on Escape key & Arrow navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev === null ? null : (prev + 1) % filteredItems.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery-section" className="py-12 sm:py-16 bg-[#faf9f6] border-y border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#b8860b] border border-[#d4af37]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            {isAr ? 'عدسة البيت الريفي' : 'Photo Gallery'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
            {isAr ? 'معرض صور المطعم والأجواء والولائم' : 'Restaurant Ambiance & Dishes Gallery'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-body">
            {isAr
              ? 'جولة بصرية في صرح شعبيات البيت الريفي بالرياض: من نيران التنور الحية وأطباق الولائم الفاخرة، إلى خصوصية الجلسات العائلية والصالات الملكية.'
              : 'A visual journey through our Riyadh landmark: from live tandoor fires and royal banquets to intimate family majlis.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 pb-4 overflow-x-auto no-scrollbar mb-8 sm:mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/60 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {isAr ? 'الكل' : 'All Photos'}
          </button>
          <button
            onClick={() => setActiveCategory('dishes')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'dishes'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/60 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {isAr ? 'الأطباق الشعبية والولائم' : 'Traditional Dishes'}
          </button>
          <button
            onClick={() => setActiveCategory('majlis')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'majlis'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/60 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {isAr ? 'الجلسات والصالات العائلية' : 'Family & VIP Majlis'}
          </button>
          <button
            onClick={() => setActiveCategory('presentation')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'presentation'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/60 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {isAr ? 'فنون التقديم والتنور' : 'Presentation & Tandoor'}
          </button>
          <button
            onClick={() => setActiveCategory('interior')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'interior'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/60 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {isAr ? 'المطعم من الداخل والواجهة' : 'Restaurant & Facade'}
          </button>
          <button
            onClick={() => setActiveCategory('events')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'events'
                ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/60 shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {isAr ? 'المناسبات والولائم' : 'Banquets & Events'}
          </button>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#d4af37]/30 shadow-sm hover:shadow-xl hover:border-[#d4af37] transition-all duration-300 h-64 sm:h-72 cursor-pointer flex flex-col justify-end p-5"
            >
              <img
                src={item.image}
                alt={isAr ? item.titleAr : item.titleEn}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Top Tag & Zoom icon */}
              <div className="absolute top-4 start-4 end-4 flex items-center justify-between gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141414]/80 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-xs shadow-sm">
                  {isAr ? item.tagAr : item.tagEn}
                </span>
                <span className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 group-hover:bg-[#d4af37] group-hover:text-[#141414] transition-all">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-[#d4af37] transition-colors line-clamp-1">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 font-body">
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          id="gallery-lightbox-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            id="gallery-lightbox-close-btn"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 end-4 sm:top-6 sm:end-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer z-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next Arrows */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length));
                }}
                className="absolute start-4 sm:start-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-[#d4af37]/40 transition-all cursor-pointer z-50"
                aria-label="Previous image"
              >
                <ChevronRight className="w-6 h-6 rtl:rotate-180" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredItems.length));
                }}
                className="absolute end-4 sm:end-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-[#d4af37]/40 transition-all cursor-pointer z-50"
                aria-label="Next image"
              >
                <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Modal Content Box */}
          <div
            className="max-w-4xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-full flex items-center justify-center rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={isAr ? filteredItems[lightboxIndex].titleAr : filteredItems[lightboxIndex].titleEn}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption Card */}
            <div className="w-full bg-[#141414]/90 border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#d4af37] text-[#141414]">
                  {isAr ? filteredItems[lightboxIndex].tagAr : filteredItems[lightboxIndex].tagEn}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                  {isAr ? filteredItems[lightboxIndex].titleAr : filteredItems[lightboxIndex].titleEn}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300">
                  {isAr ? filteredItems[lightboxIndex].descAr : filteredItems[lightboxIndex].descEn}
                </p>
              </div>

              <span className="text-xs text-stone-400 font-mono shrink-0">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
