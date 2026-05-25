"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  src: string | null | undefined;
  alt: string;
  /** Pixel dimensions of the trigger avatar (width = height). */
  size?: number;
  /** Override font-size for the fallback initial. */
  fallbackFontSize?: number;
  /** Extra classes for the trigger element (border, ring, etc.). */
  className?: string;
};

/**
 * Round avatar that opens a lightbox popup with the full-size profile picture
 * when clicked. When no image is provided, renders the user's initial as a
 * non-clickable fallback.
 *
 * Safe to nest inside a parent <Link> — click is stopped from bubbling so
 * navigation does not fire when the user opens the picture.
 */
export function ProfileAvatar({
  src,
  alt,
  size = 64,
  fallbackFontSize,
  className,
}: ProfileAvatarProps) {
  const [open, setOpen] = useState(false);
  const initial = (alt || "?").trim().slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dimensionStyle = { width: size, height: size };
  const fontStyle = fallbackFontSize ? { fontSize: fallbackFontSize } : undefined;

  if (!src) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-border bg-indigo-50 font-bold text-indigo-700",
          className,
        )}
        style={{ ...dimensionStyle, ...fontStyle }}
        aria-hidden={alt ? undefined : true}
      >
        {initial}
      </div>
    );
  }

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        aria-label={`View ${alt} photo`}
        title="Click to view photo"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }
        }}
        className={cn(
          "inline-block shrink-0 cursor-zoom-in overflow-hidden rounded-full border border-border bg-white align-middle transition hover:ring-2 hover:ring-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400",
          className,
        )}
        style={dimensionStyle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </span>

      {open ? <ProfileLightbox src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ProfileLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-indigo-950/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} photo`}
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 shadow-md transition hover:bg-indigo-50 hover:text-indigo-900"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <figure
        className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/20"
        />
        <figcaption className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-indigo-900 shadow">
          {alt}
        </figcaption>
      </figure>
    </div>
  );
}
