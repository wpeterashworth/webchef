// Turn the whole app into a single-page app (SPA).
// ssr = false: pages are rendered in the browser, not on a server. This is
// required because our Supabase auth runs entirely client-side and there is
// no server to render against.
export const ssr = false;

// Don't try to prerender pages at build time; the fallback (200.html) plus
// client-side routing handles every route, including dynamic ones.
export const prerender = false;
