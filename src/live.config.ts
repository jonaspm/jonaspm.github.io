import { defineLiveCollection } from 'astro:content'
import { emdashLoader } from 'emdash/runtime'

// The collection key MUST be `_emdash`: getEmDashCollection/getEmDashEntry
// resolve through getLiveCollection("_emdash", …) (src/query.ts:392).
export const collections = {
	_emdash: defineLiveCollection({ loader: emdashLoader() }),
}
