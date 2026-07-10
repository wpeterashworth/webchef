import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Build a fully static site (plain HTML/CSS/JS — no Node server needed).
    // `fallback` makes it a single-page app: any route not prerendered is
    // served by 200.html, which then does client-side routing. This is what
    // lets the browser-only auth routes (login/signup/lesson) work.
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "200.html",
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
