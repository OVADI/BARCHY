import { base } from '$app/paths';
import type { SteelFamily } from '$lib/schema/steel';
import type { ClientSteelFile } from './client';

const cache = new Map<SteelFamily, Promise<ClientSteelFile>>();

/** Loads one family file (precached by the service worker, so this works offline). */
export function loadFamily(
	family: SteelFamily,
	fetcher: typeof fetch = fetch
): Promise<ClientSteelFile> {
	let p = cache.get(family);
	if (!p) {
		p = fetcher(`${base}/data/steel/${family.toLowerCase()}.json`).then((r) => {
			if (!r.ok) throw new Error(`${r.status} loading ${family}`);
			return r.json() as Promise<ClientSteelFile>;
		});
		p.catch(() => cache.delete(family));
		cache.set(family, p);
	}
	return p;
}
