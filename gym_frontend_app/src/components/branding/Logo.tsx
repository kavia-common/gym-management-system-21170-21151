import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Logo: Displays the Gym Management brand logo with responsive sizing.
 */
export default function Logo() {
  return (
    <div
      className="logo-wrap"
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 12, // theme-consistent spacing near header
      }}
      aria-label="Gym Management brand"
    >
      {/* Using public asset path so it is served statically */}
      <img
        src="/assets/logo.png"
        alt="Gym Management"
        style={{
          maxWidth: '140px', // desktop
          width: '100%',
          height: 'auto',
        }}
        className="auth-logo"
      />
      <style>
        {`
          /* Responsive tweak for smaller screens */
          @media (max-width: 480px) {
            .auth-logo {
              max-width: 110px; /* mobile */
            }
          }
        `}
      </style>
    </div>
  );
}
