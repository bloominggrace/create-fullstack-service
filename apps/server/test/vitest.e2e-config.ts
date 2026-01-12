import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@test': path.resolve(__dirname),
    },
  },
  test: {
    globals: true,
    setupFiles: 'vitest.setup.ts',
    globalSetup: 'vitest.globalSetup.ts',
    include: ['test/**/*.e2e-spec.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/main.ts'],
    },
  },
});
