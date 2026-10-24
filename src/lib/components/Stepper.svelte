<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { formatNumber, t } from '$lib/i18n/index.svelte';
	import IconButton from './IconButton.svelte';

	interface Props {
		label: string;
		value: number;
		step: number;
		unit?: string;
		min?: number;
		max?: number;
		/** Extra text after the value, e.g. '(automatisch)'. */
		hint?: string;
		format?: Intl.NumberFormatOptions;
		tone?: 'surface' | 'raised';
		onchange: (value: number) => void;
	}

	let {
		label,
		value,
		step,
		unit = '',
		min = -Infinity,
		max = Infinity,
		hint,
		format,
		tone = 'raised',
		onchange
	}: Props = $props();

	const stepText = $derived(`${formatNumber(step)}${unit ? ` ${unit}` : ''}`);
	// Round away floating point noise from repeated steps (0.1 + 0.2).
	const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 1e6) / 1e6));

	let editing = $state(false);
	let draft = $state('');

	function startEdit() {
		draft = String(value).replace('.', ',');
		editing = true;
	}
	function focusSelect(node: HTMLInputElement) {
		node.focus();
		node.select();
	}
	function commit() {
		if (!editing) return;
		editing = false;
		const parsed = Number(draft.trim().replace(',', '.'));
		if (draft.trim() !== '' && Number.isFinite(parsed)) {
			const next = clamp(parsed);
			if (next !== value) onchange(next);
		}
	}
	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commit();
		else if (e.key === 'Escape') editing = false;
	}
</script>

<div class="stepper">
	<div class="text">
		<span class="label t-body-sm">{label}</span>
		{#if editing}
			<span class="edit">
				<input
					class="value input"
					type="text"
					inputmode="decimal"
					aria-label={t('stepper.edit', { label })}
					bind:value={draft}
					use:focusSelect
					onblur={commit}
					{onkeydown}
				/>
				{#if unit}<span class="unit">{unit}</span>{/if}
			</span>
		{:else}
			<button
				type="button"
				class="value display"
				aria-label={t('stepper.edit', { label })}
				onclick={startEdit}
			>
				<output aria-live="polite">{formatNumber(value, format)}{unit ? ` ${unit}` : ''}</output>
				{#if hint}<span class="hint t-body-sm">{hint}</span>{/if}
			</button>
		{/if}
	</div>
	<IconButton
		icon={Minus}
		{tone}
		label={t('stepper.decrease', { label, step: stepText })}
		disabled={value <= min}
		onclick={() => onchange(clamp(value - step))}
	/>
	<IconButton
		icon={Plus}
		{tone}
		label={t('stepper.increase', { label, step: stepText })}
		disabled={value >= max}
		onclick={() => onchange(clamp(value + step))}
	/>
</div>

<style>
	.stepper {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 60px;
	}
	.text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.label,
	.hint {
		/* Tiles on a coloured ground (orange hero) set --stepper-muted for contrast. */
		color: var(--stepper-muted, var(--ink-muted));
	}
	.value {
		font: 500 18px/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.display {
		align-self: flex-start;
		padding: 2px 0;
		background: none;
		border: 0;
		color: inherit;
		text-align: left;
		cursor: text;
		text-decoration: underline dotted;
		text-underline-offset: 4px;
	}
	.edit {
		display: flex;
		align-items: baseline;
		gap: var(--space-1, 4px);
	}
	.input {
		width: 6em;
		min-width: 0;
		padding: 2px 4px;
		color: inherit;
		background: transparent;
		border: 1px solid currentColor;
		border-radius: 4px;
	}
</style>
