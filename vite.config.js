import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  assetsInclude: ["**/*.glb", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.glsl"],
  resolve: {
    alias: {
      "@": "/src",
      "@assets": "/src/assets",
    },
  },
});
