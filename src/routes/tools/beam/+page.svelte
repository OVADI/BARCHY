<script lang="ts">
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import BeamDiagram from '$lib/components/BeamDiagram.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import RuleNotes from '$lib/components/RuleNotes.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import {
		BEAM_GROUPS,
		beamVariants,
		estimateBeam,
		type BeamMaterial,
		type BeamResult
	} from '$lib/calc/beam';
	import { numberParam, param } from '$lib/deeplink';
	import { formatFact } from '$lib/facts/format';
	import { STEEL_FACT_GROUPS } from '$lib/facts/groups';
	import { shapeOf } from '$lib/facts/shapes';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import type { Condition } from '$lib/schema/fact';
	import type { SourceRef } from '$lib/schema/source';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const MATERIALS = ['steel', 'timber', 'concrete'] as const;
	let material = $state<BeamMaterial>('timber');
	const set = $derived(data[material]);
	const variants = $derived(beamVariants(set.facts, BEAM_GROUPS[material]));
	const groupIds = $derived(
		BEAM_GROUPS[material].filter((g) => variants.some((v) => v.group === g))
	);

	// Picks fall back to the first shape and variant when they do not belong to this material.
	let pickGroup = $state<string | null>(null);
	let pickVariant = $state<string | null>(null);
	const group = $derived(pickGroup && groupIds.includes(pickGroup) ? pickGroup : groupIds[0]!);
	const options = $derived(variants.filter((v) => v.group === group));
	const variant = $derived(options.find((v) => v.key === pickVariant) ?? options[0]!);

	// The span is a starting point for the UI, not a building value.
	let l = $state(8);
	const estimate = $derived(estimateBeam(variant, l));
	const lead = $derived(estimate.results[0]!);
	const shape = $derived(shapeOf(group, variant.key));

	// Opened as /tools/beam?material=steel&group=purlins&l=6
	onMount(() => {
		const m = param('material');
		if (m === 'steel' || m === 'timber' || m === 'concrete') material = m;
		pickGroup = param('group');
		l = numberParam('l') ?? l;
	});

	const groupLabel = (id: string): string => {
		const g = set.groups.find((x) => x.id === id);
		if (g) return g.label[i18n.locale];
		const steel = STEEL_FACT_GROUPS.find((x) => x.key === id);
		return steel ? t(steel.title) : id;
	};
	const groupNotes = $derived(set.groups.find((g) => g.id === group)?.notes);

	/**
	 * A size band in mm, or in m from 1 m up; rounded to 10 mm, since a rule of thumb is no finer.
	 * Both ends use the unit of the larger one, so a band reads as one quantity.
	 */
	const size = (r: BeamResult): { text: string; unit: string } => {
		const [lo, hi] = r.range!.map((m) => Math.round(m * 100) / 100) as [number, number];
		const inM = hi >= 1;
		const one = (m: number) =>
			inM ? formatNumber(m, { maximumFractionDigits: 2 }) : formatNumber(Math.round(m * 1000));
		return { text: lo === hi ? one(lo) : `${one(lo)} – ${one(hi)}`, unit: inM ? 'm' : 'mm' };
	};
	const conditionText = (c: Condition) => {
		const v = Array.isArray(c.value)
			? t('beam.rangeValue', { lo: formatNumber(c.value[0]), hi: formatNumber(c.value[1]) })
			: formatNumber(c.value);
		const sign = c.bound === 'max' ? '≤ ' : c.bound === 'min' ? '≥ ' : '';
		return `${c.symbol} ${c.bound === 'range' || c.bound === 'exact' ? '= ' : ''}${sign}${v} ${c.unit}`.trim();
	};

	const sources = $derived(
		variant.facts
			.map((f) => f.source)
			.filter((s, i, all): s is SourceRef => all.findIndex((x) => x.ref === s.ref) === i)
	);

	$effect(() => {
		saved.visit({ path: '/tools/beam', name: t('tools.beam') });
	});
</script>

<PageHeader title={t('tools.beam')} back={resolve('/tools')} />

<p class="t-body-sm t-muted scope">{t('beam.scope')}</p>

<div class="tabs" role="tablist" aria-label={t('beam.material')}>
	{#each MATERIALS as m (m)}
		<Pill kind="tab" selected={material === m} onclick={() => (material = m)}
			>{t(`${m}.title`)}</Pill
		>
	{/each}
</div>

<Tile tone="surface" pad="md" as="section" label={t('beam.design')}>
	<label class="field">
		<span class="t-label t-muted">{t('beam.shape')}</span>
		<select
			value={group}
			onchange={(e) => {
				pickGroup = e.currentTarget.value;
				pickVariant = null;
			}}
		>
			{#each groupIds as g (g)}<option value={g}>{groupLabel(g)}</option>{/each}
		</select>
	</label>
	{#if options.length > 1}
		<label class="field">
			<span class="t-label t-muted">{t('beam.variant')}</span>
			<select value={variant.key} onchange={(e) => (pickVariant = e.currentTarget.value)}>
				{#each options as v (v.key)}<option value={v.key}>{v.facts[0]!.label[i18n.locale]}</option
					>{/each}
			</select>
		</label>
	{/if}
	<Stepper
		label={t('beam.span')}
		value={l}
		step={0.5}
		min={0.5}
		max={150}
		unit="m"
		format={{ maximumFractionDigits: 1 }}
		onchange={(v) => (l = v)}
	/>
</Tile>

{#if shape}
	<figure class="diagram">
		<BeamDiagram {shape} label={groupLabel(group)} />
	</figure>
{/if}

{#if estimate.outside.length}
	<div class="warning" role="alert">
		<TriangleAlert size={20} strokeWidth={2} aria-hidden="true" />
		<p class="t-body-sm">
			{t('beam.outside', {
				l: formatNumber(l, { maximumFractionDigits: 1 }),
				range: estimate.outside.map(conditionText).join(', ')
			})}
		</p>
	</div>
{/if}

<Tile tone="paper" pad="lg">
	<div class="head">
		<span class="t-body-sm label">{lead.fact.label[i18n.locale]}</span>
		{#if lead.fact.status === 'flagged'}<FlagMark label={t('status.factFlagged')} />{/if}
	</div>
	{#if lead.range}
		{@const s = size(lead)}
		<Stat
			value={s.text}
			unit={s.unit}
			size={s.text.length > 7 ? 'md' : 'lg'}
			label={`${formatFact(lead.fact, formatNumber)} · ${t('beam.rounded')}`}
		/>
	{:else}
		<Stat value={formatFact(lead.fact, formatNumber)} size="md" label={t('beam.unknown')} />
	{/if}
	{#if lead.fact.scope}<p class="t-body-sm">
			{t('beam.applies')}: {lead.fact.scope[i18n.locale]}
		</p>{/if}
</Tile>

{#if estimate.results.length > 1}
	<ul class="results" aria-label={t('beam.more')}>
		{#each estimate.results.slice(1) as r (r.fact.id)}
			<li>
				<span class="what">
					<span class="t-body">{r.fact.label[i18n.locale]}</span>
					<span class="t-body-sm t-muted"
						>{formatFact(r.fact, formatNumber)}{#if r.kind === 'unknown'}{` · ${t(
								'beam.unknown'
							)}`}{/if}</span
					>
				</span>
				{#if r.range}
					{@const s = size(r)}
					<span class="value t-body">{r.fact.symbol} ≈ {s.text} {s.unit}</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

{#if groupNotes || lead.fact.notes}
	<div class="notes">
		<RuleNotes notes={[...(groupNotes ?? []), ...(lead.fact.notes ?? [])]} />
	</div>
{/if}

{#if material === 'steel'}
	<a class="t-body-sm more" href="{resolve('/steel')}?tab=rules">{t('beam.allRules')} →</a>
{:else}
	<a class="t-body-sm more" href={resolve('/rules/[material]/[group]', { material, group })}
		>{t('beam.allRules')} →</a
	>
{/if}

<InfoFab {sources}>
	<p>{t('beam.info')}</p>
	<p>{t('rules.flagged')}</p>
</InfoFab>

<style>
	.scope {
		margin: 0 0 var(--space-3);
	}
	.tabs {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		overflow-x: auto;
		margin-bottom: var(--space-2);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	select {
		width: 100%;
		min-height: 48px;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		border: 1px solid var(--line);
		background: var(--surface-raised);
		color: var(--ink);
		font: var(--body);
	}
	.diagram {
		margin: 0;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--paper);
		color: var(--on-tile);
	}
	.warning {
		display: grid;
		grid-template-columns: 20px 1fr;
		gap: var(--space-3);
		align-items: start;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--warn);
		color: var(--on-tile);
	}
	.warning p {
		margin: 0;
	}
	.label {
		font-weight: 500;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.results {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.results li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
	}
	.what {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.value {
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.notes {
		padding: var(--space-2) var(--space-1) 0;
	}
	.more {
		align-self: flex-start;
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 2px;
		padding: var(--space-2) 0;
	}
</style>
