import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
export default defineConfig({
  base: './',
  assetsInclude: ['**/*.glb', '**/*.png', '**/*.jpg', '**/*.jpeg'],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
    },
  },
  plugins: [glsl()],
});
