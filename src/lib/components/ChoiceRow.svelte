<script lang="ts">
	import { formatNumber } from '$lib/i18n/index.svelte';
	import Pill from './Pill.svelte';

	interface Props {
		label: string;
		options: number[];
		value: number;
		/** Shown after each number, e.g. 'mm'. */
		unit?: string;
		onchange: (value: number) => void;
	}

	/** One row of number pills, e.g. widths or diameters; scrolls sideways when it does not fit. */
	let { label, options, value, unit = '', onchange }: Props = $props();

	let row: HTMLElement;

	// Keep the selected pill in view (only this row scrolls, never the page).
	$effect(() => {
		void value;
		void options;
		const pill = row.querySelector<HTMLElement>('.selected');
		if (!pill) return;
		const left = pill.offsetLeft - row.offsetLeft;
		if (left < row.scrollLeft || left + pill.offsetWidth > row.scrollLeft + row.clientWidth) {
			row.scrollLeft = left - (row.clientWidth - pill.offsetWidth) / 2;
		}
	});
</script>

<div class="choice">
	<span class="t-label t-muted">{label}</span>
	<div class="pills" role="group" aria-label={label} bind:this={row}>
		{#each options as o (o)}
			<Pill selected={o === value} onclick={() => onchange(o)}
				>{formatNumber(o, { maximumFractionDigits: 2 })}{unit ? ` ${unit}` : ''}</Pill
			>
		{/each}
	</div>
</div>

<style>
	.choice {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
	}
	.pills {
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
		scrollbar-width: none;
	}
</style>
