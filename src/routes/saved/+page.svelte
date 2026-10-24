<script lang="ts">
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';
</script>

<PageHeader title={t('saved.title')} />
<p class="t-body-sm t-muted">{t('common.comingSoon')}</p>

<InfoFab sources={[source('vademecum')]} />
