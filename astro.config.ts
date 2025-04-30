import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://jonaspm.github.io",
  integrations: [],
  server: {
    host: true,
    port: 3434
  },
  vite: {
    plugins: [tailwindcss()]
  }
});