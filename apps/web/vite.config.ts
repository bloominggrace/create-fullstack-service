import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter, type Config } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import type { ViteUserConfig } from 'vitest/config';

const testConfig: ViteUserConfig = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
};

const routerConfig: Partial<Config> = {
  target: 'react',
  autoCodeSplitting: true,
};

export default defineConfig({
  plugins: [tanstackRouter(routerConfig), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  ...testConfig,
})
