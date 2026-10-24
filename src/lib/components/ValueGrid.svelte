<script lang="ts" module>
	export interface GridValue {
		symbol: string;
		name: string;
		/** What the value means; shown in a card when the tile is tapped. */
		explain: string;
		value: number;
		unit: string;
		/** Maximum fraction digits shown; 3 when left out. */
		digits?: number;
		flagged?: boolean;
		/** Why the value is flagged, shown in the card. */
		note?: string;
	}
</script>

<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { t } from '$lib/i18n/index.svelte';
	import FlagMark from './FlagMark.svelte';
	import IconButton from './IconButton.svelte';
	import Stat from './Stat.svelte';

	/** Two-column grid of values that open an explanation card, like QuantityGrid on the steel screens. */
	let { values, label }: { values: GridValue[]; label: string } = $props();

	let open = $state<string | null>(null);
	const id = $props.id();

	const rows = $derived(
		values.reduce<GridValue[][]>((acc, v, i) => {
			if (i % 2 === 0) acc.push([v]);
			else acc[acc.length - 1]!.push(v);
			return acc;
		}, [])
	);
	const current = $derived(values.find((v) => v.symbol === open));
</script>

<section class="group" aria-label={label}>
	{#each rows as row, r (r)}
		<div class="row">
			{#each row as v (v.symbol)}
				<button
					type="button"
					class="tile"
					class:active={open === v.symbol}
					aria-expanded={open === v.symbol}
					aria-controls="{id}-card"
					onclick={() => (open = open === v.symbol ? null : v.symbol)}
				>
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
				</button>
			{/each}
		</div>
		{#if current && row.includes(current)}
			<div
				class="card"
				id="{id}-card"
				role="region"
				aria-label={t('profile.explain', { name: current.name })}
			>
				<div class="card-head">
					<h3 class="t-title">{current.name}</h3>
					<IconButton
						icon={X}
						tone="ghost"
						label={t('common.close')}
						onclick={() => (open = null)}
					/>
				</div>
				<p class="t-body">{current.explain}</p>
				{#if current.flagged && current.note}
					<div class="issue">
						<FlagMark label={t('status.flagged')} />
						<p class="t-body-sm">{current.note}</p>
					</div>
				{/if}
			</div>
		{/if}
	{/each}
</section>

<style>
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.tile {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-align: left;
		min-height: var(--touch);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--type-data);
		color: var(--type-data-ink);
	}
	.tile.active {
		outline: 3px solid var(--lavender);
		outline-offset: -3px;
	}
	.tile.active:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
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
	.card {
		background: var(--lavender);
		color: var(--on-tile);
		border-radius: var(--radius-lg);
		padding: var(--space-2) var(--space-2) var(--space-5) var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.card > :not(.card-head) {
		padding-right: var(--space-3);
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		padding-top: var(--space-2);
	}
	.issue {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
</style>
