<script lang="ts">
	import { formatFact } from '$lib/facts/format';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import type { Fact } from '$lib/schema/fact';
	import FlagMark from './FlagMark.svelte';
	import RuleNotes from './RuleNotes.svelte';
	import TypeTag from './TypeTag.svelte';

	/** One sourced value in the colour of its type: cobalt = requirement, orange = rule, white = data. */
	let {
		fact,
		size = 'md',
		selected = false,
		onselect
	}: {
		fact: Fact;
		size?: 'md' | 'lg';
		/** Set onselect to make the whole tile a toggle, e.g. to point at it in a diagram. */
		selected?: boolean;
		onselect?: () => void;
	} = $props();

	const value = $derived(formatFact(fact, formatNumber));
</script>

<article
	id={fact.id}
	class="fact type-{fact.type}"
	class:lg={size === 'lg'}
	class:selected
	data-fact={fact.id}
>
	<div class="head">
		<TypeTag type={fact.type} inverse />
		{#if fact.status === 'flagged'}<FlagMark label={t('status.factFlagged')} />{/if}
	</div>
	<h3 class="t-body label">
		{#if onselect}
			<button type="button" class="select" aria-pressed={selected} onclick={onselect}
				>{fact.label[i18n.locale]}</button
			>
		{:else}
			{fact.label[i18n.locale]}
		{/if}
	</h3>
	<p class="value" class:t-numeral-lg={size === 'lg'} class:t-numeral-md={size === 'md'}>{value}</p>
	{#if fact.scope}<p class="t-body-sm">{fact.scope[i18n.locale]}</p>{/if}
	{#if fact.notes}<RuleNotes notes={fact.notes} />{/if}
</article>

<style>
	.fact {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		min-width: 0;
		position: relative;
	}
	.selected {
		outline: 3px solid var(--ink);
		outline-offset: 2px;
	}
	.select {
		all: unset;
		cursor: pointer;
	}
	/* The button covers the whole tile, so the tile is one tap target. */
	.select::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}
	.select:focus-visible::after {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}
	/* Opened from search: outline the fact that was looked for. */
	.fact:global([data-found]) {
		scroll-margin: var(--space-6);
		outline: 3px solid var(--paper);
		outline-offset: 3px;
	}
	.lg {
		padding: var(--space-5);
		border-radius: var(--radius-lg);
		gap: var(--space-3);
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
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.label {
		font-weight: 500;
	}
	.value {
		overflow-wrap: anywhere;
	}
</style>
