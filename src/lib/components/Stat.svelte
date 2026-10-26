<script lang="ts">
	import NumberBadge from './NumberBadge.svelte';
	import { formatNumber } from '$lib/i18n/index.svelte';

	interface Props {
		value: number | string;
		/** Shown as a superscript next to the number, e.g. 'kg/m'. */
		unit?: string;
		/** Caption under the number. */
		label?: string;
		/** Number that matches a marker in a drawing. */
		badge?: number;
		size?: 'xl' | 'lg' | 'md';
		/** Intl options when value is a number. */
		format?: Intl.NumberFormatOptions;
	}

	let { value, unit, label, badge, size = 'lg', format }: Props = $props();

	const text = $derived(typeof value === 'number' ? formatNumber(value, format) : value);
</script>

<div class="stat">
	<p class="figure">
		<span class="num t-numeral-{size}">{text}</span>{#if unit}<sup class="unit size-{size}"
				>{unit}</sup
			>{/if}
	</p>
	{#if label}<p class="caption t-body-sm">
			{#if badge}<NumberBadge n={badge} />{/if}{label}
		</p>{/if}
</div>

<style>
	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
	}
	.figure {
		display: flex;
		align-items: flex-start;
		gap: var(--space-1);
		flex-wrap: wrap;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.unit {
		font: 500 16px/1 var(--font-sans);
		vertical-align: baseline;
		position: static;
		margin-top: 0.1em;
	}
	.unit.size-md {
		font-size: 13px;
	}
	.caption {
		opacity: 0.85;
	}
</style>
