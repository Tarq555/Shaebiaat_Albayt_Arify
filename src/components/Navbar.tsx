import React, { useState } from 'react';
import { ShoppingBag, Calendar, Globe, Menu as MenuIcon, X, PhoneCall, Shield, MessageCircle } from 'lucide-react';
import { Language, Currency } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { RestaurantLogo } from './RestaurantLogo';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  activeTab: 'home' | 'menu' | 'gallery' | 'story' | 'contact';
  onNavigate: (tab: 'home' | 'menu' | 'gallery' | 'story' | 'contact') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  isAdmin?: boolean;
  onOpenAdmin: () => void;
  onOpenAdminLogin: () => void;
  catalogOnlyMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
  activeTab,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenReservation,
  isAdmin = false,
  onOpenAdmin,
  onOpenAdminLogin,
  catalogOnlyMode = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، أود الاستفسار وطلب وجبة من شعبيات البيت الريفي بالرياض'
      : 'Hello, I would like to inquire about ordering from Shaabiyat Al-Bait Al-Reefi in Riyadh'
  )}`;

  const navItems: { id: 'home' | 'menu' | 'gallery' | 'story' | 'contact'; labelAr: string; labelEn: string }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'menu', labelAr: 'قائمة الأطباق', labelEn: 'Menu' },
    { id: 'gallery', labelAr: 'معرض الصور', labelEn: 'Gallery' },
    { id: 'story', labelAr: 'قصتنا وتراثنا', labelEn: 'Our Story' },
    { id: 'contact', labelAr: 'الموقع والحجز', labelEn: 'Location & Contact' },
  ];

  const handleAdminClick = () => {
    if (isAdmin) {
      onOpenAdmin();
    } else {
      onOpenAdminLogin();
    }
  };

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const startPress = () => {
    setIsPressing(true);
    const timer = setTimeout(() => {
      setIsPressing(false);
      if (isAdmin) {
        onOpenAdmin();
      } else {
        onOpenAdminLogin();
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    }, 1600);
    setPressTimer(timer);
  };

  const cancelPress = () => {
    setIsPressing(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#d4af37]/25 transition-all shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div
            id="brand-logo"
            onClick={() => onNavigate('home')}
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            className="flex items-center gap-3 cursor-pointer group relative"
          >
            {isPressing && (
              <div className="absolute -inset-2 rounded-2xl bg-[#d4af37]/20 animate-pulse pointer-events-none ring-2 ring-[#d4af37]/60" />
            )}
            <div className="relative group-hover:scale-105 transition-transform duration-200">
              <RestaurantLogo size={52} className="shadow-xs" />
            </div>
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-[#141414] tracking-tight font-heading leading-tight group-hover:text-[#b8860b] transition-colors">
                {isAr ? 'شعبيات البيت الريفي' : 'Al-Bait Al-Reefi'}
              </span>
              <span className="block text-xs font-semibold text-[#b8860b] tracking-wider uppercase">
                {isAr ? 'المقر الحصري بالرياض • مأكولات تراثية' : 'Exclusive Riyadh Flagship'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-[#141414] bg-[#faf9f6]'
                      : 'text-stone-600 hover:text-[#141414] hover:bg-stone-50'
                  }`}
                >
                  {isAr ? item.labelAr : item.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#d4af37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-[#faf9f6] border border-[#d4af37]/30 rounded-xl p-0.5 text-xs font-bold text-stone-700">
              {(['YER', 'SAR', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  id={`currency-btn-${c}`}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    currency === c ? 'bg-[#141414] text-[#d4af37] shadow-2xs font-extrabold' : 'hover:text-[#141414]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Language Toggle */}
            <button
              id="language-toggle-btn"
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-[#faf9f6] text-xs font-bold text-[#141414] hover:border-[#d4af37] transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            {/* Admin Dashboard Access Button */}
            {isAdmin && (
              <button
                id="admin-navbar-btn"
                onClick={handleAdminClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border bg-[#141414] text-[#d4af37] border-[#d4af37]/50 shadow-xs cursor-pointer"
                title={isAr ? 'لوحة تحكم المدير مفتوحة' : 'Admin Dashboard'}
              >
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'لوحة المدير' : 'Admin'}</span>
              </button>
            )}

            {/* Table Reservation Button */}
            <button
              id="reserve-table-nav-btn"
              onClick={onOpenReservation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#faf9f6] hover:bg-stone-100 text-[#141414] border border-[#d4af37]/40 text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#b8860b]" />
              <span>{isAr ? 'حجز طاولة' : 'Book Table'}</span>
            </button>

            {/* Cart or WhatsApp Inquiry Button */}
            {catalogOnlyMode ? (
              <a
                id="nav-whatsapp-inquiry-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{isAr ? 'طلب واستفسار واتساب' : 'WhatsApp Inquiry'}</span>
              </a>
            ) : (
              <button
                id="cart-drawer-toggle-btn"
                onClick={onOpenCart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-sm font-bold transition-all shadow-md relative cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <span>{isAr ? 'السلة' : 'Cart'}</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-extrabold bg-[#d4af37] text-[#141414] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {catalogOnlyMode ? (
              <a
                id="mobile-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs"
                title="واتساب"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            ) : (
              <button
                id="mobile-cart-btn"
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs"
              >
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-extrabold bg-[#d4af37] text-[#141414] rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#faf9f6] text-[#141414] border border-stone-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d4af37]/25 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3 duration-200 shadow-xl">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-start px-4 py-3 rounded-xl text-base font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {isAr ? item.labelAr : item.labelEn}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <button
              id="mobile-lang-btn"
              onClick={() => {
                onLanguageChange(isAr ? 'en' : 'ar');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#faf9f6] border border-stone-200 text-sm font-bold text-[#141414]"
            >
              <Globe className="w-4 h-4 text-[#b8860b]" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            <div className="flex items-center bg-[#faf9f6] border border-[#d4af37]/30 rounded-xl p-1 text-xs font-bold">
              {(['YER', 'SAR', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  id={`mobile-currency-btn-${c}`}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-3 py-1 rounded-lg ${
                    currency === c ? 'bg-[#141414] text-[#d4af37] font-extrabold' : 'text-stone-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              id="mobile-reserve-table-btn"
              onClick={() => {
                onOpenReservation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#faf9f6] border border-[#d4af37]/40 text-[#141414] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#b8860b]" />
              <span>{isAr ? 'حجز طاولة' : 'Book Table'}</span>
            </button>
            <a
              id="mobile-call-btn"
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="w-full py-2.5 px-3 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isAr ? 'اتصل بنا' : 'Call Us'}</span>
            </a>
          </div>

          {isAdmin && (
            <div className="pt-2">
              <button
                id="mobile-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>{isAr ? 'فتح لوحة تحكم المدير' : 'Master Admin Dashboard'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
