import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { generateEntries } from 'vite-magic-tree-shaking';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const external = ['react', 'react/jsx-runtime', '@tanstack/react-query', 'osv-api-client'];

export default defineConfig({
  build: {
    lib: {
      entry: generateEntries(__dirname),
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    sourcemap: true,
    minify: false,
  },
});
