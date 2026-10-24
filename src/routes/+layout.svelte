<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';
	import { onMount, type Snippet } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import { initDisclaimer } from '$lib/disclaimer.svelte';
	import { initLocale, t } from '$lib/i18n/index.svelte';
	import { initSaved } from '$lib/storage/saved.svelte';

	let { children }: { children: Snippet } = $props();

	const webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	onMount(async () => {
		// After hydration, so the prerendered (NL) markup is never mismatched.
		initLocale();
		initDisclaimer();
		void initSaved();
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		}
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static manifest link generated at build time -->
	{@html webManifestLink}
</svelte:head>

<a class="skip" href="#main">{t('app.skipToContent')}</a>

<main id="main" class="page" tabindex="-1">
	{@render children()}
</main>

<BottomNav />

<Disclaimer />

<style>
	.page {
		max-width: var(--content-max);
		margin: 0 auto;
		padding: calc(var(--space-6) + env(safe-area-inset-top, 0px)) var(--gutter)
			calc(var(--nav-total) + var(--touch) + var(--space-6));
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.page:focus {
		outline: none;
	}
	.skip {
		position: fixed;
		z-index: 40;
		top: var(--space-2);
		left: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-pill);
		background: var(--paper);
		color: var(--on-tile);
		transform: translateY(-200%);
	}
	.skip:focus-visible {
		transform: none;
	}
</style>
