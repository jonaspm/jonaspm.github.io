import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://jonaspm.github.io",
  integrations: [tailwind()],
  server: {
    host: true
  },
  experimental: {
    serverIslands: true
  }
});