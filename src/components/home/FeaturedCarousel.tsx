"use client";

import Carousel from "@/components/ui/Carousel";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import { ProductLabels } from "@/types/site";

interface FeaturedCarouselProps {
  products: Product[];
  labels: ProductLabels;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
  ariaLabel?: string;
}

export default function FeaturedCarousel({
  products,
  labels,
  whatsappNumber,
  siteName,
  siteUrl,
  ariaLabel,
}: FeaturedCarouselProps) {
  if (!products.length) return null;

  return (
    <Carousel
      ariaLabel={ariaLabel}
      slideClassName="w-[78%] sm:w-[46%] md:w-[31%] lg:w-[23.5%]"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          labels={labels}
          index={index}
          whatsappNumber={whatsappNumber}
          siteName={siteName}
          siteUrl={siteUrl}
        />
      ))}
    </Carousel>
  );
}
