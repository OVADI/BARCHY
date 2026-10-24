<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import FactTile from '$lib/components/FactTile.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { param, revealHash } from '$lib/deeplink';
	import { SPACE_TABS, type SpaceTab } from '$lib/facts/groups';
	import { t } from '$lib/i18n/index.svelte';
	import type { SourceRef } from '$lib/schema/source';
	import { source } from '$lib/sources';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let tab = $state<SpaceTab>('rooms');
	const tabs = SPACE_TABS;

	onMount(() => {
		const wanted = param('tab');
		const found = tabs.find((x) => x.key === wanted);
		if (found) tab = found.key;
		void revealHash();
	});
	const current = $derived(tabs.find((x) => x.key === tab)!);
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
		<Pill kind="tab" selected={tab === x.key} onclick={() => (tab = x.key)}>{t(x.title)}</Pill>
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
		{#if list.length}
			{#if current.groups.length > 1}<h2 class="t-label t-muted section">{t(g.title)}</h2>{/if}
			{#each list as fact (fact.id)}
				<FactTile {fact} />
			{/each}
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
	.section {
		margin: var(--space-4) 0 var(--space-1);
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
