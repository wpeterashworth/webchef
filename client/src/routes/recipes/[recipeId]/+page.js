// The root layout sets `prerender = true`, but recipe ids live in the database,
// so there is no list of routes to prerender at build time (unlike
// lesson/[lessonId], which can enumerate its ids from the bundled JSON).
//
// Turning prerendering off here means the adapter-static `fallback` (200.html)
// serves these URLs, and the page fetches its recipe in the browser.
export const prerender = false;
