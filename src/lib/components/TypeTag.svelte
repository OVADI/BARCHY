<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
	import type { InfoType } from '$lib/schema/source';

	let { type }: { type: InfoType } = $props();
</script>

<span class="tag t-label type-{type}">{t(`type.${type}`)}</span>

<style>
	.tag {
		display: inline-flex;
		align-self: flex-start;
		align-items: center;
		padding: 3px 8px;
		border-radius: var(--radius-pill);
	}
	.type-requirement {
		background: var(--type-requirement);
		color: var(--type-requirement-ink);
	}
	.type-rule_of_thumb {
		background: var(--type-rule-of-thumb);
		color: var(--type-rule-of-thumb-ink);
	}
	.type-data {
		background: var(--type-data);
		color: var(--type-data-ink);
	}
</style>
