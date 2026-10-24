import type { Fact } from '$lib/schema/fact';

type NumberFormat = (value: number, options?: Intl.NumberFormatOptions) => string;

const SUP: Record<string, string> = {
	'-': '⁻',
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹'
};

/** 0.000012 → '12 · 10⁻⁶'; ordinary numbers through the locale formatter. */
export function formatValue(value: number, fmt: NumberFormat): string {
	if (value !== 0 && Math.abs(value) < 0.001) {
		const exp = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
		const mantissa = Number((value / 10 ** exp).toPrecision(6));
		return `${fmt(mantissa, { maximumFractionDigits: 3 })} · 10${[...String(exp)].map((c) => SUP[c]).join('')}`;
	}
	return fmt(value, { maximumFractionDigits: 3 });
}

const BOUND: Partial<Record<NonNullable<Fact['bound']>, string>> = { min: '≥ ', max: '≤ ' };

/**
 * A fact's value as one string: 'l/15 – l/20', 'L/25', '235 N/mm²', '600 – 630 mm',
 * '≥ 0,9 × 1,2 m', '≤ 0,188 m'. For a divisor range the smaller fraction (larger n) is written last.
 */
export function formatFact(
	fact: Pick<Fact, 'value' | 'unit' | 'divisorOf' | 'bound' | 'by'>,
	fmt: NumberFormat
): string {
	const unit = fact.unit ? ` ${fact.unit}` : '';
	const prefix = (fact.bound && BOUND[fact.bound]) ?? '';
	if (fact.divisorOf) {
		const d = fact.divisorOf;
		if (Array.isArray(fact.value)) {
			const [lo, hi] = fact.value;
			return `${d}/${fmt(lo)} – ${d}/${fmt(hi)}`;
		}
		return `${prefix}${d}/${fmt(fact.value)}`;
	}
	if (Array.isArray(fact.value)) {
		return `${formatValue(fact.value[0], fmt)} – ${formatValue(fact.value[1], fmt)}${unit}`;
	}
	const by = fact.by !== undefined ? ` × ${formatValue(fact.by, fmt)}` : '';
	return `${prefix}${formatValue(fact.value, fmt)}${by}${unit}`;
}
