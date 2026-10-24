<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
	import type { InfoType } from '$lib/schema/source';

	/** inverse: for use on a tile that already has the type colour. */
	let { type, inverse = false }: { type: InfoType; inverse?: boolean } = $props();
</script>

<span class="tag t-label type-{type}" class:inverse>{t(`type.${type}`)}</span>

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
	.inverse {
		background: var(--on-tile);
	}
	.inverse.type-requirement {
		color: var(--on-cobalt);
	}
	.inverse.type-rule_of_thumb {
		color: var(--orange);
	}
	.inverse.type-data {
		color: var(--paper);
	}
</style>
