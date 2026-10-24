<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import SearchIcon from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TypeTag from '$lib/components/TypeTag.svelte';
	import { MISSING_URL } from '$lib/config';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { loadSearchIndex } from '$lib/search/load';
	import { search } from '$lib/search/match';
	import { localText, type SearchIndex } from '$lib/search/types';
	import { source } from '$lib/sources';

	const EXAMPLES = ['HE 200 A', 'IPE 300', '69x195', 'Ø12', 'trap', 'toilet', 'S355'];
	/** Rows shown before "show all"; a long list of HE sizes is rarely what you want. */
	const FIRST = 40;

	let query = $state('');
	let index = $state<SearchIndex | null>(null);
	let failed = $state(false);
	let showAll = $state(false);
	let input: HTMLInputElement;

	const hits = $derived(index ? search(index, query) : []);
	const shown = $derived(showAll ? hits : hits.slice(0, FIRST));
	const trimmed = $derived(query.trim());

	onMount(() => {
		// The page is prerendered without a query; ?q= from the Home search box is read here.
		query = page.url.searchParams.get('q') ?? '';
		// The search tab exists to type in.
		input.focus();
		loadSearchIndex().then(
			(i) => (index = i),
			() => (failed = true)
		);
	});

	/** Keeps ?q= in the address bar, so back and a shared link return to the same hits. */
	function sync() {
		showAll = false;
		const url = new URL(page.url);
		if (trimmed) url.searchParams.set('q', trimmed);
		else url.searchParams.delete('q');
		// Same page, only the query changes; page.url already carries the base.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		replaceState(url, {});
	}

	function pick(example: string) {
		query = example;
		sync();
		input.focus();
	}

	function clear() {
		query = '';
		sync();
		input.focus();
	}
</script>

<PageHeader title={t('search.title')} />

<form class="box" role="search" onsubmit={(e) => (e.preventDefault(), input.blur())}>
	<SearchIcon size={20} strokeWidth={1.5} aria-hidden="true" />
	<input
		bind:this={input}
		bind:value={query}
		oninput={sync}
		type="search"
		name="q"
		enterkeyhint="search"
		autocomplete="off"
		autocapitalize="off"
		spellcheck="false"
		aria-label={t('search.label')}
		placeholder={t('search.placeholder')}
	/>
	{#if query}
		<button type="button" class="clear" aria-label={t('search.clear')} onclick={clear}>
			<X size={18} strokeWidth={2} aria-hidden="true" />
		</button>
	{/if}
</form>

<p class="sr-only" aria-live="polite">
	{#if trimmed && index}{hits.length === 1
			? t('search.countOne')
			: t('search.count', { n: hits.length })}{/if}
</p>

{#if failed}
	<p class="t-body-sm t-muted">{t('common.loadError')}</p>
{:else if !trimmed}
	<section class="examples" aria-labelledby="try">
		<h2 id="try" class="t-label t-muted">{t('search.try')}</h2>
		<ul>
			{#each EXAMPLES as ex (ex)}
				<li><button type="button" class="pill" onclick={() => pick(ex)}>{ex}</button></li>
			{/each}
		</ul>
		<p class="t-body-sm t-muted">{t('search.hint')}</p>
	</section>
{:else if !index}
	<p class="t-body-sm t-muted">{t('common.loading')}</p>
{:else if !hits.length}
	<div class="none">
		<p class="t-body">{t('search.none', { q: trimmed })}</p>
		<p class="t-body-sm t-muted">{t('search.noneHint')}</p>
		{#if MISSING_URL}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external GitHub link -->
			<a class="t-body-sm link" href={MISSING_URL} target="_blank" rel="noopener noreferrer"
				>{t('common.reportMissing')}</a
			>
		{/if}
	</div>
{:else}
	<p class="t-label t-muted" aria-hidden="true">
		{hits.length === 1 ? t('search.countOne') : t('search.count', { n: hits.length })}
	</p>
	<ul class="hits">
		{#each shown as hit (hit.path)}
			<li>
				<!-- Index paths are app paths; the base is added here. -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a class="hit" href={`${base}${hit.path}`}>
					<span class="text">
						<span class="meta">
							{#if hit.kind === 'requirement' || hit.kind === 'rule_of_thumb' || hit.kind === 'data'}
								<TypeTag type={hit.kind} />
							{:else}
								<span class="t-label t-muted">{t(`search.kind.${hit.kind}`)}</span>
							{/if}
							{#if hit.flagged}<FlagMark label={t('status.flagged')} tone="light" />{/if}
						</span>
						<span class="t-body title">{localText(hit.title, i18n.locale)}</span>
						{#if hit.sub}<span class="t-body-sm t-muted">{localText(hit.sub, i18n.locale)}</span
							>{/if}
					</span>
					{#if hit.value}
						<span class="value">{localText(hit.value, i18n.locale)}</span>
					{:else}
						<ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
					{/if}
				</a>
			</li>
		{/each}
	</ul>
	{#if shown.length < hits.length}
		<button type="button" class="pill more" onclick={() => (showAll = true)}
			>{t('search.showAll', { n: hits.length })}</button
		>
	{/if}
{/if}

<InfoFab sources={[source('vademecum'), source('bbl')]}><p>{t('search.info')}</p></InfoFab>

<style>
	.box {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 56px;
		padding: 0 var(--space-2) 0 20px;
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--ink-muted);
	}
	.box:focus-within {
		outline: 2px solid var(--paper);
		outline-offset: 2px;
	}
	input {
		flex: 1;
		min-width: 0;
		min-height: var(--touch);
		border: 0;
		background: none;
		color: var(--ink);
		font: 400 17px/1.2 var(--font-sans);
		outline: none;
	}
	input::placeholder {
		color: var(--ink-muted);
	}
	/* The clear button below replaces the browser's own. */
	input::-webkit-search-cancel-button {
		display: none;
	}
	.clear {
		display: grid;
		place-items: center;
		width: var(--touch);
		height: var(--touch);
		flex-shrink: 0;
		border: 0;
		border-radius: var(--radius-pill);
		background: none;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.clear:hover {
		background: var(--surface-raised);
		color: var(--ink);
	}
	.examples {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-2);
	}
	.examples ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.pill {
		display: inline-flex;
		align-items: center;
		min-height: var(--touch);
		padding: 0 18px;
		border: 0;
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--ink);
		font: 500 15px/1 var(--font-sans);
		cursor: pointer;
	}
	.pill:hover {
		background: var(--surface-raised);
	}
	.more {
		align-self: center;
	}
	.none {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}
	.link {
		text-decoration: underline;
	}
	.hits {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.hit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
		color: var(--ink);
	}
	.hit:hover {
		background: var(--surface-raised);
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}
	.title {
		font-weight: 500;
	}
	.value {
		flex-shrink: 0;
		max-width: 45%;
		text-align: right;
		font: 500 16px/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
</style>
