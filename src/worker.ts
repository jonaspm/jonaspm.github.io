/// <reference types="@cloudflare/workers-types" />
// Cloudflare Worker entry. Wraps the Astro CF server handler with EmDash's
// scheduled() sweep so `triggers.crons` has something to call.
//
// `www.jonasperusquia.com` is attached as a second custom domain purely so it
// can be 301-redirected to the apex here — passkeys and canonical URLs are
// bound to the apex hostname, so the app itself must never render on www.
import handler, { createScheduledHandler } from '@emdash-cms/cloudflare/worker'

const APEX_HOST = 'jonasperusquia.com'

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)
		if (url.hostname === `www.${APEX_HOST}`) {
			url.hostname = APEX_HOST
			return Response.redirect(url.toString(), 301)
		}
		return handler.fetch!(request, env, ctx)
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler
