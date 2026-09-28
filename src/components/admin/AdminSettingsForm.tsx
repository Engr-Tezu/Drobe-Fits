"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Search, X } from "lucide-react";
import { AboutBlock, FaqItem, SiteSettings } from "@/types/site";
import CustomSelect from "@/components/ui/CustomSelect";

type SettingsFormState = Omit<SiteSettings, "heroRotatingWords" | "seoKeywords"> & {
  heroRotatingWords: string;
  seoKeywords: string;
};

type FieldType = "text" | "textarea" | "image";

interface SettingsField {
  key: keyof SettingsFormState;
  label: string;
  type?: FieldType;
  placeholder?: string;
  /** Short hint rendered under the label. */
  help?: string;
}

interface SettingsGroup {
  id: string;
  label: string;
  fields: SettingsField[];
}

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "brand",
    label: "Brand",
    fields: [
      { key: "siteName", label: "Site Name" },
      { key: "siteNameShort", label: "Short Name" },
      { key: "logoUrl", label: "Logo", type: "image", placeholder: "/logo.png" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    fields: [
      { key: "contactPhone", label: "Phone" },
      { key: "contactEmail", label: "Email" },
      { key: "contactAddress", label: "Address" },
      { key: "whatsappNumber", label: "WhatsApp Number" },
      { key: "siteUrl", label: "Site URL" },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    fields: [
      { key: "seoTitle", label: "SEO Title" },
      { key: "seoDescription", label: "SEO Description", type: "textarea" },
      {
        key: "seoKeywords",
        label: "SEO Keywords",
        placeholder: "premium products, luxury, online store",
      },
      { key: "seoOgImage", label: "OG Image URL", placeholder: "/logo.png or full image URL" },
    ],
  },
  {
    id: "hero",
    label: "Hero",
    fields: [
      {
        key: "heroBannerUrl",
        label: "Main Banner Image",
        type: "image",
        placeholder: "/banner.jpeg",
        help: "Wide artwork at the top of the homepage. Around 1600×780 works best. Leave empty to restore the built-in banner.",
      },
      { key: "heroBadge", label: "Hero Badge" },
      { key: "heroTitlePrefix", label: "Hero Title Prefix" },
      {
        key: "heroRotatingWords",
        label: "Rotating Words",
        placeholder: "Style, Quality, Luxury",
      },
      { key: "heroDescription", label: "Hero Description", type: "textarea" },
    ],
  },
  {
    // Rendered by a dedicated add/remove editor, so it declares no fields.
    id: "announcement",
    label: "Ticker (Announcement Bar)",
    fields: [],
  },
  {
    id: "nav",
    label: "Navigation & Search",
    fields: [
      { key: "navHomeLabel", label: "Home Link" },
      { key: "navCollectionLabel", label: "Collection Link" },
      { key: "navAboutLabel", label: "About Link" },
      { key: "navFaqLabel", label: "FAQ Link" },
      { key: "navShippingLabel", label: "Shipping Link" },
      { key: "searchPlaceholder", label: "Search Placeholder" },
    ],
  },
  {
    id: "collection",
    label: "Homepage Sections",
    fields: [
      { key: "categoriesSectionTitle", label: "Categories Section Title" },
      {
        key: "categoriesSectionSubtitle",
        label: "Categories Section Subtitle",
        type: "textarea",
        placeholder: "Optional — leave empty to hide",
      },
      { key: "collectionTitle", label: "Featured Section Title" },
      { key: "collectionSubtitle", label: "Featured Section Subtitle", type: "textarea" },
      { key: "allProductsTitle", label: "All Products Title" },
      {
        key: "allProductsSubtitle",
        label: "All Products Subtitle",
        type: "textarea",
        placeholder: "Optional — leave empty to hide",
      },
    ],
  },
  {
    id: "buttons",
    label: "Buttons & Links",
    fields: [
      { key: "heroPrimaryButtonLabel", label: "Hero Primary Button" },
      { key: "heroSecondaryButtonLabel", label: "Hero Secondary Button" },
      { key: "viewAllLabel", label: "Section “View All” Link" },
      { key: "featuredButtonLabel", label: "Featured Section Button" },
      { key: "whatsappChatLabel", label: "WhatsApp Chat Button" },
    ],
  },
  {
    id: "collectionPage",
    label: "Collection Page",
    fields: [
      { key: "collectionPageTitle", label: "Page Title" },
      { key: "collectionPageSubtitle", label: "Page Subtitle", type: "textarea" },
      { key: "emptyResultsTitle", label: "No Results Title" },
      { key: "emptyResultsMessage", label: "No Results Message", type: "textarea" },
    ],
  },
  {
    id: "productPage",
    label: "Product Page & Cards",
    fields: [
      { key: "productDescriptionHeading", label: "Description Heading" },
      { key: "productFeaturesHeading", label: "Features Heading" },
      { key: "orderButtonLabel", label: "Order Button (product page)" },
      { key: "cardOrderButtonLabel", label: "Order Button (product card)" },
      { key: "inStockLabel", label: "In Stock Label" },
      { key: "outOfStockLabel", label: "Out of Stock Label" },
      { key: "soldOutLabel", label: "Sold Out Badge" },
      { key: "featuredBadgeLabel", label: "Featured Badge" },
      { key: "waterResistantLabel", label: "Water Resistant Badge" },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    fields: [
      { key: "footerShopHeading", label: "Shop Column Heading" },
      { key: "footerSupportHeading", label: "Support Column Heading" },
      { key: "footerAllProductsLabel", label: "All Products Link" },
    ],
  },
  {
    id: "about",
    label: "About",
    fields: [
      { key: "aboutTitle", label: "About Title" },
      { key: "aboutTagline", label: "About Tagline" },
    ],
  },
  {
    id: "faq",
    label: "FAQs",
    fields: [
      { key: "faqPageTitle", label: "FAQ Page Title" },
      { key: "faqPageSubtitle", label: "FAQ Page Subtitle", type: "textarea" },
      { key: "faqImageUrl", label: "FAQ Image", type: "image", placeholder: "/home-watch.jfif" },
      { key: "faqContactTitle", label: "FAQ Contact Box Title" },
      { key: "faqContactDescription", label: "FAQ Contact Box Text", type: "textarea" },
    ],
  },
  {
    id: "policies",
    label: "Shipping & Returns",
    fields: [
      { key: "shippingPageTitle", label: "Page Title" },
      { key: "shippingPageSubtitle", label: "Page Subtitle", type: "textarea" },
      { key: "shippingPolicyTitle", label: "Shipping Title" },
      { key: "shippingPolicyContent", label: "Shipping Policy", type: "textarea" },
      { key: "returnPolicyTitle", label: "Returns Title" },
      { key: "returnPolicyContent", label: "Return Policy", type: "textarea" },
    ],
  },
  {
    id: "reviews",
    label: "Reviews Section",
    fields: [
      { key: "reviewsSectionTitle", label: "Reviews Section Title" },
      { key: "reviewsSectionSubtitle", label: "Reviews Section Subtitle", type: "textarea" },
    ],
  },
  {
    id: "cta",
    label: "CTA",
    fields: [
      { key: "contactSectionTitle", label: "CTA Title" },
      { key: "contactSectionDescription", label: "CTA Description", type: "textarea" },
      { key: "contactButtonLabel", label: "CTA Button Label" },
    ],
  },
];

const inputClass =
  "w-full px-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40 transition-colors";

function toFormState(settings: SiteSettings): SettingsFormState {
  return {
    ...settings,
    aboutBlocks: Array.isArray(settings.aboutBlocks) ? settings.aboutBlocks : [],
    faqs: Array.isArray(settings.faqs) ? settings.faqs : [],
    heroRotatingWords: Array.isArray(settings.heroRotatingWords)
      ? settings.heroRotatingWords.join(", ")
      : String(settings.heroRotatingWords || ""),
    seoKeywords: Array.isArray(settings.seoKeywords)
      ? settings.seoKeywords.join(", ")
      : String(settings.seoKeywords || ""),
    announcementMessages: Array.isArray(settings.announcementMessages)
      ? settings.announcementMessages
      : [],
  };
}

export default function AdminSettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [settings, setSettings] = useState<SettingsFormState>(toFormState(initialSettings));
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [blockType, setBlockType] = useState<"heading" | "paragraph" | "card">("card");
  const [blockText, setBlockText] = useState("");
  const [blockDescription, setBlockDescription] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [announcementInput, setAnnouncementInput] = useState("");

  const update = <K extends keyof SettingsFormState>(name: K, value: SettingsFormState[K]) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const updateBannerUrl = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      heroBannerUrl: value,
      heroBannerMobileUrl: "",
      heroBannerTabletUrl: "",
      heroBannerDesktopUrl: "",
    }));
  };

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return SETTINGS_GROUPS.map((group) => {
      const fields = group.fields.filter((field) => {
        if (!query) return true;
        return (
          field.label.toLowerCase().includes(query) ||
          field.key.toLowerCase().includes(query) ||
          String(settings[field.key] || "")
            .toLowerCase()
            .includes(query)
        );
      });
      const aboutBlocksMatch =
        group.id === "about" &&
        (!query ||
          "about content".includes(query) ||
          "heading".includes(query) ||
          "paragraph".includes(query) ||
          "card".includes(query) ||
          settings.aboutBlocks.some(
            (block) =>
              block.text.toLowerCase().includes(query) ||
              String(block.description || "")
                .toLowerCase()
                .includes(query)
          ));
      const faqsMatch =
        group.id === "faq" &&
        (!query ||
          "faq".includes(query) ||
          "question".includes(query) ||
          settings.faqs.some(
            (faq) =>
              faq.question.toLowerCase().includes(query) ||
              faq.answer.toLowerCase().includes(query)
          ));
      const announcementsMatch =
        group.id === "announcement" &&
        (!query ||
          "announcement".includes(query) ||
          "ticker".includes(query) ||
          settings.announcementMessages.some((message) =>
            message.toLowerCase().includes(query)
          ));
      return { ...group, fields, aboutBlocksMatch, faqsMatch, announcementsMatch };
    }).filter((group) => {
      if (groupFilter !== "all" && group.id !== groupFilter) return false;
      if (group.id === "about") return group.fields.length > 0 || group.aboutBlocksMatch;
      if (group.id === "faq") return group.fields.length > 0 || group.faqsMatch;
      if (group.id === "announcement") {
        return group.fields.length > 0 || group.announcementsMatch;
      }
      return group.fields.length > 0;
    });
  }, [groupFilter, search, settings]);

  const uploadLogo = async (
    file: File,
    fieldKey: keyof SettingsFormState = "logoUrl"
  ) => {
    setUploadingLogo(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fieldKey", String(fieldKey));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logo upload failed");
      if (fieldKey === "heroBannerUrl" && data.data.variants) {
        setSettings((previous) => ({
          ...previous,
          heroBannerUrl: data.data.url,
          heroBannerMobileUrl: data.data.variants.mobile || "",
          heroBannerTabletUrl: data.data.variants.tablet || "",
          heroBannerDesktopUrl: data.data.variants.desktop || "",
        }));
      } else {
        update(fieldKey, data.data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const addAboutBlock = () => {
    const text = blockText.trim();
    const description = blockDescription.trim();

    if (blockType === "card") {
      if (!text && !description) return;
      const next: AboutBlock = {
        type: "card",
        text: text || "About",
        description,
      };
      update("aboutBlocks", [...settings.aboutBlocks, next]);
      setBlockText("");
      setBlockDescription("");
      return;
    }

    if (!text) return;
    const next: AboutBlock = { type: blockType, text };
    update("aboutBlocks", [...settings.aboutBlocks, next]);
    setBlockText("");
  };

  const removeAboutBlock = (index: number) => {
    update(
      "aboutBlocks",
      settings.aboutBlocks.filter((_, i) => i !== index)
    );
  };

  const moveAboutBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= settings.aboutBlocks.length) return;
    const next = [...settings.aboutBlocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    update("aboutBlocks", next);
  };

  const addAnnouncement = () => {
    const text = announcementInput.trim();
    if (!text) return;
    update("announcementMessages", [...settings.announcementMessages, text]);
    setAnnouncementInput("");
  };

  const updateAnnouncement = (index: number, text: string) => {
    const next = [...settings.announcementMessages];
    next[index] = text;
    update("announcementMessages", next);
  };

  const removeAnnouncement = (index: number) => {
    update(
      "announcementMessages",
      settings.announcementMessages.filter((_, i) => i !== index)
    );
  };

  const moveAnnouncement = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= settings.announcementMessages.length) return;
    const next = [...settings.announcementMessages];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    update("announcementMessages", next);
  };

  const addFaq = () => {
    const question = faqQuestion.trim();
    const answer = faqAnswer.trim();
    if (!question || !answer) return;
    const next: FaqItem = { question, answer };
    update("faqs", [...settings.faqs, next]);
    setFaqQuestion("");
    setFaqAnswer("");
  };

  const removeFaq = (index: number) => {
    update(
      "faqs",
      settings.faqs.filter((_, i) => i !== index)
    );
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= settings.faqs.length) return;
    const next = [...settings.faqs];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    update("faqs", next);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...settings,
        aboutBlocks: settings.aboutBlocks
          .map((block) => {
            if (block.type === "card") {
              return {
                type: "card" as const,
                text: block.text.trim() || "About",
                description: String(block.description || "").trim(),
              };
            }
            return {
              type: block.type === "heading" ? ("heading" as const) : ("paragraph" as const),
              text: block.text.trim(),
            };
          })
          .filter((block) => block.text || (block.type === "card" && block.description)),
        faqs: settings.faqs
          .map((faq) => ({
            question: faq.question.trim(),
            answer: faq.answer.trim(),
          }))
          .filter((faq) => faq.question && faq.answer),
        heroRotatingWords: settings.heroRotatingWords
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean),
        seoKeywords: settings.seoKeywords
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean),
        announcementMessages: settings.announcementMessages
          .map((message) => message.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      setSettings(toFormState(data.data));
      setSuccess("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ld-silver" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search settings..."
            className="w-full pl-10 pr-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40"
          />
        </div>
        <CustomSelect
          className="w-full lg:w-56"
          value={groupFilter}
          onChange={setGroupFilter}
          options={[
            { value: "all", label: "All Groups" },
            ...SETTINGS_GROUPS.map((group) => ({ value: group.id, label: group.label })),
          ]}
        />
        <button onClick={save} disabled={saving} className="btn-gold w-full lg:w-auto">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {success}
        </div>
      )}

      {filteredGroups.length === 0 ? (
        <div className="card-surface p-8 text-center text-ld-silver">No settings match your search.</div>
      ) : (
        filteredGroups.map((group) => (
          <section key={group.id} className="card-surface p-5 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{group.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map((field) => {
                const value = String(settings[field.key] ?? "");

                if (field.type === "image") {
                  return (
                    <div key={field.key} className="md:col-span-2 space-y-3">
                      <label className="block text-ld-light text-sm mb-2">{field.label}</label>
                      {field.help && (
                        <p className="text-ld-silver text-xs -mt-1">{field.help}</p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <div className="relative h-20 w-36 rounded-xl overflow-hidden bg-ld-dark border border-ld-grey/40 shrink-0">
                          {value ? (
                            <Image
                              src={value}
                              alt={`${field.label} preview`}
                              fill
                              className="object-contain p-2"
                              sizes="144px"
                              unoptimized
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-xs text-ld-silver">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            value={value}
                            onChange={(e) =>
                              field.key === "heroBannerUrl"
                                ? updateBannerUrl(e.target.value)
                                : update(field.key, e.target.value)
                            }
                            className={inputClass}
                            placeholder={field.placeholder || "/image.png or full image URL"}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files?.[0] && uploadLogo(e.target.files[0], field.key)
                            }
                            className="block text-sm text-ld-light"
                          />
                          {uploadingLogo && (
                            <p className="text-ld-silver text-xs">Uploading image...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <label className="block text-ld-light text-sm mb-2">{field.label}</label>
                      <textarea
                        rows={3}
                        value={value}
                        onChange={(e) => update(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.key}>
                    <label className="block text-ld-light text-sm mb-2">{field.label}</label>
                    <input
                      value={value}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                );
              })}
            </div>

            {group.id === "announcement" && (
              <div className="space-y-3">
                <p className="text-ld-silver text-sm">
                  Messages scroll across the strip above the header. Leave the list empty to
                  show your phone number and address instead.
                </p>

                <div className="flex gap-3">
                  <input
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAnnouncement();
                      }
                    }}
                    className={inputClass}
                    placeholder="e.g. Free delivery on orders over Rs 5,000"
                  />
                  <button
                    type="button"
                    onClick={addAnnouncement}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-ld-gold/15 text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/25 transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {settings.announcementMessages.length > 0 ? (
                  <ul className="space-y-2">
                    {settings.announcementMessages.map((message, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-ld-grey/40 bg-ld-dark/60 px-3 py-2"
                      >
                        <input
                          value={message}
                          onChange={(e) => updateAnnouncement(index, e.target.value)}
                          aria-label={`Ticker message ${index + 1}`}
                          className="flex-1 min-w-0 bg-transparent text-white text-sm focus:outline-none"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveAnnouncement(index, -1)}
                            disabled={index === 0}
                            className="px-2 py-1 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveAnnouncement(index, 1)}
                            disabled={index === settings.announcementMessages.length - 1}
                            className="px-2 py-1 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAnnouncement(index)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label={`Remove ticker message ${index + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ld-silver text-sm">
                    No ticker messages — your contact details will be shown.
                  </p>
                )}
              </div>
            )}

            {group.id === "about" && (
              <div className="space-y-3 pt-2 border-t border-ld-grey/30">
                <div>
                  <h3 className="text-white font-medium">About Content</h3>
                  <p className="text-ld-silver text-sm mt-1">
                    Add cards, headings, and paragraphs in any order. Consecutive cards appear in a
                    grid on the homepage.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <CustomSelect
                      className="w-full sm:w-40"
                      value={blockType}
                      onChange={(value) =>
                        setBlockType(value as "heading" | "paragraph" | "card")
                      }
                      options={[
                        { value: "card", label: "Card" },
                        { value: "heading", label: "Heading" },
                        { value: "paragraph", label: "Paragraph" },
                      ]}
                    />
                    <input
                      value={blockText}
                      onChange={(e) => setBlockText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && blockType !== "card") {
                          e.preventDefault();
                          addAboutBlock();
                        }
                      }}
                      className={inputClass}
                      placeholder={
                        blockType === "card"
                          ? "Card title"
                          : blockType === "heading"
                            ? "e.g. Our Philosophy"
                            : "Write a paragraph about your brand..."
                      }
                    />
                    {blockType !== "card" && (
                      <button
                        type="button"
                        onClick={addAboutBlock}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-ld-gold/15 text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/25 transition-colors shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    )}
                  </div>

                  {blockType === "card" && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <textarea
                        rows={3}
                        value={blockDescription}
                        onChange={(e) => setBlockDescription(e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder="Card description"
                      />
                      <button
                        type="button"
                        onClick={addAboutBlock}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-ld-gold/15 text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/25 transition-colors shrink-0 self-start"
                      >
                        <Plus className="w-4 h-4" />
                        Add Card
                      </button>
                    </div>
                  )}
                </div>

                {settings.aboutBlocks.length > 0 ? (
                  <ul className="space-y-2">
                    {settings.aboutBlocks.map((block, index) => (
                      <li
                        key={`${block.type}-${index}-${block.text.slice(0, 12)}`}
                        className="flex items-start gap-3 rounded-xl border border-ld-grey/40 bg-ld-dark/60 px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="inline-block mb-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-ld-gold/25 text-ld-gold-light bg-ld-gold/10">
                            {block.type}
                          </span>
                          <p
                            className={
                              block.type === "paragraph"
                                ? "text-ld-light text-sm leading-relaxed"
                                : "text-white font-semibold"
                            }
                          >
                            {block.text}
                          </p>
                          {block.type === "card" && block.description && (
                            <p className="text-ld-silver text-sm mt-1 leading-relaxed">
                              {block.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveAboutBlock(index, -1)}
                            disabled={index === 0}
                            className="px-2 py-1 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveAboutBlock(index, 1)}
                            disabled={index === settings.aboutBlocks.length - 1}
                            className="px-2 py-1 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAboutBlock(index)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Remove block"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ld-silver text-sm">No content blocks yet.</p>
                )}
              </div>
            )}

            {group.id === "faq" && (
              <div className="space-y-3 pt-2 border-t border-ld-grey/30 md:col-span-2">
                <div>
                  <h3 className="text-white font-medium">FAQ Items</h3>
                  <p className="text-ld-silver text-sm mt-1">
                    Add questions and answers shown on the FAQ page.
                  </p>
                </div>
                <input
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className={inputClass}
                  placeholder="Question"
                />
                <textarea
                  rows={3}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className={inputClass}
                  placeholder="Answer"
                />
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-ld-gold/15 text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/25 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </button>

                {settings.faqs.length > 0 ? (
                  <ul className="space-y-2">
                    {settings.faqs.map((faq, index) => (
                      <li
                        key={`${faq.question}-${index}`}
                        className="flex items-start gap-3 rounded-xl border border-ld-grey/40 bg-ld-dark/60 px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">{faq.question}</p>
                          <p className="text-ld-silver text-sm mt-1 leading-relaxed">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveFaq(index, -1)}
                            disabled={index === 0}
                            className="px-2 py-1 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFaq(index, 1)}
                            disabled={index === settings.faqs.length - 1}
                            className="px-2 py-1 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Remove FAQ"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ld-silver text-sm">No FAQs yet.</p>
                )}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
