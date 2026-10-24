<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { formatNumber, t } from '$lib/i18n/index.svelte';
	import type { ClientIssue, ClientSection } from '$lib/steel/client';
	import { quantity, scaled, unitLabel, valueOf, type Field } from '$lib/steel/quantities';
	import FlagMark from './FlagMark.svelte';
	import IconButton from './IconButton.svelte';
	import Stat from './Stat.svelte';

	interface Props {
		section: ClientSection;
		fields: Field[];
		/** Heading for screen readers and the tile group. */
		label: string;
	}

	let { section, fields, label }: Props = $props();

	let open = $state<Field | null>(null);
	const id = $props.id();

	// Close the card when the picker switches to another section.
	$effect(() => {
		void section.id;
		open = null;
	});

	const rows = $derived(
		fields.reduce<Field[][]>((acc, f, i) => {
			if (i % 2 === 0) acc.push([f]);
			else acc[acc.length - 1]!.push(f);
			return acc;
		}, [])
	);

	const errorsFor = (f: Field): ClientIssue[] =>
		section.issues.filter((i) => i.severity === 'error' && i.field === f);

	function toggle(f: Field) {
		open = open === f ? null : f;
	}
</script>

<section class="group" aria-label={label}>
	{#each rows as row, r (r)}
		<div class="row">
			{#each row as f (f)}
				{@const q = quantity(f)}
				{@const v = valueOf(section, f)}
				{@const flagged = errorsFor(f).length > 0}
				<button
					type="button"
					class="tile"
					class:active={open === f}
					aria-expanded={open === f}
					aria-controls="{id}-card"
					onclick={() => toggle(f)}
				>
					<span class="head">
						<span class="t-symbol">{f}</span>
						{#if flagged}<FlagMark label={t('status.flagged')} />{/if}
					</span>
					{#if v !== undefined}
						<Stat
							value={scaled(v, q)}
							unit={unitLabel(q)}
							size="md"
							format={{ maximumFractionDigits: 3 }}
						/>
					{/if}
					<span class="name t-body-sm">{t(`quantity.${f}.name`)}</span>
				</button>
			{/each}
		</div>
		{#if open && row.includes(open)}
			{@const f = open}
			{@const issues = errorsFor(f)}
			<div
				class="card"
				id="{id}-card"
				role="region"
				aria-label={t('profile.explain', { name: t(`quantity.${f}.name`) })}
			>
				<div class="card-head">
					<h3 class="t-title">{t(`quantity.${f}.name`)}</h3>
					<IconButton
						icon={X}
						tone="ghost"
						label={t('common.close')}
						onclick={() => (open = null)}
					/>
				</div>
				<p class="t-body">{t(`quantity.${f}.explain`)}</p>
				{#each issues as issue (issue.check)}
					<div class="issue">
						<FlagMark label={t('status.flagged')} />
						<p class="t-body-sm">
							{t(`check.${issue.check as 'mass'}`)}{#if issue.expected !== undefined}. {t(
									'check.expected',
									{
										value: `${formatNumber(scaled(issue.expected, quantity(f)), { maximumFractionDigits: 3 })} ${unitLabel(quantity(f))}`
									}
								)}{/if}
						</p>
					</div>
				{/each}
				{#if section.derived.includes(f)}
					<p class="t-body-sm muted">{t('check.missing')}</p>
				{/if}
			</div>
		{/if}
	{/each}
</section>

<style>
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.tile {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-align: left;
		min-height: var(--touch);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--type-data);
		color: var(--type-data-ink);
	}
	.tile.active {
		outline: 3px solid var(--lavender);
		outline-offset: -3px;
	}
	.tile.active:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}
	.name {
		color: var(--on-tile-muted);
	}
	.card {
		background: var(--lavender);
		color: var(--on-tile);
		border-radius: var(--radius-lg);
		padding: var(--space-2) var(--space-2) var(--space-5) var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.card > :not(.card-head) {
		padding-right: var(--space-3);
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		padding-top: var(--space-2);
	}
	.issue {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.muted {
		color: var(--on-tile-muted);
	}
</style>
