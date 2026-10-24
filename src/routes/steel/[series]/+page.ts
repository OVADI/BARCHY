import { error, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { loadFamily } from '$lib/steel/load';
import { SERIES_FAMILY, seriesFromSlug, seriesSlug, sizeSlug } from '$lib/steel/series';
import type { PageLoad } from './$types';

// Client-side only: the data is per family JSON, so this page is served by the SPA fallback.
export const prerender = false;
export const ssr = false;

/** /steel/hea opens the middle size of the series. */
export const load: PageLoad = async ({ params, fetch }) => {
	const series = seriesFromSlug(params.series);
	if (!series) error(404, 'Unknown series');
	const file = await loadFamily(SERIES_FAMILY[series], fetch);
	const list = file.sections.filter((s) => s.series === series);
	const middle = list[Math.floor(list.length / 2)];
	if (!middle) error(404, 'Empty series');
	redirect(
		307,
		resolve('/steel/[series]/[size]', { series: seriesSlug(series), size: sizeSlug(middle) })
	);
};
