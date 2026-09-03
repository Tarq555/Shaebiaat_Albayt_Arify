import React, { useState, useEffect } from 'react';
import {
  Language, Currency, CategoryId, Category, MenuItem, CartItem,
  HeroConfig, SiteDisplaySettings, StoryConfig, AdminTab
} from './types';
import {
  INITIAL_MENU_ITEMS, RESTAURANT_INFO, CATEGORIES as DEFAULT_CATEGORIES,
  DEFAULT_HERO_CONFIG, DEFAULT_SITE_SETTINGS, DEFAULT_STORY_CONFIG
} from './data/restaurantData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoCategories } from './components/BentoCategories';
import { FeaturedDishesSection } from './components/FeaturedDishesSection';
import { GallerySection } from './components/GallerySection';
import { FlagshipBuildingBanner } from './components/FlagshipBuildingBanner';
import { FaqSection } from './components/FaqSection';
import { FloatingActions } from './components/FloatingActions';
import { MenuSection } from './components/MenuSection';
import { KitchenStorySection } from './components/KitchenStorySection';
import { OfficialCredentialsSection } from './components/OfficialCredentialsSection';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { DishDetailModal } from './components/DishDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { ReadyMenuModal } from './components/ReadyMenuModal';
import { AdminManagerModal, RestaurantInfoType } from './components/AdminManagerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminFloatingBar } from './components/AdminFloatingBar';
import { ManualImageModal, ImagePreset } from './components/ManualImageModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'gallery' | 'story' | 'contact'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  
  // Restaurant info state with local persistence
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfoType>(() => {
    try {
      const saved = localStorage.getItem('al_bait_restaurant_info');
      if (saved) {
        return {
          ...RESTAURANT_INFO,
          ...JSON.parse(saved)
        };
      }
    } catch (e) {
      console.error('Error loading stored restaurant info', e);
    }
    return RESTAURANT_INFO;
  });

  // Hero section configuration state with local persistence
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem('al_bait_hero_config');
      if (saved) {
        return { ...DEFAULT_HERO_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading hero config', e);
    }
    return DEFAULT_HERO_CONFIG;
  });

  // Site display settings (catalog mode, show prices, announcement) with persistence
  const [siteSettings, setSiteSettings] = useState<SiteDisplaySettings>(() => {
    try {
      const saved = localStorage.getItem('al_bait_site_settings');
      if (saved) {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading site settings', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Story & Heritage configuration state with local persistence
  const [storyConfig, setStoryConfig] = useState<StoryConfig>(() => {
    try {
      const saved = localStorage.getItem('al_bait_story_config');
      if (saved) {
        return { ...DEFAULT_STORY_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading story config', e);
    }
    return DEFAULT_STORY_CONFIG;
  });

  // Dynamic Categories state with local persistence
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('yemeni_restaurant_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored categories', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Menu items state with local persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('yemeni_restaurant_menu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize any outdated cat image URLs
          return parsed.map((item: MenuItem) => {
            if (item.image && item.image.includes('541781774459')) {
              if (item.id.includes('masoub') || item.categoryId === 'desserts') {
                return { ...item, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80' };
              }
              return { ...item, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80' };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error('Error loading stored menu', e);
    }
    return INITIAL_MENU_ITEMS;
  });

  // Cart items state with local persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('yemeni_restaurant_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored cart', e);
    }
    return [];
  });

  // Admin state with strict temporary session auth (zero persistence across visitor devices)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      localStorage.removeItem('al_bait_admin_auth');
      const sessionAuth = sessionStorage.getItem('al_bait_session_auth');
      if (sessionAuth) {
        const loginTime = parseInt(sessionAuth, 10);
        // Valid for 30 minutes session
        if (Date.now() - loginTime < 30 * 60 * 1000) {
          return true;
        } else {
          sessionStorage.removeItem('al_bait_session_auth');
        }
      }
    } catch {
      // default false
    }
    return false;
  });

  // Modal states
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isReadyMenuOpen, setIsReadyMenuOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('dishes');
  const [dishToEditForAdmin, setDishToEditForAdmin] = useState<MenuItem | null>(null);

  // Manual image upload modal state (for restaurant building or category images)
  const [isManualImageModalOpen, setIsManualImageModalOpen] = useState(false);
  const [manualImageTarget, setManualImageTarget] = useState<
    | { type: 'building' }
    | { type: 'category'; category: Category }
    | null
  >(null);

  const handleOpenManualBuildingPhoto = () => {
    if (!isAdminAuthenticated) return;
    setManualImageTarget({ type: 'building' });
    setIsManualImageModalOpen(true);
  };

  const handleOpenManualCategoryPhoto = (category: Category) => {
    if (!isAdminAuthenticated) return;
    setManualImageTarget({ type: 'category', category });
    setIsManualImageModalOpen(true);
  };

  const handleSaveManualImage = (newImageUrl: string) => {
    if (!isAdminAuthenticated) return;
    if (manualImageTarget?.type === 'building') {
      const updatedHero = { ...heroConfig, bgImage: newImageUrl };
      handleUpdateHeroConfig(updatedHero);
    } else if (manualImageTarget?.type === 'category') {
      const updatedCategory = { ...manualImageTarget.category, image: newImageUrl };
      handleUpdateCategory(updatedCategory);
    }
    setIsManualImageModalOpen(false);
    setManualImageTarget(null);
  };

  // Sync direction on html tag when lang changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Secret Admin Access via URL hash (#admin or ?admin=true) or Keyboard Shortcut (Ctrl+Shift+A or Alt+A)
  useEffect(() => {
    const checkAdminTrigger = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || hash === '#login' || hash === '#vault' || params.get('admin') === 'true') {
        if (isAdminAuthenticated) {
          setIsAdminModalOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret combo: Alt + A or Ctrl + Shift + A or Cmd + Shift + A
      if ((e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش')) || 
          ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش'))) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setIsAdminModalOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminAuthenticated]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('yemeni_restaurant_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cartItems]);

  // Persist categories
  useEffect(() => {
    try {
      localStorage.setItem('yemeni_restaurant_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories', e);
    }
  }, [categories]);

  // Persist menu
  useEffect(() => {
    try {
      localStorage.setItem('yemeni_restaurant_menu', JSON.stringify(menuItems));
    } catch (e) {
      console.error('Error saving menu', e);
    }
  }, [menuItems]);

  // Persist restaurant info
  useEffect(() => {
    try {
      localStorage.setItem('al_bait_restaurant_info', JSON.stringify(restaurantInfo));
    } catch (e) {
      console.error('Error saving restaurant info', e);
    }
  }, [restaurantInfo]);

  // Navigation handlers
  const handleNavigate = (tab: 'home' | 'menu' | 'gallery' | 'story' | 'contact') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setActiveTab('menu');
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDishById = (dishId: string) => {
    const found = menuItems.find((m) => m.id === dishId);
    if (found) {
      setSelectedDishForModal(found);
    }
  };

  // Cart operations
  const handleAddToCart = (
    dish: MenuItem,
    quantity: number = 1,
    portion: 'regular' | 'large' | 'family' = 'regular',
    specialNotes?: string
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.dish.id === dish.id && item.portion === portion
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          specialNotes: specialNotes || updated[existingIdx].specialNotes
        };
        return updated;
      } else {
        return [...prev, { dish, quantity, portion, specialNotes }];
      }
    });
  };

  const handleQuickAddToCart = (dish: MenuItem) => {
    handleAddToCart(dish, 1, 'regular');
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: newQty };
        return updated;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Admin menu operations
  const handleAddDish = (dish: MenuItem) => {
    setMenuItems((prev) => {
      const updated = [dish, ...prev];
      try {
        localStorage.setItem('yemeni_restaurant_menu', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting menu', e);
      }
      return updated;
    });
  };

  const handleUpdateDish = (updatedDish: MenuItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((d) => (d.id === updatedDish.id ? updatedDish : d));
      try {
        localStorage.setItem('yemeni_restaurant_menu', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting menu', e);
      }
      return updated;
    });
  };

  const handleDeleteDish = (dishId: string) => {
    setMenuItems((prev) => {
      const updated = prev.filter((d) => d.id !== dishId);
      try {
        localStorage.setItem('yemeni_restaurant_menu', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting menu', e);
      }
      return updated;
    });
  };

  const handleResetMenu = () => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من استعادة القائمة الأصلية؟' : 'Restore original menu?')) {
      setMenuItems(INITIAL_MENU_ITEMS);
      localStorage.setItem('yemeni_restaurant_menu', JSON.stringify(INITIAL_MENU_ITEMS));
    }
  };

  const handleImportMenu = (imported: MenuItem[]) => {
    setMenuItems(imported);
    localStorage.setItem('yemeni_restaurant_menu', JSON.stringify(imported));
  };

  // Category Operations
  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => {
      const updated = [...prev, newCat];
      try {
        localStorage.setItem('yemeni_restaurant_categories', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving categories', e);
      }
      return updated;
    });
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === updatedCat.id ? updatedCat : c));
      try {
        localStorage.setItem('yemeni_restaurant_categories', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving categories', e);
      }
      return updated;
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== categoryId);
      try {
        localStorage.setItem('yemeni_restaurant_categories', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving categories', e);
      }
      return updated;
    });
  };

  const handleResetCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    localStorage.setItem('yemeni_restaurant_categories', JSON.stringify(DEFAULT_CATEGORIES));
  };

  const handleUpdateRestaurantInfo = (updatedInfo: RestaurantInfoType) => {
    setRestaurantInfo(updatedInfo);
    try {
      localStorage.setItem('al_bait_restaurant_info', JSON.stringify(updatedInfo));
    } catch (e) {
      console.error('Error saving restaurant info', e);
    }
  };

  const handleDirectEditDishFromMenu = (dish: MenuItem) => {
    setDishToEditForAdmin(dish);
    setAdminInitialTab('dishes');
    setIsAdminModalOpen(true);
  };

  const handleOpenAdminWithTab = (tab: AdminTab = 'dishes') => {
    setDishToEditForAdmin(null);
    setAdminInitialTab(tab);
    setIsAdminModalOpen(true);
  };

  const handleUpdateHeroConfig = (newConfig: HeroConfig) => {
    setHeroConfig(newConfig);
    try {
      localStorage.setItem('al_bait_hero_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Error saving hero config', e);
    }
  };

  const handleUpdateSiteSettings = (newSettings: SiteDisplaySettings) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem('al_bait_site_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Error saving site settings', e);
    }
  };

  const handleUpdateStoryConfig = (newStory: StoryConfig) => {
    setStoryConfig(newStory);
    try {
      localStorage.setItem('al_bait_story_config', JSON.stringify(newStory));
    } catch (e) {
      console.error('Error saving story config', e);
    }
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('al_bait_session_auth');
    localStorage.removeItem('al_bait_admin_auth');
    setIsAdminAuthenticated(false);
    setIsAdminModalOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#login' || window.location.hash === '#vault') {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#141414] selection:bg-[#d4af37]/30 selection:text-[#141414]">
      
      {/* Sticky Top Admin Floating Bar if Logged in */}
      {isAdminAuthenticated && (
        <AdminFloatingBar
          lang={lang}
          onOpenAdmin={handleOpenAdminWithTab}
          onOpenCreateDish={() => {
            setDishToEditForAdmin(null);
            setAdminInitialTab('dishes');
            setIsAdminModalOpen(true);
          }}
          onLogout={handleLogoutAdmin}
        />
      )}

      {/* Top Announcement Bar if enabled by Admin */}
      {siteSettings.enableAnnouncementBar && (
        <div className="bg-[#141414] text-[#d4af37] py-2.5 px-4 text-center text-xs font-bold border-b border-[#d4af37]/30 flex items-center justify-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span>{lang === 'ar' ? siteSettings.announcementTextAr : (siteSettings.announcementTextEn || siteSettings.announcementTextAr)}</span>
        </div>
      )}

      {/* Sticky Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={() => handleOpenAdminWithTab('dishes')}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        catalogOnlyMode={siteSettings.catalogOnlyMode}
      />

      {/* Main Content Area based on Tab */}
      <main className="grow">
        {activeTab === 'home' && (
          <>
            {/* Hero Section with Signature Platter & Real Building Badge */}
            <Hero
              lang={lang}
              onExploreMenu={() => handleNavigate('menu')}
              onBookTable={() => setIsReservationOpen(true)}
              onDishSelect={handleSelectDishById}
              heroConfig={heroConfig}
              catalogOnlyMode={siteSettings.catalogOnlyMode}
              restaurantInfo={restaurantInfo}
              onOpenReadyMenu={() => setIsReadyMenuOpen(true)}
            />

            {/* Bento Categories Showcase (الأقسام الرئيسية) */}
            <BentoCategories
              lang={lang}
              onSelectCategory={handleCategorySelect}
              categories={categories}
            />

            {/* Signature & Most Requested Dishes Showcase (قسم الأطباق المميزة) */}
            <FeaturedDishesSection
              dishes={menuItems}
              onSelectDish={setSelectedDishForModal}
              onExploreFullMenu={() => handleNavigate('menu')}
              lang={lang}
              currency={currency}
              showPrices={siteSettings.showPrices}
            />

            {/* Restaurant Ambiance, Majlis & Hospitality Gallery (معرض الصور التفاعلي) */}
            <GallerySection lang={lang} />

            {/* Flagship Real Restaurant Building & Hospitality Showcase */}
            <FlagshipBuildingBanner
              lang={lang}
              onOpenReservation={() => setIsReservationOpen(true)}
              buildingPhoto={heroConfig.bgImage}
            />

            {/* Frequently Asked Questions (قسم الأسئلة الشائعة) */}
            <FaqSection
              lang={lang}
              onOpenReservation={() => setIsReservationOpen(true)}
            />

            {/* Official Credentials & Transparency Section */}
            <OfficialCredentialsSection lang={lang} />
          </>
        )}

        {activeTab === 'menu' && (
          <div className="pt-4">
            <MenuSection
              menuItems={menuItems}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectDish={setSelectedDishForModal}
              onQuickAddToCart={handleQuickAddToCart}
              cartItems={cartItems}
              lang={lang}
              currency={currency}
              isAdmin={isAdminAuthenticated}
              onEditDishAdmin={handleDirectEditDishFromMenu}
              categories={categories}
              catalogOnlyMode={siteSettings.catalogOnlyMode}
              showPrices={siteSettings.showPrices}
              whatsappNumber={restaurantInfo.whatsapp}
              onOpenReadyMenu={() => setIsReadyMenuOpen(true)}
              enableReadyMenu={restaurantInfo.enableReadyMenu}
              readyMenuTitle={lang === 'ar' ? restaurantInfo.readyMenuTitleAr : (restaurantInfo.readyMenuTitleEn || restaurantInfo.readyMenuTitleAr)}
            />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="pt-4">
            <GallerySection lang={lang} />
          </div>
        )}

        {activeTab === 'story' && (
          <div className="pt-4 space-y-8">
            <KitchenStorySection
              lang={lang}
              onExploreMenu={() => handleNavigate('menu')}
              onBookTable={() => setIsReservationOpen(true)}
              storyConfig={storyConfig}
            />
            {/* Official Credibility Credentials replaced unverified reviews */}
            <OfficialCredentialsSection lang={lang} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-4">
            <ContactSection
              lang={lang}
              onOpenReservation={() => setIsReservationOpen(true)}
              restaurantInfo={restaurantInfo}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsReservationOpen(true)}
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={() => handleOpenAdminWithTab('dishes')}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        restaurantInfo={restaurantInfo}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        lang={lang}
        currency={currency}
      />

      {/* Dish Detail & Customization Modal */}
      <DishDetailModal
        dish={selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
        currency={currency}
        catalogOnlyMode={siteSettings.catalogOnlyMode}
        showPrices={siteSettings.showPrices}
        whatsappNumber={restaurantInfo.whatsapp}
        onOpenReservation={() => {
          setSelectedDishForModal(null);
          setIsReservationOpen(true);
        }}
      />

      {/* Table & Majlis Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        lang={lang}
      />

      {/* Ready-Made Menu Brochure Modal */}
      <ReadyMenuModal
        isOpen={isReadyMenuOpen}
        onClose={() => setIsReadyMenuOpen(false)}
        lang={lang}
        menuBrochureUrl={restaurantInfo.readyMenuUrl}
        titleAr={restaurantInfo.readyMenuTitleAr}
        titleEn={restaurantInfo.readyMenuTitleEn}
        whatsappNumber={restaurantInfo.whatsapp}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminModalOpen(true);
        }}
        lang={lang}
      />

      {/* Master Admin Dashboard Modal */}
      <AdminManagerModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setDishToEditForAdmin(null);
        }}
        menuItems={menuItems}
        onAddDish={handleAddDish}
        onUpdateDish={handleUpdateDish}
        onDeleteDish={handleDeleteDish}
        onResetMenu={handleResetMenu}
        onImportMenu={handleImportMenu}
        restaurantInfo={restaurantInfo}
        onUpdateRestaurantInfo={handleUpdateRestaurantInfo}
        initialTab={adminInitialTab}
        dishToEdit={dishToEditForAdmin}
        onClearDishToEdit={() => setDishToEditForAdmin(null)}
        onLogout={handleLogoutAdmin}
        lang={lang}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetCategories={handleResetCategories}
        heroConfig={heroConfig}
        onUpdateHeroConfig={handleUpdateHeroConfig}
        siteSettings={siteSettings}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        storyConfig={storyConfig}
        onUpdateStoryConfig={handleUpdateStoryConfig}
      />

      {/* Reusable Manual Image Upload & Management Modal */}
      {isManualImageModalOpen && (
        <ManualImageModal
          isOpen={isManualImageModalOpen}
          onClose={() => {
            setIsManualImageModalOpen(false);
            setManualImageTarget(null);
          }}
          titleAr={
            manualImageTarget?.type === 'building'
              ? 'تغيير / رفع صورة صرح ومبنى المطعم يدويًا'
              : (manualImageTarget?.type === 'category'
                  ? `تغيير صورة قسم: ${manualImageTarget.category.nameAr}`
                  : 'تغيير الصورة يدويًا')
          }
          titleEn={
            manualImageTarget?.type === 'building'
              ? 'Upload / Change Restaurant Building Landmark Photo'
              : (manualImageTarget?.type === 'category'
                  ? `Change Photo for Category: ${manualImageTarget.category.nameEn}`
                  : 'Change Photo')
          }
          descriptionAr={
            manualImageTarget?.type === 'building'
              ? 'يمكنك رفع صورة المبنى الحقيقي من جهازك مباشرة (يتم ضغطها وتجهيزها تلقائياً) أو اختيار صورة معتمدة.'
              : 'قم برفع صورة الغلاف الجديدة لهذا القسم من جهازك، أو اختر صورة جاهزة أو الصق رابطاً مباشراً.'
          }
          descriptionEn={
            manualImageTarget?.type === 'building'
              ? 'Upload a real photo of the restaurant building or pick from verified assets.'
              : 'Upload a new cover photo for this category or paste a direct image URL.'
          }
          currentImage={
            manualImageTarget?.type === 'building'
              ? (heroConfig.bgImage || '/restaurant_building.jpg')
              : (manualImageTarget?.type === 'category'
                  ? manualImageTarget.category.image
                  : '')
          }
          onSave={handleSaveManualImage}
          lang={lang}
          aspectRatioLabel={manualImageTarget?.type === 'building' ? '16:9 أو 4:3 عريضة' : 'مربعة أو 16:9'}
          presets={
            manualImageTarget?.type === 'building'
              ? [
                  {
                    labelAr: 'المبنى والواجهة الحقيقية بالرياض',
                    labelEn: 'Authentic Riyadh Facade Photo',
                    url: '/restaurant_building.jpg',
                    badgeAr: 'الأصلي المعتمد',
                    badgeEn: 'Original'
                  },
                  {
                    labelAr: 'وليمة المندي والمظبي التراثية',
                    labelEn: 'Wood-Fired Mandi Platter',
                    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
                    badgeAr: 'ولائم',
                    badgeEn: 'Feasts'
                  },
                  {
                    labelAr: 'أجواء الجلسات والصالات العائلية',
                    labelEn: 'Family Heritage Salons',
                    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                    badgeAr: 'صالات VIP',
                    badgeEn: 'VIP Halls'
                  }
                ]
              : [
                  {
                    labelAr: 'ولائم اللحم والمندي',
                    labelEn: 'Mandi & Feasts',
                    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                    badgeAr: 'لحوم',
                    badgeEn: 'Mains'
                  },
                  {
                    labelAr: 'فخار وفحسة حجرية',
                    labelEn: 'Clay & Stone Fahsa',
                    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
                    badgeAr: 'حجريات',
                    badgeEn: 'Claypots'
                  },
                  {
                    labelAr: 'مقلقل وكبدة طازجة',
                    labelEn: 'Fresh Liver & Mugalgal',
                    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
                    badgeAr: 'طازج',
                    badgeEn: 'Fresh'
                  },
                  {
                    labelAr: 'فطور شعبي وقلابة',
                    labelEn: 'Traditional Breakfast',
                    url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
                    badgeAr: 'فطور',
                    badgeEn: 'Breakfast'
                  },
                  {
                    labelAr: 'معصوب وعريكة ملكية',
                    labelEn: 'Masoub & Royal Arika',
                    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
                    badgeAr: 'شعبيات',
                    badgeEn: 'Desserts'
                  },
                  {
                    labelAr: 'شاي عدني كرك معتق',
                    labelEn: 'Adeni Spiced Tea',
                    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
                    badgeAr: 'مشروبات',
                    badgeEn: 'Tea'
                  }
                ]
          }
        />
      )}

      {/* Floating Action Quick Contact & Scroll Top */}
      <FloatingActions lang={lang} />

    </div>
  );
};

export default App;
