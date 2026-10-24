<script lang="ts">
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import { resolve } from '$app/paths';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';
</script>

<svelte:head><title>BARCHY</title></svelte:head>

<header class="header">
	<div class="titles">
		<h1 class="t-heading brand">{t('app.name')}</h1>
		<p class="t-body-sm t-muted">{t('app.tagline')}</p>
	</div>
	<div class="actions">
		<LanguageToggle />
		<IconButton icon={SlidersHorizontal} label={t('common.settings')} href={resolve('/settings')} />
	</div>
</header>

<!-- Phase 3 fills Home; these tiles only prove the routes and tones. -->
<Tile tone="orange" pad="lg" href={resolve('/steel')}>
	<span class="t-label">{t('home.structure')}</span>
	<span class="t-title">{t('steel.title')}</span>
</Tile>
<Tile tone="cobalt" pad="lg" href={resolve('/space')}>
	<span class="t-label">{t('home.space')}</span>
</Tile>
<p class="t-body-sm t-muted">{t('common.comingSoon')}</p>

<InfoFab sources={[source('vademecum')]} />

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}
	.titles {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
	}
	.brand {
		font-weight: 900;
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		flex-shrink: 0;
	}
</style>
