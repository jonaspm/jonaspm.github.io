import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://jonaspm.github.io",
  integrations: [react(), tailwind()],
  server: {
    host: true
  }
});