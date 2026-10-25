<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { resolve } from '$app/paths';
	import FactTile from '$lib/components/FactTile.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import {
		checkStair,
		minRisers,
		STAIR_FACTS,
		stairLimits,
		type StairCheckId
	} from '$lib/checks/stair';
	import { formatNumber, t, type MessageKey } from '$lib/i18n/index.svelte';
	import type { SourceRef } from '$lib/schema/source';
	import { source } from '$lib/sources';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const limits = $derived(stairLimits(data.facts));

	// Floor height is a UI starting point, not a building value; going and width start at the Bbl limit.
	let rise = $state(2800);
	let risersSet = $state<number | null>(null);
	let goingSet = $state<number | null>(null);
	let widthSet = $state<number | null>(null);

	const autoRisers = $derived(minRisers(rise, limits.riserMax.mm));
	const risers = $derived(risersSet ?? autoRisers);
	const going = $derived(goingSet ?? limits.goingMin.mm);
	const width = $derived(widthSet ?? limits.widthMin.mm);
	const result = $derived(checkStair({ rise, risers, going, width }, limits));

	const LABEL: Record<StairCheckId, MessageKey> = {
		riserMax: 'stair.riser',
		goingMin: 'stair.going',
		widthMin: 'stair.width',
		riseMax: 'stair.rise'
	};
	const mm = (v: number, digits = 0) => `${formatNumber(v, { maximumFractionDigits: digits })} mm`;

	const used = new Set<string>(Object.values(STAIR_FACTS));
	const other = $derived(data.facts.filter((f) => !used.has(f.id)));

	const sources = $derived(
		[source('bbl'), ...data.facts.map((f) => f.source)].filter(
			(s, i, all): s is SourceRef => all.findIndex((x) => x.ref === s.ref) === i
		)
	);

	$effect(() => {
		saved.visit({ path: '/tools/stair', name: t('tools.stair') });
	});
</script>

<PageHeader title={t('tools.stair')} back={resolve('/tools')} />

<p class="t-body-sm t-muted scope">{t('stair.scope')}</p>

<Tile tone="surface" pad="md" as="section" label={t('stair.design')}>
	<h2 class="t-label t-muted">{t('stair.design')}</h2>
	<Stepper
		label={t('stair.rise')}
		value={rise}
		step={10}
		min={300}
		max={8000}
		unit="mm"
		onchange={(v) => (rise = v)}
	/>
	<Stepper
		label={t('stair.risers')}
		value={risers}
		step={1}
		min={2}
		max={60}
		hint={risersSet === null ? t('stair.auto') : undefined}
		onchange={(v) => (risersSet = v)}
	/>
	{#if risersSet !== null}
		<button type="button" class="reset t-body-sm" onclick={() => (risersSet = null)}
			>{t('stair.autoRisers', { n: autoRisers })}</button
		>
	{/if}
	<Stepper
		label={t('stair.going')}
		value={going}
		step={5}
		min={100}
		max={400}
		unit="mm"
		onchange={(v) => (goingSet = v)}
	/>
	<Stepper
		label={t('stair.width')}
		value={width}
		step={50}
		min={500}
		max={3000}
		unit="mm"
		onchange={(v) => (widthSet = v)}
	/>
</Tile>

<Tile tone="paper" pad="lg">
	<div class="stats">
		<Stat
			value={result.riser}
			unit="mm"
			size="lg"
			label={t('stair.riserResult')}
			format={{ maximumFractionDigits: 1 }}
		/>
		<Stat value={result.run} unit="mm" size="md" label={t('stair.run')} />
	</div>
</Tile>

<section class="checks" aria-label={t('stair.checks')} aria-live="polite">
	<h2 class="t-label t-muted">{t('stair.checks')}</h2>
	<ul>
		{#each result.checks as c (c.id)}
			<li class:fail={!c.ok}>
				<span class="mark" aria-hidden="true">
					{#if c.ok}<Check size={20} strokeWidth={2.5} />{:else}<X
							size={20}
							strokeWidth={2.5}
						/>{/if}
				</span>
				<span class="text">
					<span class="t-body">
						<span class="sr-only">{c.ok ? t('stair.ok') : t('stair.notOk')}:</span>
						{t(LABEL[c.id])}
						{mm(c.found, 1)}
						<span class="t-muted"
							>({t(c.fact.bound === 'max' ? 'stair.limitMax' : 'stair.limitMin', {
								value: mm(c.limit, 1)
							})})</span
						>
					</span>
					<span class="t-body-sm t-muted">{c.fact.source.ref}</span>
					{#if c.fact.status === 'flagged'}<FlagMark label={t('status.factFlagged')} />{/if}
				</span>
			</li>
		{/each}
	</ul>
	<p class="t-body-sm verdict">{result.ok ? t('stair.allOk') : t('stair.someFail')}</p>
</section>

{#if other.length}
	<section class="other">
		<h2 class="t-label t-muted">{t('stair.alsoApplies')}</h2>
		{#each other as fact (fact.id)}
			<FactTile {fact} />
		{/each}
	</section>
{/if}

<InfoFab {sources}>
	<p>{t('stair.info')}</p>
	<p>{t('status.flaggedLong')}</p>
</InfoFab>

<style>
	.scope {
		margin: 0 0 var(--space-3);
	}
	.reset {
		align-self: flex-start;
		min-height: 44px;
		padding: 0;
		background: none;
		border: none;
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}
	.stats {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.checks,
	.other {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
		margin-top: var(--space-4);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--type-requirement);
		color: var(--type-requirement-ink);
	}
	li.fail {
		background: var(--orange);
		color: var(--on-tile);
	}
	li :global(.t-muted) {
		color: inherit;
		opacity: 0.8;
	}
	.mark {
		flex: none;
		padding-top: 2px;
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}
	.verdict {
		font-weight: 500;
	}
</style>
