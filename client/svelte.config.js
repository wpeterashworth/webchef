import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Build to a folder of plain files. The fallback page lets the
    // client-side router handle dynamic routes (e.g. /login) on refresh.
    adapter: adapter({
      fallback: "200.html",
    }),
  },
};

export default config;
