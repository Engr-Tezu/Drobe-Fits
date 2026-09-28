import Image from "next/image";
import HeroHeadline from "./HeroHeadline";
import { SiteSettings } from "@/types/site";

/** Used when the admin has not set a banner (or clears the field). */
const FALLBACK_BANNER = "/banner.jpeg";

/**
 * The banner uses three proportional sizes so the complete uploaded artwork is
 * always visible. The browser chooses a smaller file on phones without using
 * object-cover, which would crop the artwork.
 *
 * The image itself is admin-managed via Settings → Hero → Main Banner Image;
 * a replacement of a different shape still fills the frame via object-cover.
 */
export default function HeroBanner({ settings }: { settings: SiteSettings }) {
  const bannerSrc = settings.heroBannerUrl?.trim() || FALLBACK_BANNER;
  const mobileSrc = settings.heroBannerMobileUrl?.trim() || bannerSrc;
  const tabletSrc = settings.heroBannerTabletUrl?.trim() || bannerSrc;
  const desktopSrc = settings.heroBannerDesktopUrl?.trim() || bannerSrc;

  return (
    <section className="bg-am-dark">
      <div className="relative mx-auto w-full max-w-[1600px]">
        <picture className="block">
          <source media="(min-width: 1024px)" srcSet={desktopSrc} />
          <source media="(min-width: 640px)" srcSet={tabletSrc} />
          <Image
            src={mobileSrc}
            alt={`${settings.siteName} — ${settings.heroBadge}`}
            width={1600}
            height={777}
            priority
            quality={90}
            sizes="100vw"
            className="block h-auto w-full"
          />
        </picture>
      </div>

      <HeroHeadline settings={settings} />
    </section>
  );
}
