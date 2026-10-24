<script lang="ts" module>
	export interface GridValue {
		symbol: string;
		name: string;
		value: number;
		unit: string;
		/** Maximum fraction digits shown; 3 when left out. */
		digits?: number;
		flagged?: boolean;
	}
</script>

<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
	import FlagMark from './FlagMark.svelte';
	import Stat from './Stat.svelte';

	/** Read-only two-column grid of values; the steel screens use QuantityGrid instead. */
	let { values, label }: { values: GridValue[]; label: string } = $props();
</script>

<section class="grid" aria-label={label}>
	{#each values as v (v.symbol)}
		<div class="tile">
			<span class="head">
				<span class="t-symbol">{v.symbol}</span>
				{#if v.flagged}<FlagMark label={t('status.flagged')} />{/if}
			</span>
			<Stat
				value={v.value}
				unit={v.unit}
				size="md"
				format={{ maximumFractionDigits: v.digits ?? 3 }}
			/>
			<span class="name t-body-sm">{v.name}</span>
		</div>
	{/each}
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.tile {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--type-data);
		color: var(--type-data-ink);
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}
	.name {
		color: var(--on-tile-muted);
	}
</style>
