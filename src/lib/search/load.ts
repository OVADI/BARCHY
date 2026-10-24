import { base } from '$app/paths';
import type { SearchIndex } from './types';

let cached: Promise<SearchIndex> | undefined;

/** Loads the prerendered index once (precached by the service worker, so this works offline). */
export function loadSearchIndex(fetcher: typeof fetch = fetch): Promise<SearchIndex> {
	if (!cached) {
		cached = fetcher(`${base}/data/search.json`).then((r) => {
			if (!r.ok) throw new Error(`${r.status} loading search index`);
			return r.json() as Promise<SearchIndex>;
		});
		cached.catch(() => (cached = undefined));
	}
	return cached;
}
