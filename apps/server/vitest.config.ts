import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    globalSetup: 'vitest.globalSetup.ts',
    include: ['src/**/*.spec.ts'],
  },
  plugins: [swc.vite()],
});
