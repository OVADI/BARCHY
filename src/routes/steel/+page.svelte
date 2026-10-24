<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { resolve } from '$app/paths';
	import FactTile from '$lib/components/FactTile.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { MISSING_URL } from '$lib/config';
	import { t, type MessageKey } from '$lib/i18n/index.svelte';
	import type { Fact } from '$lib/schema/fact';
	import type { SourceRef } from '$lib/schema/source';
	import { source } from '$lib/sources';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type Tab = 'profiles' | 'rules' | 'material';
	let tab = $state<Tab>('profiles');

	const FEATURED = 'staal-hoofdligger-vloer-i-u-profiel';
	const featured = $derived(data.facts.find((f) => f.id === FEATURED));

	const groups: { key: string; title: MessageKey; type: Fact['type'] }[] = [
		{ key: 'beams-floor', title: 'steel.beamsFloor', type: 'rule_of_thumb' },
		{ key: 'beams-roof', title: 'steel.beamsRoof', type: 'rule_of_thumb' },
		{ key: 'purlins', title: 'steel.purlins', type: 'rule_of_thumb' },
		{ key: 'columns', title: 'steel.columns', type: 'rule_of_thumb' },
		{ key: 'stability', title: 'steel.stability', type: 'rule_of_thumb' },
		{ key: 'material', title: 'steel.properties', type: 'data' },
		{ key: 'grades', title: 'steel.grades', type: 'data' }
	];
	const shown = $derived(
		groups.filter((g) => (tab === 'rules' ? g.type === 'rule_of_thumb' : g.type === 'data'))
	);

	const families = [
		{ series: 'hea', title: 'steel.iTitle', sub: 'steel.iSub', shape: 'I', tone: 'paper' },
		{ series: 'shs', title: 'steel.boxTitle', sub: 'steel.boxSub', shape: 'box', tone: 'surface' },
		{
			series: 'chs',
			title: 'steel.tubeTitle',
			sub: 'steel.tubeSub',
			shape: 'tube',
			tone: 'surface'
		},
		{ series: 'unp', title: 'steel.uTitle', sub: 'steel.uSub', shape: 'U', tone: 'surface' }
	] as const;

	// Sources of everything on this screen, once each.
	const sources = $derived(
		[source('vademecum'), ...data.facts.map((f) => f.source)].filter(
			(s, i, all): s is SourceRef => all.findIndex((x) => x.ref === s.ref) === i
		)
	);
	const PATH = '/steel';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

<PageHeader title={t('steel.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('steel.saveCategory')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('steel.title') })}
		/>
	{/snippet}
</PageHeader>

<div class="tabs" role="tablist" aria-label={t('steel.tabs')}>
	<Pill kind="tab" selected={tab === 'profiles'} onclick={() => (tab = 'profiles')}
		>{t('steel.profiles')}</Pill
	>
	<Pill kind="tab" selected={tab === 'rules'} onclick={() => (tab = 'rules')}
		>{t('steel.rules')}</Pill
	>
	<Pill kind="tab" selected={tab === 'material'} onclick={() => (tab = 'material')}
		>{t('steel.material')}</Pill
	>
</div>

{#if tab === 'profiles'}
	<div class="grid" role="tabpanel">
		{#each families as f (f.series)}
			<a class="family tone-{f.tone}" href={resolve('/steel/[series]', { series: f.series })}>
				<svg width="56" height="44" viewBox="0 0 56 44" aria-hidden="true">
					{#if f.shape === 'I'}
						<path d="M8 4h40v6H31v24h17v6H8v-6h17V10H8z" fill="currentColor" />
					{:else if f.shape === 'box'}
						<rect
							x="10"
							y="5"
							width="36"
							height="34"
							rx="5"
							fill="none"
							stroke="currentColor"
							stroke-width="5"
						/>
					{:else if f.shape === 'tube'}
						<circle cx="28" cy="22" r="17" fill="none" stroke="currentColor" stroke-width="5" />
					{:else}
						<path d="M14 4h30v6H21v24h23v6H14z" fill="currentColor" />
					{/if}
				</svg>
				<span>
					<span class="t-title title">{t(f.title)}</span>
					<span class="t-body-sm sub">{t(f.sub)}</span>
				</span>
			</a>
		{/each}
		<a class="family tone-surface" href={resolve('/steel/sheets')}>
			<svg width="56" height="44" viewBox="0 0 56 44" aria-hidden="true">
				<path
					d="M3 30h8l6-16h8l6 16h8l6-16h8"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linejoin="round"
				/>
			</svg>
			<span>
				<span class="t-title title">{t('steel.sheetTitle')}</span>
				<span class="t-body-sm sub">{t('steel.sheetSub')}</span>
			</span>
		</a>
		{#each ['steel.angleTitle', 'steel.flatTitle'] as const as title (title)}
			<div class="family tone-surface missing">
				<span class="t-label t-muted">{t('common.noSource')}</span>
				<span>
					<span class="t-title title">{t(title)}</span>
					{#if MISSING_URL}
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external GitHub link -->
						<a class="t-body-sm link" href={MISSING_URL} target="_blank" rel="noopener noreferrer"
							>{t('common.reportMissing')}</a
						>
					{/if}
				</span>
			</div>
		{/each}
	</div>

	{#if featured}
		<section class="featured" aria-label={t('steel.featured')}>
			<h2 class="t-label">{t('steel.featured')}</h2>
			<FactTile fact={featured} size="lg" />
			<Pill kind="toggle" onclick={() => (tab = 'rules')}>{t('steel.allRules')}</Pill>
		</section>
	{/if}
{:else}
	<div class="facts" role="tabpanel">
		{#each shown as g (g.key)}
			{@const list = data.facts.filter((f) => f.group === g.key)}
			{#if list.length}
				<h2 class="t-label t-muted section">{t(g.title)}</h2>
				{#each list as fact (fact.id)}
					<FactTile {fact} />
				{/each}
			{/if}
		{/each}
	</div>
{/if}

<InfoFab {sources} />

<style>
	.tabs {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		margin-bottom: var(--space-2);
		overflow-x: auto;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.family {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: 148px;
		padding: var(--space-4);
		border-radius: var(--radius-lg);
	}
	.family > span:last-child {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.tone-paper {
		background: var(--type-data);
		color: var(--type-data-ink);
	}
	.tone-paper .sub {
		color: var(--on-tile-muted);
	}
	.tone-surface {
		background: var(--surface);
		color: var(--ink);
	}
	.tone-surface .sub {
		color: var(--ink-muted);
	}
	a.tone-surface:hover {
		background: var(--surface-raised);
	}
	.title {
		font-size: 20px;
	}
	.link {
		text-decoration: underline;
		text-underline-offset: 2px;
		color: var(--ink);
		padding: 6px 0;
	}
	.featured {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--space-2);
		margin-top: var(--space-5);
	}
	.featured > :global(button) {
		align-self: flex-start;
	}
	.featured > .t-label {
		color: var(--ink-muted);
	}
	.facts {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.section {
		margin: var(--space-4) 0 var(--space-1);
	}
</style>
