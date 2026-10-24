<script lang="ts">
	import type { GuideStep, LineType } from '$lib/schema/drawing';

	interface Props {
		line?: LineType;
		/** Pen width in mm; drawn relative to the other weights, not at true size. */
		weight?: number;
		symbol?: GuideStep['symbol'];
		color?: GuideStep['color'];
		label?: string;
	}

	/** A line type as drawn on paper: dash pattern, relative weight and the symbol of a guide step. */
	let { line = 'solid', weight, symbol = 'line', color = 'black', label }: Props = $props();

	const W = 120;
	const H = $derived(symbol === 'cross' || symbol === 'diagonal' ? 44 : 24);
	const mid = $derived(H / 2);

	// 0.1 mm → 0.7, 0.8 mm → 5.6: thin and heavy pens stay apart at phone size.
	const width = $derived(weight === undefined ? 1.2 : Math.max(0.7, weight * 7));
	const dash = $derived(
		{
			solid: undefined,
			dashed: `${8 + width} ${4 + width}`,
			dashdot: `${16 + width} ${3 + width} ${1 + width / 2} ${3 + width}`,
			dotted: `0.01 ${3 + width * 2}`
		}[line]
	);
	const d = $derived(
		{
			line: `M8 ${mid}H${W - 8}`,
			double: `M8 ${mid - 4}H${W - 8}M8 ${mid + 4}H${W - 8}`,
			arrow: `M8 ${mid}H${W - 8}M8 ${mid}l7 -6M${W - 8} ${mid}l-7 6`,
			cross: `M14 8L${W - 14} ${H - 8}M14 ${H - 8}L${W - 14} 8`,
			diagonal: `M20 ${H - 6}L${W - 20} 6`
		}[symbol]
	);
</script>

<svg
	viewBox="0 0 {W} {H}"
	class="sample tone-{color}"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
>
	<path
		{d}
		fill="none"
		stroke="currentColor"
		stroke-width={width}
		stroke-dasharray={dash}
		stroke-linecap={line === 'dotted' ? 'round' : 'butt'}
	/>
</svg>

<style>
	.sample {
		display: block;
		width: 100%;
		height: auto;
		color: var(--on-tile);
	}
	/* Colours named in the source: the accent stands in for "another colour" (red in the Vademecum). */
	.tone-accent {
		color: var(--orange);
	}
	.tone-grey {
		color: color-mix(in srgb, var(--on-tile) 45%, var(--paper));
	}
</style>
