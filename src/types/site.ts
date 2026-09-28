export interface AboutBlock {
  type: "heading" | "paragraph" | "card";
  /** Heading/paragraph body, or card title */
  text: string;
  /** Card description (ignored for heading/paragraph) */
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  siteNameShort: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string;
  siteUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoOgImage: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroRotatingWords: string[];
  heroDescription: string;
  /** Wide artwork at the top of the homepage. */
  heroBannerUrl: string;
  /** Responsive crops generated from the main banner upload. */
  heroBannerMobileUrl: string;
  heroBannerTabletUrl: string;
  heroBannerDesktopUrl: string;
  /** Scrolling strip above the navbar. Empty falls back to contact details. */
  announcementMessages: string[];
  collectionTitle: string;
  collectionSubtitle: string;
  categoriesSectionTitle: string;
  categoriesSectionSubtitle: string;
  allProductsTitle: string;
  allProductsSubtitle: string;
  aboutTitle: string;
  aboutBlocks: AboutBlock[];
  aboutTagline: string;
  faqs: FaqItem[];
  faqPageTitle: string;
  faqPageSubtitle: string;
  faqImageUrl: string;
  shippingPolicyTitle: string;
  shippingPolicyContent: string;
  returnPolicyTitle: string;
  returnPolicyContent: string;
  reviewsSectionTitle: string;
  reviewsSectionSubtitle: string;
  contactSectionTitle: string;
  contactSectionDescription: string;
  contactButtonLabel: string;

  /* ---- Navigation ---- */
  navHomeLabel: string;
  navCollectionLabel: string;
  navAboutLabel: string;
  navFaqLabel: string;
  navShippingLabel: string;
  searchPlaceholder: string;

  /* ---- Buttons & link labels ---- */
  heroPrimaryButtonLabel: string;
  heroSecondaryButtonLabel: string;
  viewAllLabel: string;
  featuredButtonLabel: string;
  whatsappChatLabel: string;

  /* ---- Collection page ---- */
  collectionPageTitle: string;
  collectionPageSubtitle: string;
  emptyResultsTitle: string;
  emptyResultsMessage: string;

  /* ---- Product page ---- */
  productDescriptionHeading: string;
  productFeaturesHeading: string;
  orderButtonLabel: string;
  cardOrderButtonLabel: string;
  inStockLabel: string;
  outOfStockLabel: string;
  soldOutLabel: string;
  featuredBadgeLabel: string;
  waterResistantLabel: string;

  /* ---- Footer ---- */
  footerShopHeading: string;
  footerSupportHeading: string;
  footerAllProductsLabel: string;

  /* ---- FAQ page ---- */
  faqContactTitle: string;
  faqContactDescription: string;

  /* ---- Shipping page ---- */
  shippingPageTitle: string;
  shippingPageSubtitle: string;
  /** @deprecated legacy about card fields kept for migration */
  aboutCardOneTitle?: string;
  aboutCardOneDescription?: string;
  aboutCardTwoTitle?: string;
  aboutCardTwoDescription?: string;
  aboutCardThreeTitle?: string;
  aboutCardThreeDescription?: string;
}

/** Copy shown on product cards and the product detail page. */
export interface ProductLabels {
  orderNow: string;
  orderOnWhatsApp: string;
  soldOut: string;
  featured: string;
  inStock: string;
  outOfStock: string;
  waterResistant: string;
  description: string;
  features: string;
}

export function getProductLabels(settings: SiteSettings): ProductLabels {
  return {
    orderNow: settings.cardOrderButtonLabel,
    orderOnWhatsApp: settings.orderButtonLabel,
    soldOut: settings.soldOutLabel,
    featured: settings.featuredBadgeLabel,
    inStock: settings.inStockLabel,
    outOfStock: settings.outOfStockLabel,
    waterResistant: settings.waterResistantLabel,
    description: settings.productDescriptionHeading,
    features: settings.productFeaturesHeading,
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  customerName: string;
  roleOrLocation: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  sortOrder: number;
  isActive: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}
