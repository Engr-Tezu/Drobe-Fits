import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAboutBlock {
  type: "heading" | "paragraph" | "card";
  text: string;
  description?: string;
}

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface ISiteSettings extends Document {
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
  heroBannerUrl: string;
  heroBannerMobileUrl: string;
  heroBannerTabletUrl: string;
  heroBannerDesktopUrl: string;
  announcementMessages: string[];
  collectionTitle: string;
  collectionSubtitle: string;
  categoriesSectionTitle: string;
  categoriesSectionSubtitle: string;
  allProductsTitle: string;
  allProductsSubtitle: string;
  aboutTitle: string;
  aboutBlocks: IAboutBlock[];
  aboutTagline: string;
  faqs: IFaqItem[];
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
  navHomeLabel: string;
  navCollectionLabel: string;
  navAboutLabel: string;
  navFaqLabel: string;
  navShippingLabel: string;
  searchPlaceholder: string;
  heroPrimaryButtonLabel: string;
  heroSecondaryButtonLabel: string;
  viewAllLabel: string;
  featuredButtonLabel: string;
  whatsappChatLabel: string;
  collectionPageTitle: string;
  collectionPageSubtitle: string;
  emptyResultsTitle: string;
  emptyResultsMessage: string;
  productDescriptionHeading: string;
  productFeaturesHeading: string;
  orderButtonLabel: string;
  cardOrderButtonLabel: string;
  inStockLabel: string;
  outOfStockLabel: string;
  soldOutLabel: string;
  featuredBadgeLabel: string;
  waterResistantLabel: string;
  footerShopHeading: string;
  footerSupportHeading: string;
  footerAllProductsLabel: string;
  faqContactTitle: string;
  faqContactDescription: string;
  shippingPageTitle: string;
  shippingPageSubtitle: string;
  aboutCardOneTitle?: string;
  aboutCardOneDescription?: string;
  aboutCardTwoTitle?: string;
  aboutCardTwoDescription?: string;
  aboutCardThreeTitle?: string;
  aboutCardThreeDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutBlockSchema = new Schema<IAboutBlock>(
  {
    type: { type: String, enum: ["heading", "paragraph", "card"], required: true },
    text: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const FaqItemSchema = new Schema<IFaqItem>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, required: true, trim: true },
    siteNameShort: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true, trim: true },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactAddress: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    siteUrl: { type: String, default: "http://localhost:3000" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
    seoOgImage: { type: String, default: "" },
    heroBadge: { type: String, default: "" },
    heroTitlePrefix: { type: String, default: "" },
    heroRotatingWords: { type: [String], default: [] },
    heroDescription: { type: String, default: "" },
    heroBannerUrl: { type: String, default: "" },
    heroBannerMobileUrl: { type: String, default: "" },
    heroBannerTabletUrl: { type: String, default: "" },
    heroBannerDesktopUrl: { type: String, default: "" },
    announcementMessages: { type: [String], default: [] },
    collectionTitle: { type: String, default: "" },
    collectionSubtitle: { type: String, default: "" },
    categoriesSectionTitle: { type: String, default: "" },
    categoriesSectionSubtitle: { type: String, default: "" },
    allProductsTitle: { type: String, default: "" },
    allProductsSubtitle: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutBlocks: { type: [AboutBlockSchema], default: [] },
    aboutTagline: { type: String, default: "" },
    faqs: { type: [FaqItemSchema], default: [] },
    faqPageTitle: { type: String, default: "" },
    faqPageSubtitle: { type: String, default: "" },
    faqImageUrl: { type: String, default: "" },
    shippingPolicyTitle: { type: String, default: "" },
    shippingPolicyContent: { type: String, default: "" },
    returnPolicyTitle: { type: String, default: "" },
    returnPolicyContent: { type: String, default: "" },
    reviewsSectionTitle: { type: String, default: "" },
    reviewsSectionSubtitle: { type: String, default: "" },
    contactSectionTitle: { type: String, default: "" },
    contactSectionDescription: { type: String, default: "" },
    contactButtonLabel: { type: String, default: "" },
    navHomeLabel: { type: String, default: "" },
    navCollectionLabel: { type: String, default: "" },
    navAboutLabel: { type: String, default: "" },
    navFaqLabel: { type: String, default: "" },
    navShippingLabel: { type: String, default: "" },
    searchPlaceholder: { type: String, default: "" },
    heroPrimaryButtonLabel: { type: String, default: "" },
    heroSecondaryButtonLabel: { type: String, default: "" },
    viewAllLabel: { type: String, default: "" },
    featuredButtonLabel: { type: String, default: "" },
    whatsappChatLabel: { type: String, default: "" },
    collectionPageTitle: { type: String, default: "" },
    collectionPageSubtitle: { type: String, default: "" },
    emptyResultsTitle: { type: String, default: "" },
    emptyResultsMessage: { type: String, default: "" },
    productDescriptionHeading: { type: String, default: "" },
    productFeaturesHeading: { type: String, default: "" },
    orderButtonLabel: { type: String, default: "" },
    cardOrderButtonLabel: { type: String, default: "" },
    inStockLabel: { type: String, default: "" },
    outOfStockLabel: { type: String, default: "" },
    soldOutLabel: { type: String, default: "" },
    featuredBadgeLabel: { type: String, default: "" },
    waterResistantLabel: { type: String, default: "" },
    footerShopHeading: { type: String, default: "" },
    footerSupportHeading: { type: String, default: "" },
    footerAllProductsLabel: { type: String, default: "" },
    faqContactTitle: { type: String, default: "" },
    faqContactDescription: { type: String, default: "" },
    shippingPageTitle: { type: String, default: "" },
    shippingPageSubtitle: { type: String, default: "" },
    aboutCardOneTitle: { type: String, default: "" },
    aboutCardOneDescription: { type: String, default: "" },
    aboutCardTwoTitle: { type: String, default: "" },
    aboutCardTwoDescription: { type: String, default: "" },
    aboutCardThreeTitle: { type: String, default: "" },
    aboutCardThreeDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

const SiteSettings: Model<ISiteSettings> = mongoose.model<ISiteSettings>(
  "SiteSettings",
  SiteSettingsSchema
);

export default SiteSettings;
