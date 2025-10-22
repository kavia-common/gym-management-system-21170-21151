import React, { useMemo, useState } from 'react';

type LogoProps = {
  /** Size in pixels for max width; height stays auto. */
  size?: number;
  /** Optional alt text override. */
  alt?: string;
  /** Optional className to merge. */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * Logo: Displays the Gym Management brand logo with responsive sizing, public path resolution,
 * eager loading, and a graceful text fallback when the image cannot be loaded.
 */
export default function Logo({ size = 72, alt = 'Gym Management', className = '' }: LogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Prefer root-absolute public path; if app is hosted under subpath, PUBLIC_URL prefix will ensure correctness.
  const src = useMemo(() => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
    const path = '/assets/logo.png';
    // If PUBLIC_URL exists and is not root, use it; otherwise fallback to absolute.
    return base && base !== '' ? `${base}${path}` : path;
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
      aria-label="Gym Management brand"
    >
      {!imgFailed ? (
        <img
          src={src}
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
        <div
          role="img"
          aria-label={alt}
          className={mergedClass}
          style={{
            width: size,
            height: Math.round(size * 0.4),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            border: '1px solid var(--border, #E5E7EB)',
            background:
              'radial-gradient(120px 60px at 30% 20%, rgba(30,58,138,0.08), rgba(245,158,11,0.08))',
            color: 'var(--text, #111827)',
            fontWeight: 800,
            letterSpacing: 1,
            fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
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
              max-width: ${Math.max(48, Math.min(96, size - 12))}px;
            }
          }
        `}
      </style>
    </div>
  );
}
