import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ApiHooksNpm',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', '@tanstack/react-query'],
      output: {
        globals: {
          react: 'React',
          '@tanstack/react-query': 'ReactQuery',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
