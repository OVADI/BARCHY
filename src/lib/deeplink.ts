import { tick } from 'svelte';
import { page } from '$app/state';

/**
 * Search links into prerendered screens with ?query and #hash. Prerendering cannot read the
 * query, so screens read it after mounting with these helpers.
 */
export function param(name: string): string | null {
	return page.url.searchParams.get(name);
}

export function numberParam(name: string): number | null {
	const v = Number(param(name) ?? NaN);
	return Number.isFinite(v) ? v : null;
}

/** Scrolls to the #hash element once the chosen tab has rendered, and marks it with data-found. */
export async function revealHash(): Promise<void> {
	await tick();
	const id = decodeURIComponent(page.url.hash.slice(1));
	const el = id ? document.getElementById(id) : null;
	if (!el) return;
	el.setAttribute('data-found', '');
	el.scrollIntoView({ block: 'center' });
}
