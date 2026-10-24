<script lang="ts">
	import { resolve } from '$app/paths';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';
</script>

<PageHeader title={t('settings.title')} back={resolve('/')} />

<Tile radius="md">
	<div class="row">
		<span class="t-body">{t('common.language')}</span>
		<LanguageToggle />
	</div>
</Tile>

<InfoFab sources={[source('vademecum')]} />

<style>
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}
</style>
