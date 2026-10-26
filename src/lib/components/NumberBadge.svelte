<script lang="ts">
	/** Small numbered dot that ties a label to the same number in a drawing. */
	let { n }: { n: number } = $props();
</script>

<span class="badge" aria-hidden="true">{n}</span>

<style>
	.badge {
		display: inline-grid;
		place-items: center;
		box-sizing: border-box;
		width: 1.5em;
		height: 1.5em;
		margin-right: 0.5em;
		border: 1.5px solid currentColor;
		border-radius: 50%;
		font: 700 0.8em/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
</style>
