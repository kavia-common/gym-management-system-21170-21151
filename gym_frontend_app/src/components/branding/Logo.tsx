import React, { useMemo, useState } from 'react';

type LogoProps = {
  /** Explicit source URL. If provided, it will be used directly. */
  src?: string;
  /** Default descriptive alt text. */
  alt?: string;
  /** Width for the image element. If not set, falls back to size for convenience. */
  width?: number | string;
  /** Height for the image element. If not set, uses 'auto' to preserve aspect ratio. */
  height?: number | string;
  /** Legacy convenience: size controls width and maxWidth. Default 120. */
  size?: number;
  /** Optional className to merge. */
  className?: string;
};

// PUBLIC_INTERFACE
export default function Logo({
  src,
  alt = 'Gym Manager Logo',
  width,
  height,
  size = 120,
  className = '',
}: LogoProps) {
  const [srcIndex, setSrcIndex] = useState(0);

  // Build a robust base path for public assets.
  // In CRA/Vite builds, PUBLIC_URL may or may not be set. We normalize it here.
  const basePublicPath = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
    return base || '';
  }, []);

  // Candidates: prefer explicit src prop; otherwise try /logo.svg and /logo.png,
  // each prefixed with PUBLIC_URL when present, then absolute root fallbacks.
  const candidates = useMemo(() => {
    if (src) {
      return [src];
    }
    const svg = `${basePublicPath}/logo.svg`;
    const png = `${basePublicPath}/logo.png`;
    const fallbacks = ['/logo.svg', '/logo.png'];
    const list = [svg, png, ...fallbacks];
    // Deduplicate while preserving order
    return Array.from(new Set(list));
  }, [src, basePublicPath]);

  const currentSrc = candidates[Math.min(srcIndex, candidates.length - 1)];

  const handleError = () => {
    // Advance to next candidate if available
    setSrcIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
  };

  const mergedClass = `auth-logo ${className}`.trim();

  // Resolve width/height based on provided props, maintaining backwards compatibility with size
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? 'auto';

  return (
    <div
      className="logo-wrap header-logo"
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 12,
        background: 'transparent',
        border: 0,
        padding: 0,
        boxShadow: 'none',
      }}
      aria-label="Gym Manager brand"
    >
      <img
        src={currentSrc}
        alt={alt}
        width={resolvedWidth}
        height={resolvedHeight}
        style={{
          maxWidth: typeof resolvedWidth === 'number' ? resolvedWidth : undefined,
          width: typeof resolvedWidth === 'number' ? '100%' : resolvedWidth,
          height: resolvedHeight,
          objectFit: 'contain',
          display: 'block',
          background: 'transparent',
          border: 0,
          boxShadow: 'none',
          outline: 'none',
          WebkitMaskImage: 'none',
          maskImage: 'none',
        }}
        className={mergedClass}
        loading="eager"
        decoding="async"
        onError={handleError}
      />

      <style>
        {`
          /* Ensure logo and wrapper are always transparent and unboxed */
          .header-logo,
          .brand-logo,
          .logo-wrap {
            background: transparent !important;
            border: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .auth-logo {
            display: block;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
            outline: none !important;
            margin-inline: auto;
          }
          /* Remove default img focus or hover outlines within anchors for this component */
          img.auth-logo:focus,
          img.auth-logo:focus-visible,
          img.auth-logo:hover {
            outline: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          /* Responsive tweak for smaller screens */
          @media (max-width: 480px) {
            .auth-logo {
              max-width: ${Math.max(64, Math.min(120, typeof size === 'number' ? size - 12 : 120))}px;
            }
          }
        `}
      </style>
    </div>
  );
}
