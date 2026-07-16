import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['../tests/**/*.test.js', '../tests/**/*.spec.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'client/build/']
    }
  }
});
