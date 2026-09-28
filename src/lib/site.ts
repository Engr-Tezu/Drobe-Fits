import slugify from "slugify";
import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import ReviewModel from "@/models/Review";
import SiteSettingsModel from "@/models/SiteSettings";
import { AboutBlock, Category, FaqItem, Review, SiteSettings } from "@/types/site";

export const DEFAULT_ABOUT_BLOCKS: AboutBlock[] = [
  {
    type: "card",
    text: "Our Philosophy",
    description:
      "We believe every product should reflect quality, confidence, and style. Our goal is to offer premium pieces that feel exceptional in everyday life.",
  },
  {
    type: "card",
    text: "Curated Collection",
    description:
      "Each item in our collection is selected for design, durability, and comfort, so you can shop products that fit both special occasions and daily use.",
  },
  {
    type: "card",
    text: "Our Commitment",
    description:
      "We are committed to trusted quality, responsive support, and a seamless shopping experience from browsing to delivery.",
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "How long does shipping take?",
    answer:
      "Orders are typically processed within 1–2 business days. Delivery usually takes 3–7 business days depending on your location.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes. Unused items in original condition can be returned or exchanged within 7 days of delivery. Please review our Shipping & Returns page for full details.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach us by phone, email, or WhatsApp using the contact details listed on the site. We usually respond within one business day.",
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "LUXE DIAL WATCHES",
  siteNameShort: "LUXE DIAL",
  logoUrl: "/logo.png",
  contactPhone: "+92 300 1234567",
  contactEmail: "info@luxedialwatches.com",
  contactAddress: "Lahore, Pakistan",
  whatsappNumber: "923001234567",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  seoTitle: "Premium Products",
  seoDescription: "Discover premium products with quality, style, and trusted service.",
  seoKeywords: ["premium products", "luxury", "online store", "quality"],
  seoOgImage: "/logo.png",
  heroBadge: "Premium Collection",
  heroTitlePrefix: "Timeless",
  heroRotatingWords: ["Style", "Quality", "Luxury", "Craftsmanship", "Essentials"],
  heroDescription:
    "Discover curated premium products that define quality, confidence, and everyday elegance.",
  heroBannerUrl: "/banner.jpeg",
  heroBannerMobileUrl: "",
  heroBannerTabletUrl: "",
  heroBannerDesktopUrl: "",
  announcementMessages: [],
  collectionTitle: "Featured Collection",
  collectionSubtitle: "Handpicked products chosen for style, quality, and value.",
  categoriesSectionTitle: "Shop by Category",
  categoriesSectionSubtitle: "",
  allProductsTitle: "All Products",
  allProductsSubtitle: "",
  aboutTitle: "Welcome to LUXE DIAL WATCHES",
  aboutBlocks: DEFAULT_ABOUT_BLOCKS,
  aboutTagline: "Quality and style for every moment.",
  faqs: DEFAULT_FAQS,
  faqPageTitle: "Frequently Asked Questions",
  faqPageSubtitle: "Quick answers about shopping, shipping, and support.",
  faqImageUrl: "/home-watch.jfif",
  shippingPolicyTitle: "Shipping Policy",
  shippingPolicyContent:
    "We process orders within 1–2 business days. Delivery times vary by location and usually take 3–7 business days. You will receive order updates once your package is on the way. Shipping charges, if any, are shown before checkout confirmation.",
  returnPolicyTitle: "Return & Exchange Policy",
  returnPolicyContent:
    "If you are not satisfied, unused items in original packaging may be returned or exchanged within 7 days of delivery. Please contact us with your order details to start a return. Refunds are processed after we inspect the returned item. Custom or damaged items may not be eligible.",
  reviewsSectionTitle: "What Our Customers Say",
  reviewsSectionSubtitle: "Real feedback from people who shop with us.",
  contactSectionTitle: "Ready to Explore Our Collection?",
  contactSectionDescription:
    "Browse our collection and reach out for quick assistance. We are here to help you choose the right product.",
  contactButtonLabel: "Start Shopping",

  navHomeLabel: "Home",
  navCollectionLabel: "Collection",
  navAboutLabel: "About",
  navFaqLabel: "FAQ",
  navShippingLabel: "Shipping",
  searchPlaceholder: "Search products…",

  heroPrimaryButtonLabel: "Shop the Collection",
  heroSecondaryButtonLabel: "Learn More",
  viewAllLabel: "View all products",
  featuredButtonLabel: "Browse the Full Collection",
  whatsappChatLabel: "Chat on WhatsApp",

  collectionPageTitle: "Our Collection",
  collectionPageSubtitle: "Browse every product in our store.",
  emptyResultsTitle: "No products found",
  emptyResultsMessage: "Check back soon for new arrivals.",

  productDescriptionHeading: "Description",
  productFeaturesHeading: "Features & Specifications",
  orderButtonLabel: "Order on WhatsApp",
  cardOrderButtonLabel: "Order Now",
  inStockLabel: "In Stock",
  outOfStockLabel: "Out of Stock",
  soldOutLabel: "Sold Out",
  featuredBadgeLabel: "Featured",
  waterResistantLabel: "Water Resistant",

  footerShopHeading: "Shop",
  footerSupportHeading: "Support",
  footerAllProductsLabel: "All Products",

  faqContactTitle: "Still have a question?",
  faqContactDescription:
    "Message us directly and we will get back to you within one business day.",

  shippingPageTitle: "Shipping & Returns",
  shippingPageSubtitle: "Clear information about delivery and our return process.",
};

/**
 * Settings whose value is an array; the API parses each of these itself.
 * Everything else in DEFAULT_SITE_SETTINGS is a plain string.
 */
export const SETTINGS_ARRAY_KEYS = [
  "seoKeywords",
  "heroRotatingWords",
  "announcementMessages",
  "aboutBlocks",
  "faqs",
] as const satisfies ReadonlyArray<keyof SiteSettings>;

/**
 * Every plain-string setting the API will accept, derived from the defaults
 * rather than hand-listed — adding a field to DEFAULT_SITE_SETTINGS is enough
 * for it to save. A hand-maintained list silently dropped new fields before.
 */
export const SETTINGS_STRING_KEYS = (
  Object.keys(DEFAULT_SITE_SETTINGS) as Array<keyof SiteSettings>
).filter(
  (key) =>
    key !== "_id" &&
    !(SETTINGS_ARRAY_KEYS as ReadonlyArray<keyof SiteSettings>).includes(key)
);

/** Field names that are plain strings falling back to DEFAULT_SITE_SETTINGS. */
const SIMPLE_TEXT_KEYS = [
  "heroBannerUrl",
  "heroBannerMobileUrl",
  "heroBannerTabletUrl",
  "heroBannerDesktopUrl",
  "navHomeLabel",
  "navCollectionLabel",
  "navAboutLabel",
  "navFaqLabel",
  "navShippingLabel",
  "searchPlaceholder",
  "heroPrimaryButtonLabel",
  "heroSecondaryButtonLabel",
  "viewAllLabel",
  "featuredButtonLabel",
  "whatsappChatLabel",
  "collectionPageTitle",
  "collectionPageSubtitle",
  "emptyResultsTitle",
  "emptyResultsMessage",
  "productDescriptionHeading",
  "productFeaturesHeading",
  "orderButtonLabel",
  "cardOrderButtonLabel",
  "inStockLabel",
  "outOfStockLabel",
  "soldOutLabel",
  "featuredBadgeLabel",
  "waterResistantLabel",
  "footerShopHeading",
  "footerSupportHeading",
  "footerAllProductsLabel",
  "faqContactTitle",
  "faqContactDescription",
  "shippingPageTitle",
  "shippingPageSubtitle",
] as const satisfies ReadonlyArray<keyof SiteSettings>;

export const DEFAULT_CATEGORIES = [
  { name: "Watches", slug: "watches", sortOrder: 0, isActive: true },
  { name: "Shoes", slug: "shoes", sortOrder: 1, isActive: true },
];

export function createCategorySlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

export async function ensureDefaultCategories() {
  await connectDB();
  const count = await CategoryModel.countDocuments();
  if (count > 0) return;
  await CategoryModel.insertMany(DEFAULT_CATEGORIES);
}

export async function getCategories(options?: { activeOnly?: boolean }): Promise<Category[]> {
  await ensureDefaultCategories();
  const filter = options?.activeOnly ? { isActive: true } : {};
  const categories = await CategoryModel.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
  return categories.map((category) => ({
    ...category,
    _id: String(category._id),
    createdAt: category.createdAt?.toISOString?.() ?? String(category.createdAt),
    updatedAt: category.updatedAt?.toISOString?.() ?? String(category.updatedAt),
  })) as Category[];
}

function pickString(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function pickWords(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    return value.map((word) => String(word).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);
  }
  return fallback;
}

/**
 * Labels fall back to the default when blank — an empty button or heading is
 * never what the admin meant, so a cleared field restores the built-in text.
 */
function pickLabel(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

/** Like {@link pickWords} but newline-separated, so entries may contain commas. */
function pickLines(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    return value.map((line) => String(line).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return fallback;
}

function migrateLegacyAboutBlocks(source: Partial<SiteSettings>): AboutBlock[] {
  const blocks: AboutBlock[] = [];
  const pairs: Array<[string | undefined, string | undefined]> = [
    [source.aboutCardOneTitle, source.aboutCardOneDescription],
    [source.aboutCardTwoTitle, source.aboutCardTwoDescription],
    [source.aboutCardThreeTitle, source.aboutCardThreeDescription],
  ];

  for (const [title, description] of pairs) {
    if (!title?.trim() && !description?.trim()) continue;
    blocks.push({
      type: "card",
      text: title?.trim() || "About",
      description: description?.trim() || "",
    });
  }

  return blocks.length ? blocks : DEFAULT_ABOUT_BLOCKS;
}

export function normalizeAboutBlocks(value: unknown, source?: Partial<SiteSettings>): AboutBlock[] {
  if (Array.isArray(value) && value.length > 0) {
    const blocks: AboutBlock[] = [];

    for (const block of value) {
      if (!block || typeof block !== "object") continue;
      const record = block as { type?: string; text?: string; description?: string };
      const text = String(record.text || "").trim();
      const description = String(record.description || "").trim();

      if (record.type === "card") {
        if (!text && !description) continue;
        blocks.push({
          type: "card",
          text: text || "About",
          description,
        });
        continue;
      }

      if (record.type === "heading") {
        if (!text) continue;
        blocks.push({ type: "heading", text });
        continue;
      }

      if (!text) continue;
      blocks.push({ type: "paragraph", text });
    }

    if (blocks.length > 0) return blocks;
  }

  return migrateLegacyAboutBlocks(source || {});
}

export function normalizeFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return DEFAULT_FAQS;
  const faqs = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { question?: string; answer?: string };
      const question = String(record.question || "").trim();
      const answer = String(record.answer || "").trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is FaqItem => Boolean(item));
  return faqs.length ? faqs : DEFAULT_FAQS;
}

export function normalizeSiteSettings(input?: Partial<SiteSettings> | null): SiteSettings {
  const source = input || {};

  const labels = Object.fromEntries(
    SIMPLE_TEXT_KEYS.map((key) => [key, pickLabel(source[key], DEFAULT_SITE_SETTINGS[key])])
  ) as Pick<SiteSettings, (typeof SIMPLE_TEXT_KEYS)[number]>;

  return {
    ...labels,
    _id: source._id ? String(source._id) : undefined,
    siteName: pickString(source.siteName, DEFAULT_SITE_SETTINGS.siteName),
    siteNameShort: pickString(source.siteNameShort, DEFAULT_SITE_SETTINGS.siteNameShort),
    logoUrl: pickString(source.logoUrl, DEFAULT_SITE_SETTINGS.logoUrl),
    contactPhone: pickString(source.contactPhone, DEFAULT_SITE_SETTINGS.contactPhone),
    contactEmail: pickString(source.contactEmail, DEFAULT_SITE_SETTINGS.contactEmail),
    contactAddress: pickString(source.contactAddress, DEFAULT_SITE_SETTINGS.contactAddress),
    whatsappNumber: pickString(source.whatsappNumber, DEFAULT_SITE_SETTINGS.whatsappNumber),
    siteUrl: pickString(source.siteUrl, DEFAULT_SITE_SETTINGS.siteUrl),
    seoTitle: pickString(source.seoTitle, DEFAULT_SITE_SETTINGS.seoTitle),
    seoDescription: pickString(source.seoDescription, DEFAULT_SITE_SETTINGS.seoDescription),
    seoKeywords: pickWords(source.seoKeywords, DEFAULT_SITE_SETTINGS.seoKeywords),
    seoOgImage: pickString(source.seoOgImage, DEFAULT_SITE_SETTINGS.seoOgImage),
    heroBadge: pickString(source.heroBadge, DEFAULT_SITE_SETTINGS.heroBadge),
    heroTitlePrefix: pickString(source.heroTitlePrefix, DEFAULT_SITE_SETTINGS.heroTitlePrefix),
    heroRotatingWords: pickWords(source.heroRotatingWords, DEFAULT_SITE_SETTINGS.heroRotatingWords),
    heroDescription: pickString(source.heroDescription, DEFAULT_SITE_SETTINGS.heroDescription),
    announcementMessages: pickLines(
      source.announcementMessages,
      DEFAULT_SITE_SETTINGS.announcementMessages
    ),
    collectionTitle: pickString(source.collectionTitle, DEFAULT_SITE_SETTINGS.collectionTitle),
    collectionSubtitle: pickString(
      source.collectionSubtitle,
      DEFAULT_SITE_SETTINGS.collectionSubtitle
    ),
    categoriesSectionTitle: pickString(
      source.categoriesSectionTitle,
      DEFAULT_SITE_SETTINGS.categoriesSectionTitle
    ),
    categoriesSectionSubtitle: pickString(
      source.categoriesSectionSubtitle,
      DEFAULT_SITE_SETTINGS.categoriesSectionSubtitle
    ),
    allProductsTitle: pickLabel(
      source.allProductsTitle,
      DEFAULT_SITE_SETTINGS.allProductsTitle
    ),
    allProductsSubtitle: pickString(
      source.allProductsSubtitle,
      DEFAULT_SITE_SETTINGS.allProductsSubtitle
    ),
    aboutTitle: pickString(source.aboutTitle, DEFAULT_SITE_SETTINGS.aboutTitle),
    aboutBlocks: normalizeAboutBlocks(source.aboutBlocks, source),
    aboutTagline: pickString(source.aboutTagline, DEFAULT_SITE_SETTINGS.aboutTagline),
    faqs: normalizeFaqs(source.faqs),
    faqPageTitle: pickString(source.faqPageTitle, DEFAULT_SITE_SETTINGS.faqPageTitle),
    faqPageSubtitle: pickString(source.faqPageSubtitle, DEFAULT_SITE_SETTINGS.faqPageSubtitle),
    faqImageUrl: pickString(source.faqImageUrl, DEFAULT_SITE_SETTINGS.faqImageUrl),
    shippingPolicyTitle: pickString(
      source.shippingPolicyTitle,
      DEFAULT_SITE_SETTINGS.shippingPolicyTitle
    ),
    shippingPolicyContent: pickString(
      source.shippingPolicyContent,
      DEFAULT_SITE_SETTINGS.shippingPolicyContent
    ),
    returnPolicyTitle: pickString(
      source.returnPolicyTitle,
      DEFAULT_SITE_SETTINGS.returnPolicyTitle
    ),
    returnPolicyContent: pickString(
      source.returnPolicyContent,
      DEFAULT_SITE_SETTINGS.returnPolicyContent
    ),
    reviewsSectionTitle: pickString(
      source.reviewsSectionTitle,
      DEFAULT_SITE_SETTINGS.reviewsSectionTitle
    ),
    reviewsSectionSubtitle: pickString(
      source.reviewsSectionSubtitle,
      DEFAULT_SITE_SETTINGS.reviewsSectionSubtitle
    ),
    contactSectionTitle: pickString(
      source.contactSectionTitle,
      DEFAULT_SITE_SETTINGS.contactSectionTitle
    ),
    contactSectionDescription: pickString(
      source.contactSectionDescription,
      DEFAULT_SITE_SETTINGS.contactSectionDescription
    ),
    contactButtonLabel: pickString(
      source.contactButtonLabel,
      DEFAULT_SITE_SETTINGS.contactButtonLabel
    ),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  // Never cache settings — production was serving stale/default names.
  noStore();
  await connectDB();
  // Prefer the most recently updated document if duplicates exist.
  const settings = await SiteSettingsModel.findOne().sort({ updatedAt: -1 }).lean();
  if (!settings) {
    return DEFAULT_SITE_SETTINGS;
  }
  return normalizeSiteSettings({
    ...settings,
    _id: String(settings._id),
  } as Partial<SiteSettings>);
}

export async function upsertSiteSettings(input: Partial<SiteSettings>) {
  await connectDB();

  // Merge with the existing document so partial updates (e.g. FAQs only)
  // never overwrite other fields with hardcoded defaults.
  const existing = await SiteSettingsModel.findOne().lean();
  const definedInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<SiteSettings>;

  const payload = normalizeSiteSettings({
    ...(existing
      ? ({
          ...existing,
          _id: String(existing._id),
        } as Partial<SiteSettings>)
      : {}),
    ...definedInput,
  });

  const updatePayload = { ...payload };
  delete updatePayload._id;

  const doc = await SiteSettingsModel.findOneAndUpdate({}, updatePayload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
    runValidators: true,
    sort: { updatedAt: -1 },
  }).lean();

  // Keep a single settings document — remove any duplicates.
  if (doc?._id) {
    await SiteSettingsModel.deleteMany({ _id: { $ne: doc._id } });
  }

  return normalizeSiteSettings({
    ...doc,
    _id: String(doc!._id),
  } as Partial<SiteSettings>);
}

export async function categoryExists(name: string): Promise<boolean> {
  await ensureDefaultCategories();
  const exists = await CategoryModel.exists({ name, isActive: true });
  return Boolean(exists);
}

function serializeReview(doc: Record<string, unknown>): Review {
  return {
    ...doc,
    _id: String(doc._id),
    customerName: String(doc.customerName || ""),
    roleOrLocation: String(doc.roleOrLocation || ""),
    quote: String(doc.quote || ""),
    rating: Math.min(5, Math.max(1, Number(doc.rating) || 5)),
    avatarUrl: String(doc.avatarUrl || ""),
    sortOrder: Number(doc.sortOrder) || 0,
    isActive: doc.isActive !== false,
    featured: Boolean(doc.featured),
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt || ""),
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt || ""),
  };
}

export async function getReviews(options?: {
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<Review[]> {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (options?.activeOnly) filter.isActive = true;
  if (options?.featuredOnly) filter.featured = true;
  const reviews = await ReviewModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return reviews.map((review) => serializeReview(review as Record<string, unknown>));
}
