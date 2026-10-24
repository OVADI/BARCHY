<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import HatchSwatch from '$lib/components/HatchSwatch.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import LineSample from '$lib/components/LineSample.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { param, revealHash } from '$lib/deeplink';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import IssueNotes from '$lib/components/IssueNotes.svelte';
	import { HATCH_GROUPS } from '$lib/drawing/constants';
	import type { GuideStep, LineType } from '$lib/schema/drawing';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const TABS = ['hatch', 'lines', 'guides'] as const;
	type Tab = (typeof TABS)[number];
	let tab = $state<Tab>('hatch');

	// Opened from search or back from a group: /drawing?tab=lines#line-dashed
	onMount(() => {
		const wanted = param('tab');
		if (TABS.includes(wanted as Tab)) tab = wanted as Tab;
		void revealHash();
	});

	const anyFlagged = $derived(
		[...data.lines, ...data.hatches, ...data.guides].some((r) => r.status === 'flagged')
	);

	const weightText = (w: number) => t('drawing.weight', { w: formatNumber(w) });

	// Group tiles show one typical hatch and the material names in the group.
	const SAMPLE: Record<(typeof HATCH_GROUPS)[number], string> = {
		stone: 'beton-1',
		timber: 'hout',
		steel: 'staal-2',
		other: 'zand'
	};
	const groupNames = (g: string) => [
		...new Set(data.hatches.filter((h) => h.group === g).map((h) => h.name[i18n.locale]))
	];

	// Where each line type is used in the guides, so the line tab shows it in context.
	const usage = $derived(
		Object.fromEntries(
			data.lines.map((l) => [
				l.id,
				data.guides.flatMap((g) =>
					g.steps.filter((s) => s.line === l.id).map((s) => ({ guide: g, step: s }))
				)
			])
		) as Record<LineType, { guide: (typeof data.guides)[number]; step: GuideStep }[]>
	);

	const PATH = '/drawing';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

<PageHeader title={t('drawing.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('drawing.title') })}
		/>
	{/snippet}
</PageHeader>

<p class="t-body-sm t-muted intro">{t('drawing.intro')}</p>

{#if anyFlagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.factFlagged')} tone="light" />
		<p class="t-body-sm">{t('drawing.flagged')}</p>
	</div>
{/if}

<div class="tabs" role="tablist" aria-label={t('drawing.tabs')}>
	{#each TABS as x (x)}
		<Pill kind="tab" selected={tab === x} onclick={() => (tab = x)}>{t(`drawing.${x}`)}</Pill>
	{/each}
</div>

<div class="panel" role="tabpanel">
	{#if tab === 'lines'}
		{#each data.lines as l (l.id)}
			<section class="card" id="line-{l.id}">
				<div class="paper"><LineSample line={l.id} weight={0.3} label={l.name[i18n.locale]} /></div>
				<h2 class="t-title">{l.name[i18n.locale]}</h2>
				{#if usage[l.id].length}
					<span class="t-label t-muted">{t('drawing.usedFor')}</span>
					<ul class="uses t-body-sm">
						{#each usage[l.id] as u, i (i)}
							<li>
								<span class="weight">{u.step.weight ? weightText(u.step.weight) : '–'}</span>
								<span class="use">
									<span>{u.step.text[i18n.locale]}</span>
									<span class="t-muted">{u.guide.title[i18n.locale]}</span>
								</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="t-body-sm t-muted">{t('drawing.notUsed')}</p>
				{/if}
				<IssueNotes issues={l.issues} />
			</section>
		{/each}
	{:else if tab === 'hatch'}
		<div class="grid">
			{#each HATCH_GROUPS as g (g)}
				{@const names = groupNames(g)}
				<a class="tile" href={resolve('/drawing/hatch/[group]', { group: g })}>
					<span class="paper swatch"><HatchSwatch hatch={SAMPLE[g]} /></span>
					<span class="t-title">{t(`drawing.group.${g}`)}</span>
					<span class="t-body-sm sub">{names.join(', ')}</span>
				</a>
			{/each}
		</div>
	{:else}
		<div class="grid">
			{#each data.guides as g (g.id)}
				<a class="block" href={resolve('/drawing/guide/[id]', { id: g.id })} id="guide-{g.id}">
					<svg class="icon" width="56" height="56" viewBox="0 0 44 44" aria-hidden="true">
						{#if g.id === 'plan'}
							<path d="M6 8h32v28H6z" fill="none" stroke="currentColor" stroke-width="2" />
							<path
								d="M22 4v36M2 22h40"
								stroke="currentColor"
								stroke-width="1"
								stroke-dasharray="6 2 1 2"
							/>
							{#each [6, 38] as x (x)}{#each [8, 36] as y (y)}<rect
										x={x - 3}
										y={y - 3}
										width="6"
										height="6"
										fill="currentColor"
									/>{/each}{/each}
						{:else if g.id === 'axo'}
							{#each [6, 18, 30] as y (y)}
								<path
									d="M4 {y + 4}l18 -6l18 6l-18 6z"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linejoin="round"
								/>
							{/each}
						{:else}
							<path d="M6 4v36M6 22h34" stroke="currentColor" stroke-width="6" />
							<path
								d="M2 22h40M6 2v40"
								stroke="currentColor"
								stroke-width="1"
								stroke-dasharray="6 2 1 2"
							/>
							<circle cx="18" cy="16" r="2" fill="currentColor" />
							<circle cx="28" cy="16" r="2" fill="currentColor" />
						{/if}
					</svg>
					<span class="block-text">
						<span class="t-title">{g.title[i18n.locale]}</span>
						<span class="t-body-sm sub">{t('drawing.stepCount', { n: g.steps.length })}</span>
					</span>
				</a>
			{/each}
		</div>
	{/if}
</div>

<InfoFab sources={[data.source, data.hatchSource]}>
	<p>{t('drawing.flagged')}</p>
	<p>{t('drawing.hatchSource', { ref: `${data.hatchSource.title}, ${data.hatchSource.ref}` })}</p>
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
		})}
	</p>
	<p>
		{t('info.origin', {
			path: data.guideOrigin.path.split('/').pop() ?? '',
			commit: data.guideOrigin.commit.slice(0, 7)
		})}
	</p>
</InfoFab>

<style>
	.intro {
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
		overflow-x: auto;
		margin-bottom: var(--space-2);
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.tile,
	.block,
	.card {
		border-radius: var(--radius-lg);
		background: var(--surface);
		color: var(--ink);
		min-width: 0;
	}
	.tile:hover,
	.block:hover {
		background: var(--surface-raised);
	}
	.tile {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
	}
	.sub {
		color: var(--ink-muted);
	}
	.block {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: 148px;
		padding: var(--space-4);
	}
	/* Three drawings: the floor plan (longest name, most steps) gets the full row. */
	.block:first-child {
		grid-column: 1 / -1;
	}
	.block-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.icon {
		flex-shrink: 0;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		scroll-margin: var(--space-6);
	}
	/* Opened from search: outline the item that was looked for. */
	.card:global([data-found]) {
		outline: 3px solid var(--paper);
		outline-offset: 3px;
	}
	/* Samples sit on white, as on a drawing. */
	.paper {
		display: block;
		background: var(--paper);
		border-radius: var(--radius-sm);
		padding: var(--space-2);
	}
	.uses {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.uses li {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: var(--space-2);
	}
	.use {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.weight {
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
	}
</style>
