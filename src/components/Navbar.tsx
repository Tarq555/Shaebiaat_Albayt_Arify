import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Globe, Menu as MenuIcon, X, PhoneCall,
  Shield, MessageCircle, QrCode, Gift, User, Table
} from 'lucide-react';
import { Language, Currency, MemberUser } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { RestaurantLogo } from './RestaurantLogo';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  activeTab: 'home' | 'menu' | 'gallery' | 'contact' | 'table-menu';
  onNavigate: (tab: 'home' | 'menu' | 'gallery' | 'contact' | 'table-menu') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation?: () => void;
  onOpenQrMenu?: () => void;
  onOpenOffersSubscription?: () => void;
  isAdmin?: boolean;
  onOpenAdmin: () => void;
  onOpenAdminLogin: () => void;
  catalogOnlyMode?: boolean;
  currentMember?: MemberUser | null;
  onOpenAuthModal?: () => void;
  enableTableMenuPage?: boolean;
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
  onOpenQrMenu,
  onOpenOffersSubscription,
  isAdmin = false,
  onOpenAdmin,
  onOpenAdminLogin,
  catalogOnlyMode = true,
  currentMember = null,
  onOpenAuthModal,
  enableTableMenuPage = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  // Prevent background scrolling when mobile menu is active to avoid scroll conflict
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، أود الاستفسار والحجز في شعبيات البيت الريفي بالرياض'
      : 'Hello, I would like to inquire and make a booking at Shaabiyat Al-Bait Al-Reefi in Riyadh'
  )}`;

  const navItems: { id: 'home' | 'menu' | 'gallery' | 'contact'; labelAr: string; labelEn: string }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'menu', labelAr: 'قائمة الأطباق والمستودع', labelEn: 'Menu & Catalog' },
    { id: 'gallery', labelAr: 'معرض الصور', labelEn: 'Gallery' },
    { id: 'contact', labelAr: 'تواصل معنا للحجز', labelEn: 'Contact & Book' },
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
    <header className="sticky top-0 z-40 bg-white/98 border-b border-[#d4af37]/25 transition-all shadow-xs select-none">
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
              <RestaurantLogo size={50} className="shadow-xs" />
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
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-[#141414] bg-[#faf9f6]'
                      : 'text-stone-600 hover:text-[#141414] hover:bg-stone-50'
                  }`}
                >
                  {isAr ? item.labelAr : item.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#d4af37] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Standalone Table Menu Page Link */}
            {enableTableMenuPage !== false && (
              <button
                id="nav-link-table-menu"
                onClick={() => onNavigate('table-menu')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'table-menu'
                    ? 'text-[#141414] bg-amber-50 border border-[#d4af37]/50 shadow-2xs'
                    : 'text-stone-700 hover:text-[#141414] hover:bg-stone-50'
                }`}
                title={isAr ? 'صفحة جدول الأصناف والأسعار بدون صور' : 'Table Menu (Price Table)'}
              >
                <Table className="w-4 h-4 text-[#b8860b]" />
                <span>{isAr ? 'منيو الطاولات' : 'Table Menu'}</span>
              </button>
            )}
          </nav>

          {/* Desktop Right Controls & Global Standalone Sign-In Button */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* Currency Selector */}
            <div className="flex items-center bg-[#faf9f6] p-1 rounded-xl border border-stone-200 text-xs font-bold">
              {(['SAR', 'YER', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  id={`currency-btn-${c.toLowerCase()}`}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === c
                      ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                      : 'text-stone-500 hover:text-[#141414]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:text-[#141414] bg-[#faf9f6] hover:bg-stone-100 border border-stone-200 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            {/* Global Standalone Sign In Button (Top of screen per user request) */}
            {onOpenAuthModal && (
              <button
                id="nav-standalone-login-btn"
                onClick={onOpenAuthModal}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  currentMember
                    ? 'bg-amber-50 text-[#141414] border-[#d4af37]/60 hover:bg-amber-100 shadow-2xs'
                    : 'bg-stone-100 hover:bg-white text-[#141414] border-stone-300 hover:border-[#d4af37] shadow-2xs'
                }`}
                title={isAr ? 'تسجيل الدخول وإدارة العضوية' : 'Sign In / Account'}
              >
                <User className="w-3.5 h-3.5 text-[#b8860b]" />
                <span className="max-w-[120px] truncate">
                  {currentMember ? currentMember.name : (isAr ? 'تسجيل الدخول' : 'Sign In')}
                </span>
              </button>
            )}

            {/* Admin Dashboard Access Button (if already authenticated) */}
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

            {/* Direct Contact & Reservation Call Button */}
            <a
              id="call-direct-nav-btn"
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#faf9f6] hover:bg-stone-100 text-[#141414] border border-[#d4af37]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title={isAr ? 'اتصال مباشر للحجز والاستفسار' : 'Direct Call for Booking'}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#b8860b]" />
              <span className="hidden xl:inline">{isAr ? 'اتصال وحجز' : 'Call'}</span>
            </a>

            {/* Cart or WhatsApp Inquiry Button */}
            {catalogOnlyMode ? (
              <a
                id="nav-whatsapp-inquiry-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            ) : (
              <button
                id="cart-drawer-toggle-btn"
                onClick={onOpenCart}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold transition-all shadow-xs relative cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isAr ? 'السلة' : 'Cart'}</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold bg-[#d4af37] text-[#141414] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Top Action Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Standalone Sign In Button Mobile */}
            {onOpenAuthModal && (
              <button
                id="mobile-nav-auth-btn"
                onClick={onOpenAuthModal}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#141414] border border-stone-200 shadow-2xs"
                title={isAr ? 'تسجيل الدخول' : 'Sign In'}
              >
                <User className="w-5 h-5 text-[#b8860b]" />
              </button>
            )}

            {catalogOnlyMode ? (
              <a
                id="mobile-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs"
                title="واتساب"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            ) : (
              <button
                id="mobile-cart-btn"
                onClick={onOpenCart}
                className="relative p-2 rounded-xl bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-2xs"
              >
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-extrabold bg-[#d4af37] text-[#141414] rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#faf9f6] text-[#141414] border border-stone-200 shadow-2xs"
              aria-label="القائمة الجانبية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Mobile Drawer with Fixed Viewport & Scroll Isolation (Fixes scroll trap bug) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-50 bg-black/50 animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white h-full overflow-y-auto overscroll-contain px-4 py-5 space-y-4 pb-32 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* User status card */}
            {currentMember && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-[#d4af37]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#141414] text-[#d4af37] flex items-center justify-center font-bold text-xs">
                    {currentMember.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#141414]">{currentMember.name}</div>
                    <div className="text-[11px] text-stone-500">{currentMember.phone}</div>
                  </div>
                </div>
                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-[#b8860b] hover:underline cursor-pointer"
                  >
                    {isAr ? 'حسابي' : 'My Account'}
                  </button>
                )}
              </div>
            )}

            {/* Navigation links */}
            <div className="flex flex-col gap-1.5">
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
                    className={`w-full text-start px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 shadow-xs'
                        : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    {isAr ? item.labelAr : item.labelEn}
                  </button>
                );
              })}

              {/* Standalone Table Menu Mobile Link */}
              {enableTableMenuPage !== false && (
                <button
                  id="mobile-nav-table-menu-page"
                  onClick={() => {
                    onNavigate('table-menu');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-start px-4 py-3 rounded-xl text-sm font-bold border transition-colors flex items-center justify-between cursor-pointer ${
                    activeTab === 'table-menu'
                      ? 'bg-amber-50 text-[#141414] border-[#d4af37]'
                      : 'bg-[#faf9f6] text-[#141414] border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-[#b8860b]" />
                    <span>{isAr ? 'منيو الطاولات (جدول الأصناف والأسعار)' : 'Table & QR Price Menu'}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                    {isAr ? 'جدول سريع' : 'Quick'}
                  </span>
                </button>
              )}

              {/* Standalone Sign In Button in Mobile Drawer */}
              {onOpenAuthModal && !currentMember && (
                <button
                  id="mobile-nav-drawer-signin"
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-start px-4 py-3 rounded-xl text-sm font-bold bg-[#141414] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    <span>{isAr ? 'تسجيل الدخول / حساب الأعضاء' : 'Sign In / Member Account'}</span>
                  </div>
                </button>
              )}
            </div>

            {/* Quick Language & Currency Controls */}
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">{isAr ? 'اللغة:' : 'Language:'}</span>
                <button
                  id="mobile-lang-btn"
                  onClick={() => {
                    onLanguageChange(isAr ? 'en' : 'ar');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] border border-stone-200 text-xs font-bold text-[#141414]"
                >
                  <Globe className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>{isAr ? 'English' : 'العربية'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">{isAr ? 'العملة:' : 'Currency:'}</span>
                <div className="flex items-center bg-[#faf9f6] p-1 rounded-xl border border-stone-200 text-xs font-bold">
                  {(['SAR', 'YER', 'USD'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => onCurrencyChange(c)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        currency === c ? 'bg-[#141414] text-[#d4af37]' : 'text-stone-500'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Action Buttons Mobile */}
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#faf9f6] text-[#141414] border border-[#d4af37]/40 text-xs font-bold"
              >
                <PhoneCall className="w-4 h-4 text-[#b8860b]" />
                <span>{isAr ? 'اتصال مباشر للحجز' : 'Direct Call'}</span>
              </a>

              {/* Admin Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                <Shield className="w-4 h-4 text-stone-500" />
                <span>{isAdmin ? (isAr ? 'لوحة تحكم الإدارة' : 'Admin Panel') : (isAr ? 'دخول الإدارة (PIN)' : 'Admin Login')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
