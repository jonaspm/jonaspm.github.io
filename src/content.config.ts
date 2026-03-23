import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localizedString = z.object({
  en: z.string(),
  es: z.string(),
});

const projects = defineCollection({
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.json",
  }),
  schema: z.object({
    name: z.string(),
    url: z.url(),
    image: z.string(),
    order: z.number().int().nonnegative(),
    description: localizedString,
    skills: z.array(localizedString),
  }),
});

export const collections = { projects };