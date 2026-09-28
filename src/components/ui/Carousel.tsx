"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode[];
  /** Tailwind width classes applied to each slide at each breakpoint. */
  slideClassName?: string;
  ariaLabel?: string;
  /** Advance on its own, looping back to the start at the end. */
  autoPlay?: boolean;
  /** Milliseconds between automatic steps. */
  autoPlayInterval?: number;
}

/**
 * Horizontal scroll-snap slider. Uses native overflow scrolling so touch
 * swipe, trackpads and keyboard all work for free; the arrows and the
 * autoplay timer just drive scrollTo().
 */
export default function Carousel({
  children,
  slideClassName = "w-[78%] sm:w-[46%] md:w-[31%] lg:w-[23.5%]",
  ariaLabel,
  autoPlay = false,
  autoPlayInterval = 3500,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Autoplay stops while the visitor is reading or interacting with the track.
  const [paused, setPaused] = useState(false);

  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // 2px slack absorbs sub-pixel rounding at the extremes.
    setCanScrollLeft(track.scrollLeft > 2);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncArrows();
    track.addEventListener("scroll", syncArrows, { passive: true });

    const observer = new ResizeObserver(syncArrows);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", syncArrows);
      observer.disconnect();
    };
  }, [syncArrows, children.length]);

  /** Scrolls forward by exactly one slide, wrapping to the start at the end. */
  const stepForward = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const slide = first.getBoundingClientRect().width + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const next = track.scrollLeft + slide;

    track.scrollTo({ left: next > maxScroll - 2 ? 0 : next, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!autoPlay || paused) return;
    // Nothing to advance through when every slide already fits.
    if (!canScrollRight && !canScrollLeft) return;
    // Honour the OS "reduce motion" preference.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(stepForward, autoPlayInterval);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, autoPlayInterval, stepForward, canScrollRight, canScrollLeft]);

  // Don't animate against a backgrounded tab; it just piles up scroll work.
  useEffect(() => {
    if (!autoPlay) return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [autoPlay]);

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    // Leave a sliver of the previous slide visible as a position cue.
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!children.length) return null;

  const pauseProps = autoPlay
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onFocusCapture: () => setPaused(true),
        onBlurCapture: () => setPaused(false),
        onTouchStart: () => setPaused(true),
      }
    : {};

  return (
    <div className="relative" {...pauseProps}>
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 pb-2 scrollbar-hide sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0"
      >
        {children.map((child, index) => (
          <div key={index} className={`shrink-0 snap-start ${slideClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {/* Arrows are pointer affordances; on touch the track is swipeable. */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Previous"
        disabled={!canScrollLeft}
        className={`absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-am-line bg-am-card text-am-ink shadow-md transition-opacity hover:border-am-gold hover:text-am-gold lg:flex ${
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Next"
        disabled={!canScrollRight}
        className={`absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-am-line bg-am-card text-am-ink shadow-md transition-opacity hover:border-am-gold hover:text-am-gold lg:flex ${
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
