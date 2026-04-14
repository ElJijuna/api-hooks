import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ApiHooksGh',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', '@tanstack/react-query', 'gh-api-client'],
      output: {
        globals: {
          react: 'React',
          '@tanstack/react-query': 'ReactQuery',
          'gh-api-client': 'GhApiClient',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
