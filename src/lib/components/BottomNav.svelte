<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Calculator from '@lucide/svelte/icons/calculator';
	import House from '@lucide/svelte/icons/house';
	import Search from '@lucide/svelte/icons/search';
	import { page } from '$app/state';
	import { base, resolve } from '$app/paths';
	import { t } from '$lib/i18n/index.svelte';

	const items = [
		{ href: resolve('/'), match: '/', icon: House, key: 'nav.home' },
		{ href: resolve('/search'), match: '/search', icon: Search, key: 'nav.search' },
		{ href: resolve('/tools'), match: '/tools', icon: Calculator, key: 'nav.tools' },
		{ href: resolve('/saved'), match: '/saved', icon: Bookmark, key: 'nav.saved' }
	] as const;

	const path = $derived(page.url.pathname.slice(base.length) || '/');

	// Search, Tools and Saved own their subtree; everything else lives under Home.
	function isActive(match: string): boolean {
		if (match !== '/') return path === match || path.startsWith(`${match}/`);
		return !items.some(
			(i) => i.match !== '/' && (path === i.match || path.startsWith(`${i.match}/`))
		);
	}
</script>

<nav class="nav" aria-label={t('nav.label')}>
	<ul>
		{#each items as item (item.match)}
			{@const active = isActive(item.match)}
			<li>
				<a href={item.href} class:active aria-current={active ? 'page' : undefined}>
					<item.icon size={24} strokeWidth={active ? 2.25 : 1.5} aria-hidden="true" />
					<span>{t(item.key)}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.nav {
		position: fixed;
		z-index: 30;
		left: 0;
		right: 0;
		bottom: 0;
		height: var(--nav-total);
		padding-bottom: var(--safe-bottom);
		background: var(--ground);
		border-top: 1px solid var(--line);
	}
	ul {
		list-style: none;
		margin: 0 auto;
		padding: 0 var(--space-2);
		max-width: var(--content-max);
		height: var(--nav-height);
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}
	a {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		color: var(--ink-muted);
		font: 500 12px/1 var(--font-sans);
	}
	a.active {
		color: var(--ink);
		font-weight: 600;
	}
	a:focus-visible {
		outline-offset: -4px;
		border-radius: var(--radius-md);
	}
</style>
