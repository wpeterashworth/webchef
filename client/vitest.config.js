import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

const repoRoot = resolve(import.meta.dirname, '..');

export default defineConfig({
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  plugins: [sveltekit()],
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
