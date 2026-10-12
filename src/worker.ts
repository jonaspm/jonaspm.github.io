/// <reference types="@cloudflare/workers-types" />
// Cloudflare Worker entry. Wraps the Astro CF server handler with EmDash's
// scheduled() sweep so `triggers.crons` has something to call.
import handler, { createScheduledHandler } from '@emdash-cms/cloudflare/worker'

export default {
	...handler,
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler
