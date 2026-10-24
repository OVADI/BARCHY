<script lang="ts">
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	/** Visible warning on a value that failed a check or is not yet reviewed. Never colour alone. */
	let { label, tone = 'dark' }: { label: string; tone?: 'dark' | 'light' } = $props();
</script>

<span class="flag t-label tone-{tone}">
	<TriangleAlert size={14} strokeWidth={2} aria-hidden="true" />{label}
</span>

<style>
	.flag {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		align-self: flex-start;
		padding: 3px 8px;
		border-radius: var(--radius-pill);
		white-space: nowrap;
	}
	/* On light tiles (paper, orange, lavender) */
	.tone-dark {
		background: var(--on-tile);
		color: var(--warn);
	}
	/* On ground and surface */
	.tone-light {
		background: var(--warn);
		color: var(--on-tile);
	}
</style>
