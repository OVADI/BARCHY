<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { resolve } from '$app/paths';
	import FactTile from '$lib/components/FactTile.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import StairDiagram from '$lib/components/StairDiagram.svelte';
	import { t, type MessageKey } from '$lib/i18n/index.svelte';
	import type { Fact } from '$lib/schema/fact';
	import type { SourceRef } from '$lib/schema/source';
	import { source } from '$lib/sources';
	import { saved } from '$lib/storage/saved.svelte';
	import type { Component } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type Tab = 'rooms' | 'circulation' | 'guarding';
	let tab = $state<Tab>('rooms');

	const tabs: { key: Tab; title: MessageKey; groups: { key: string; title: MessageKey }[] }[] = [
		{
			key: 'rooms',
			title: 'spacePage.rooms',
			groups: [
				{ key: 'living', title: 'spacePage.living' },
				{ key: 'sanitary', title: 'spacePage.sanitary' },
				{ key: 'outdoor', title: 'spacePage.outdoor' }
			]
		},
		{
			key: 'circulation',
			title: 'spacePage.circulation',
			groups: [
				{ key: 'stair', title: 'spacePage.stair' },
				{ key: 'ramp', title: 'spacePage.ramp' },
				{ key: 'access', title: 'spacePage.access' }
			]
		},
		{
			key: 'guarding',
			title: 'spacePage.guarding',
			groups: [{ key: 'guarding', title: 'spacePage.guarding' }]
		}
	];
	const current = $derived(tabs.find((x) => x.key === tab)!);

	// Groups with a drawing: tapping a tile highlights its dimension there.
	const diagrams: Record<
		string,
		Component<{ facts: Fact[]; selected?: string | null; onselect?: (id: string) => void }>
	> = {
		stair: StairDiagram
	};
	let selectedFact = $state<string | null>(null);

	// Tapping a value in the drawing selects its tile and scrolls it just below the sticky drawing.
	function showFact(id: string, diagram: HTMLElement | null) {
		selectedFact = id;
		const tile = document.querySelector<HTMLElement>(`[data-fact="${id}"]`);
		if (!tile) return;
		const offset = (diagram?.offsetHeight ?? 0) + 8;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({
			top: tile.getBoundingClientRect().top + window.scrollY - offset,
			behavior: reduce ? 'auto' : 'smooth'
		});
		tile.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
	}
	let diagramEl = $state<HTMLElement | null>(null);
	const anyFlagged = $derived(data.facts.some((f) => f.status === 'flagged'));

	// Sources of everything on this screen, once each.
	const sources = $derived(
		[source('bbl'), ...data.facts.map((f) => f.source)].filter(
			(s, i, all): s is SourceRef => all.findIndex((x) => x.ref === s.ref) === i
		)
	);
	const PATH = '/space';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

<PageHeader title={t('spacePage.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('spacePage.title') })}
		/>
	{/snippet}
</PageHeader>

<p class="t-body-sm t-muted scope">{t('spacePage.scope')}</p>

{#if anyFlagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.factFlagged')} tone="light" />
		<p class="t-body-sm">{t('spacePage.flagged')}</p>
	</div>
{/if}

<div class="tabs" role="tablist" aria-label={t('spacePage.tabs')}>
	{#each tabs as x (x.key)}
		<Pill
			kind="tab"
			selected={tab === x.key}
			onclick={() => {
				tab = x.key;
				selectedFact = null;
			}}>{t(x.title)}</Pill
		>
	{/each}
</div>

<div class="facts" role="tabpanel">
	{#if tab === 'circulation'}
		<a class="tool" href={resolve('/tools/stair')}>
			<span>
				<span class="t-title">{t('tools.stair')}</span>
				<span class="t-body-sm sub">{t('spacePage.stairTool')}</span>
			</span>
			<ChevronRight size={24} aria-hidden="true" />
		</a>
	{/if}
	{#each current.groups as g (g.key)}
		{@const list = data.facts.filter((f) => f.group === g.key)}
		{@const Diagram = diagrams[g.key]}
		{#if list.length}
			<section class="group">
				{#if current.groups.length > 1}<h2 class="t-label t-muted section">{t(g.title)}</h2>{/if}
				{#if Diagram}
					<div class="diagram" bind:this={diagramEl}>
						<Diagram
							facts={list}
							selected={selectedFact}
							onselect={(id) => showFact(id, diagramEl)}
						/>
					</div>
					<p class="t-body-sm t-muted">{t('stairDiagram.hint')}</p>
				{/if}
				{#each list as fact (fact.id)}
					{#if Diagram}
						<FactTile
							{fact}
							selected={selectedFact === fact.id}
							onselect={() => (selectedFact = selectedFact === fact.id ? null : fact.id)}
						/>
					{:else}
						<FactTile {fact} />
					{/if}
				{/each}
			</section>
		{/if}
	{/each}
</div>

<InfoFab {sources}>
	<p>{t('spacePage.info')}</p>
</InfoFab>

<style>
	.scope {
		margin: 0 0 var(--space-3);
	}
	.banner {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
		margin-bottom: var(--space-3);
	}
	.tabs {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		margin-bottom: var(--space-2);
		overflow-x: auto;
	}
	.facts {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.section {
		margin: var(--space-4) 0 var(--space-1);
	}
	/* Stays in view while scrolling this group's tiles, and only those. */
	.diagram {
		position: sticky;
		top: 0;
		z-index: 1;
		padding: var(--space-2) 0;
		background: var(--ground);
	}
	.tool {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: 72px;
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--surface);
		color: var(--ink);
	}
	.tool:hover {
		background: var(--surface-raised);
	}
	.tool > span {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.sub {
		color: var(--ink-muted);
	}
</style>
