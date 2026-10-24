<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { resolve } from '$app/paths';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';
	import { TOOLS } from '$lib/tools';
</script>

<PageHeader title={t('tools.title')} />

{#each TOOLS as tool (tool.id)}
	<Tile radius="md" href={resolve(tool.path)}>
		<span class="row"
			><span class="t-title">{t(tool.title)}</span><ChevronRight
				size={22}
				strokeWidth={1.5}
				aria-hidden="true"
			/></span
		>
	</Tile>
{/each}

<InfoFab sources={[source('vademecum')]}><p>{t('info.calcNote')}</p></InfoFab>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
	}
</style>
