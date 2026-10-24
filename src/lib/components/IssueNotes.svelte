<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
	import type { Issue } from '$lib/schema/source';
	import FlagMark from './FlagMark.svelte';

	/** Open points from the source review, shown under the item they are about. */
	let { issues }: { issues: Issue[] } = $props();
</script>

{#each issues as issue (issue.check)}
	<p class="issue t-body-sm">
		<FlagMark label={t('drawing.issue')} />
		<span>{issue.message}</span>
	</p>
{/each}

<style>
	.issue {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-1);
		margin: 0;
		color: var(--ink-muted);
	}
</style>
