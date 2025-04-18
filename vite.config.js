import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  assetsInclude: ["**/*.glb"],
  plugins: [
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
});
