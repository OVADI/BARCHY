import type { SteelFamily, SteelSection } from '$lib/schema/steel';
import { PRIMARY_SERIES, type SteelSeries } from '$lib/schema/steel-constants';

/** Which family file a series lives in. */
export const SERIES_FAMILY: Record<SteelSeries, SteelFamily> = {
	HEA: 'HE',
	HEB: 'HE',
	HEM: 'HE',
	HEAA: 'HE',
	HEC: 'HE',
	HEx: 'HE',
	IPE: 'IPE',
	IPEA: 'IPE',
	IPEO: 'IPE',
	IPER: 'IPE',
	IPEV: 'IPE',
	IPEx: 'IPE',
	UNP: 'UNP',
	SHS: 'SHS',
	RHS: 'RHS',
	CHS: 'CHS'
};

export const ALL_SERIES = Object.keys(SERIES_FAMILY) as SteelSeries[];
export const MORE_SERIES = ALL_SERIES.filter((s) => !PRIMARY_SERIES.includes(s));
export { PRIMARY_SERIES };

/** Pill label: 'HE…x' and 'IPE…x' are weight series. */
export function seriesLabel(series: SteelSeries): string {
	if (series === 'HEx') return 'HE ×';
	if (series === 'IPEx') return 'IPE ×';
	if (series.startsWith('IPE') && series.length === 4) return `IPE ${series[3]}`;
	return series;
}

/** URL segment for a series: 'hea', 'ipeo', 'hex'. */
export const seriesSlug = (series: SteelSeries) => series.toLowerCase();

export function seriesFromSlug(slug: string): SteelSeries | undefined {
	return ALL_SERIES.find((s) => s.toLowerCase() === slug.toLowerCase());
}

/** URL segment for a size, unique within its series: '200', '600x137', '100x100x5', '48.3x3.2'. */
export function sizeSlug(s: Pick<SteelSection, 'size' | 'variant'>): string {
	return s.variant?.startsWith('x') ? `${s.size}${s.variant}` : s.size;
}
