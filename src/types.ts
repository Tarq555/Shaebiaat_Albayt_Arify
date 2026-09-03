export type Language = 'ar' | 'en';

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  badge?: string;
  count?: number;
  iconName: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface MenuItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number; // Price in Saudi Riyal (SAR)
  categoryId: CategoryId;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isChefSpecial?: boolean;
  prepTimeMinutes: number;
  serves: string;
  calories?: number;
  image: string;
  originRegion?: string;
  ingredientsAr?: string[];
  ingredientsEn?: string[];
  spiceLevel?: 1 | 2 | 3 | 4;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  portion: 'regular' | 'large' | 'family';
  specialNotes?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor-majlis' | 'outdoor-terrace' | 'family-section' | 'vip-room';
  specialOccasion?: string;
  notes?: string;
  createdAt: string;
}

export interface HeroConfig {
  badgeAr: string;
  badgeEn: string;
  titleLine1Ar: string;
  titleLine1En: string;
  titleHighlightAr: string;
  titleHighlightEn: string;
  definitionAr: string;
  definitionEn: string;
  bgImage: string;
  overlayOpacity: number; // 20 to 85 percent
  exploreBtnTextAr: string;
  exploreBtnTextEn: string;
  contactBtnTextAr: string;
  contactBtnTextEn: string;
  bookBtnTextAr: string;
  bookBtnTextEn: string;
  pillar1TitleAr: string;
  pillar1DescAr: string;
  pillar2TitleAr: string;
  pillar2DescAr: string;
  pillar3TitleAr: string;
  pillar3DescAr: string;
}

export interface SocialLinks {
  tiktok?: string;
  instagram?: string;
  snapchat?: string;
  twitter?: string;
  youtube?: string;
}

export interface ShowSocialLinks {
  tiktok: boolean;
  instagram: boolean;
  snapchat: boolean;
  twitter: boolean;
  youtube: boolean;
}

export interface RestaurantInfoType {
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  coordinatesDisplay: string;
  googleMapsUrl: string;
  directionsUrl: string;
  mapEmbedUrl: string;
  openingHoursAr: string;
  openingHoursEn: string;
  email: string;
  establishedYear: string;
  buildingPhoto: string;
  socialLinks: SocialLinks;
  showSocialLinks: ShowSocialLinks;
  readyMenuUrl?: string;
  readyMenuTitleAr?: string;
  readyMenuTitleEn?: string;
  enableReadyMenu?: boolean;
}

export interface SiteDisplaySettings {
  catalogOnlyMode: boolean; // True = display/catalog only (no cart/payment); False = full online cart ordering
  showPrices: boolean;
  enableAnnouncementBar: boolean;
  announcementTextAr: string;
  announcementTextEn: string;
  exclusiveBranchNoticeAr: string;
  exclusiveBranchNoticeEn: string;
  readyMenuUrl?: string;
  readyMenuTitleAr?: string;
  readyMenuTitleEn?: string;
  enableReadyMenu?: boolean;
}

export interface StoryConfig {
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  paragraph1Ar: string;
  paragraph1En: string;
  paragraph2Ar: string;
  paragraph2En: string;
  chefQuoteAr: string;
  chefQuoteEn: string;
}

export type Currency = 'YER' | 'SAR' | 'USD';

export type AdminTab = 'dishes' | 'categories' | 'photos' | 'hero' | 'display' | 'restaurant' | 'story' | 'reservations' | 'security';
