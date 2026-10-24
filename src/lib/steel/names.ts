import { formatNumber } from '$lib/i18n/index.svelte';
import type { ClientSection } from './client';

/** Size in locale notation: '48,3×3,2' (NL) or '48.3×3.2' (EN); weight variants as '600 ×137'. */
export function sizeLabel(s: Pick<ClientSection, 'size' | 'variant'>): string {
	const main = s.size
		.split('x')
		.map((p) => formatNumber(Number(p), { maximumFractionDigits: 2 }))
		.join('×');
	return s.variant?.startsWith('x') ? `${main} ×${s.variant.slice(1)}` : main;
}

/** Display name; hollow sections get locale decimals, I- and U-sections keep their catalogue name. */
export function displayName(s: ClientSection): string {
	return s.shape === 'box' || s.shape === 'tube' ? `${s.series} ${sizeLabel(s)}` : s.name;
}
