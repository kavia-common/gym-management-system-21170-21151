 // PUBLIC_INTERFACE
 /**
  * getSiteURL: Returns the base site URL from env (REACT_APP_SITE_URL) or window.location.origin.
  * Avoids trailing slash.
  */
 export function getSiteURL() {
   const env = process.env.REACT_APP_SITE_URL;
   const origin = typeof window !== 'undefined' ? window.location.origin : '';
   const base = (env && env.trim().length > 0 ? env : origin) || '';
   if (!base) return '';
   return base.endsWith('/') ? base.slice(0, -1) : base;
 }
 export default getSiteURL;
