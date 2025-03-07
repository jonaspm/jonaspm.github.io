import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://jonaspm.github.io",
  integrations: [react()],
  server: {
    host: true
  },
  vite: {
    plugins: [tailwindcss()]
  }
});