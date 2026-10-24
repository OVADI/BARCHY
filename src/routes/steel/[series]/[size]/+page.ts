import { error } from '@sveltejs/kit';
import { loadFamily } from '$lib/steel/load';
import { SERIES_FAMILY, seriesFromSlug, sizeSlug } from '$lib/steel/series';
import type { PageLoad } from './$types';

// One shareable URL per section without prerendering ~400 pages: rendered in the browser from
// the precached family JSON; GitHub Pages and the service worker serve the SPA fallback.
export const prerender = false;
export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
	const series = seriesFromSlug(params.series);
	if (!series) error(404, 'Unknown series');
	const file = await loadFamily(SERIES_FAMILY[series], fetch);
	const inSeries = file.sections.filter((s) => s.series === series);
	const section = inSeries.find((s) => sizeSlug(s) === params.size);
	if (!section) error(404, 'Unknown size');
	return { series, section, inSeries, source: file.source, origin: file.origin };
};
