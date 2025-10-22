import React, { useMemo, useState } from 'react';

/**
 * We try to use import-based asset resolution as primary (works with CRA/Vite bundlers),
 * and gracefully fall back to public path /assets/logo.png if the import path is not present
 * in the repository structure.
 *
 * Note: In this project, images are served from public/assets. Importing a non-existent
 * src/assets/logo.png would fail compile-time, so we only rely on public path here.
 * If later an src/assets/logo.png is added, switching to import-based resolution is just:
 *   import logoUrl from '../../assets/logo.png';
 * and set `resolvedSrc = logoUrl`.
 */

type LogoProps = {
  /** Size in pixels for max width; height stays auto. Default 120. */
  size?: number;
  /** Optional alt text override. */
  alt?: string;
  /** Optional className to merge. */
  className?: string;
};

// PUBLIC_INTERFACE
export default function Logo({ size = 120, alt = 'Gym Manager Logo', className = '' }: LogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Resolve via public path so it does not depend on TS type declarations for assets.
  const resolvedSrc = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
    const path = '/assets/logo.png';
    return base ? `${base}${path}` : path;
  }, []);

  const mergedClass = `auth-logo ${className}`.trim();

  return (
    <div
      className="logo-wrap"
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 12,
      }}
      aria-label="Gym Manager brand"
    >
      {!imgFailed ? (
        <img
          src={resolvedSrc}
          alt={alt}
          width={size}
          style={{
            maxWidth: size,
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
          className={mergedClass}
          loading="eager"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      ) : (
        // Graceful fallback: simple SVG-like shape with brand initials
        <div
          role="img"
          aria-label={alt}
          className={mergedClass}
          style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: size / 2,
            border: '1px solid var(--border, #E5E7EB)',
            background:
              'radial-gradient(circle at 30% 20%, rgba(30,58,138,0.12), rgba(245,158,11,0.12))',
            color: 'var(--text, #111827)',
            fontWeight: 800,
            letterSpacing: 1,
            fontFamily:
              'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          GM
        </div>
      )}

      <style>
        {`
          /* Responsive tweak for smaller screens */
          @media (max-width: 480px) {
            .auth-logo {
              max-width: ${Math.max(64, Math.min(120, size - 12))}px;
            }
          }
        `}
      </style>
    </div>
  );
}
