<script lang="ts">
	import {
		AREA,
		CONCRETE_DOTS,
		CONCRETE_TILE,
		CONCRETE_TRIANGLES,
		SAND_DOTS
	} from '$lib/drawing/hatches';

	interface Props {
		/** Hatch id from content/drawing/conventions.json with an area pattern. */
		hatch: string;
		x: number;
		y: number;
		width: number;
		height: number;
	}

	/** Fills a rectangle with a Vademecum hatch, in currentColor. Use inside an <svg>. */
	let { hatch, x, y, width, height }: Props = $props();

	const uid = $props.id();
	const layers = $derived(AREA[hatch] ?? []);
</script>

<defs>
	{#each layers as layer, i (i)}
		{#if layer.kind === 'lines'}
			<pattern
				id="{uid}-{i}"
				width={layer.period}
				height={layer.period}
				patternUnits="userSpaceOnUse"
				patternTransform="rotate({-layer.angle})"
			>
				{#each layer.lines as [offset, w] (offset)}
					{#each [offset, offset + layer.period] as at (at)}
						<rect x="0" y={at - w / 2} width={layer.period} height={w} fill="currentColor" />
					{/each}
				{/each}
			</pattern>
		{:else if layer.kind === 'concrete'}
			<pattern
				id="{uid}-{i}"
				width={CONCRETE_TILE.w}
				height={CONCRETE_TILE.h}
				patternUnits="userSpaceOnUse"
			>
				{#each CONCRETE_TRIANGLES as [cx, cy] (`${cx},${cy}`)}
					<path
						d="M{cx} {cy - 3.5}l3.5 6h-7z"
						fill="none"
						stroke="currentColor"
						stroke-width="0.7"
					/>
				{/each}
				{#each CONCRETE_DOTS as [cx, cy] (`${cx},${cy}`)}
					<circle {cx} {cy} r="0.5" fill="currentColor" />
				{/each}
			</pattern>
		{:else if layer.kind === 'sand'}
			<pattern id="{uid}-{i}" width="30" height="30" patternUnits="userSpaceOnUse">
				{#each SAND_DOTS as [cx, cy] (`${cx},${cy}`)}
					<circle {cx} {cy} r="0.9" fill="currentColor" />
				{/each}
			</pattern>
		{/if}
	{/each}
</defs>
{#each layers as layer, i (i)}
	{#if layer.kind === 'fill'}
		<rect
			{x}
			{y}
			{width}
			{height}
			fill="currentColor"
			fill-opacity={layer.tone === 'black' ? 1 : 0.25}
		/>
	{:else}
		<rect {x} {y} {width} {height} fill="url(#{uid}-{i})" />
	{/if}
{/each}
