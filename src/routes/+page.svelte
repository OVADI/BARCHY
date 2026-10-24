<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Search from '@lucide/svelte/icons/search';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import { base, resolve } from '$app/paths';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import { formatNumber, t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';
	import { saved } from '$lib/storage/saved.svelte';
	import { TOOLS } from '$lib/tools';

	const materials = [
		{ href: resolve('/steel'), key: 'home.steel', icon: 'I' },
		{ href: resolve('/timber'), key: 'home.timber', icon: 'grain' },
		{ href: resolve('/concrete'), key: 'home.concrete', icon: 'dots' },
		{ href: resolve('/masonry'), key: 'home.masonry', icon: 'brick' }
	] as const;

	/** Recent pages show only while the search box has focus. */
	let focused = $state(false);
</script>

<svelte:head><title>BARCHY</title></svelte:head>

<header class="header">
	<h1 class="t-heading brand">{t('app.name')}</h1>
	<div class="actions">
		<LanguageToggle />
		<IconButton icon={SlidersHorizontal} label={t('common.settings')} href={resolve('/settings')} />
	</div>
</header>

<form class="search" role="search" action={resolve('/search')} method="get">
	<Search size={20} strokeWidth={1.5} aria-hidden="true" />
	<input
		type="search"
		name="q"
		enterkeyhint="search"
		autocomplete="off"
		autocapitalize="off"
		spellcheck="false"
		aria-label={t('search.label')}
		placeholder={t('home.searchPlaceholder')}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
	/>
</form>

{#if focused && saved.recent.length}
	<!-- Keeps focus in the search box, so the list is still there when a link is clicked. -->
	<section class="recent" aria-label={t('home.recent')} onpointerdown={(e) => e.preventDefault()}>
		<h2 class="sr-only">{t('home.recent')}</h2>
		<ul>
			{#each saved.recent as r, i (r.path)}
				<li>
					<!-- Stored paths are app paths; the base is added here. -->
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="pill" class:first={i === 0} href={`${base}${r.path}`}>{r.name}</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="structure" aria-labelledby="structure-title">
	<div class="tile-head">
		<span class="t-label">{t('home.structure')}</span>
		<h2 id="structure-title" class="t-title">{t('home.structureTitle')}</h2>
	</div>
	<div class="subs">
		{#each materials as m (m.key)}
			<a class="sub" href={m.href}>
				<svg width="28" height="22" viewBox="0 0 56 44" aria-hidden="true">
					{#if m.icon === 'I'}
						<path d="M8 4h40v6H31v24h17v6H8v-6h17V10H8z" fill="currentColor" />
					{:else if m.icon === 'grain'}
						<g fill="none" stroke="currentColor" stroke-width="3"
							><rect x="8" y="6" width="40" height="32" rx="3" /><path
								d="M8 17c10 3 20-3 40 0M8 28c12 3 24-3 40 0"
							/></g
						>
					{:else if m.icon === 'brick'}
						<g fill="none" stroke="currentColor" stroke-width="3"
							><rect x="8" y="6" width="40" height="32" rx="1" /><path
								d="M8 17h40M8 28h40M28 6v11M18 17v11M38 17v11M28 28v10"
							/></g
						>
					{:else}
						<g fill="currentColor"
							><path d="M8 6h40v32H8z" fill="none" stroke="currentColor" stroke-width="3" /><circle
								cx="18"
								cy="16"
								r="3"
							/><circle cx="34" cy="14" r="2.5" /><circle cx="26" cy="27" r="3" /><circle
								cx="40"
								cy="28"
								r="2.5"
							/></g
						>
					{/if}
				</svg>
				{t(m.key)}
			</a>
		{/each}
	</div>
</section>

<a class="space" href={resolve('/space')}>
	<div class="tile-head">
		<span class="t-label">{t('home.space')}</span>
		<h2 class="t-title">{t('home.spaceTitle')}</h2>
	</div>
	<span class="arrow"><ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" /></span>
</a>

<div class="pair">
	<a class="drawing" href={resolve('/drawing')}>
		<span class="t-label">{t('home.drawing')}</span>
		<svg
			width="56"
			height="30"
			viewBox="0 0 56 30"
			stroke="currentColor"
			stroke-linecap="round"
			aria-hidden="true"
			><path d="M2 4h52" stroke-width="5" /><path d="M2 15h52" stroke-width="2.5" /><path
				d="M2 25h52"
				stroke-width="1"
				stroke-dasharray="4 3"
			/></svg
		>
		<h2 class="t-title">{t('home.drawingTitle')}</h2>
	</a>
	<a class="tools" href={resolve('/tools')}>
		<span class="t-label t-muted">{t('home.tools')}</span>
		<span class="count"
			><span class="t-numeral-lg">{formatNumber(TOOLS.length)}</span><span class="unit"
				>{t('home.toolsUnit')}</span
			></span
		>
		<p class="t-body-sm t-muted">{t('home.toolsSub')}</p>
	</a>
</div>

<InfoFab sources={[source('vademecum')]}><p>{t('info.homeNote')}</p></InfoFab>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}
	.brand {
		font-weight: 900;
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		flex-shrink: 0;
	}
	.search {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 56px;
		padding: 0 20px;
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--ink-muted);
	}
	.search:hover {
		background: var(--surface-raised);
	}
	.search:focus-within {
		outline: 2px solid var(--paper);
		outline-offset: 2px;
	}
	.search input {
		flex: 1;
		min-width: 0;
		min-height: var(--touch);
		border: 0;
		background: none;
		color: var(--ink);
		font: 400 17px/1.2 var(--font-sans);
		outline: none;
	}
	.search input::placeholder {
		color: var(--ink-muted);
	}
	.recent ul {
		list-style: none;
		margin: 0;
		padding: var(--space-2) 0 var(--space-4);
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		min-height: var(--touch);
		padding: 0 18px;
		border-radius: var(--radius-pill);
		background: var(--surface);
		font: 500 15px/1 var(--font-sans);
		white-space: nowrap;
	}
	.pill.first {
		background: var(--paper);
		color: var(--on-tile);
	}
	.tile-head {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.structure {
		background: var(--orange);
		color: var(--on-tile);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.subs {
		display: grid;
		/* Four materials: two by two, so the names fit on a phone. */
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.sub {
		background: var(--orange-shade);
		color: var(--paper);
		border-radius: var(--radius-sm);
		min-height: 76px;
		padding: var(--space-3);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font: 500 16px/1.1 var(--font-sans);
	}
	.space {
		background: var(--cobalt);
		color: var(--on-cobalt);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-3);
	}
	.arrow {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background: var(--cobalt-track);
		display: grid;
		place-items: center;
	}
	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.drawing,
	.tools {
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		min-height: 156px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-2);
	}
	.drawing {
		background: var(--type-data);
		color: var(--type-data-ink);
	}
	.tools {
		background: var(--surface);
	}
	.tools:hover {
		background: var(--surface-raised);
	}
	.count {
		display: flex;
		align-items: flex-start;
		gap: var(--space-1);
	}
	.unit {
		font: 500 16px/1 var(--font-sans);
		margin-top: 2px;
	}
</style>
