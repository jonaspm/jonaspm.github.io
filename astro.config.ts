import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite';

import mcp from "astro-mcp";

// https://astro.build/config
export default defineConfig({
  site: "https://jonaspm.github.io",
  integrations: [mcp()],
  server: {
    host: true,
    port: 4321
  },
  vite: {
    plugins: [tailwindcss()]
  }
});