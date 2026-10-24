<script lang="ts">
	import { formatNumber, t } from '$lib/i18n/index.svelte';
	import type { ClientSection } from '$lib/steel/client';
	import { displayName } from '$lib/steel/names';

	let { section }: { section: ClientSection } = $props();

	// Drawing box in SVG units; dimension lines sit in the left and top margins.
	const W = 260;
	const H = 210;
	const LEFT = 44;
	const TOP = 34;
	const PAD = 8;

	const geo = $derived.by(() => {
		const s = section;
		const width = s.shape === 'tube' ? s.D : s.b;
		const height = s.shape === 'tube' ? s.D : s.h;
		const k = Math.min((W - LEFT - PAD) / width, (H - TOP - PAD) / height);
		const bw = width * k;
		const bh = height * k;
		const x0 = LEFT + (W - LEFT - PAD - bw) / 2;
		const y0 = TOP + (H - TOP - PAD - bh) / 2;
		const p = (x: number, y: number) => `${(x0 + x * k).toFixed(2)},${(y0 + y * k).toFixed(2)}`;
		let d = '';
		switch (s.shape) {
			case 'I': {
				const { b, h, tw, tf } = s;
				const l = (b - tw) / 2;
				const r = (b + tw) / 2;
				d = `M${[p(0, 0), p(b, 0), p(b, tf), p(r, tf), p(r, h - tf), p(b, h - tf), p(b, h), p(0, h), p(0, h - tf), p(l, h - tf), p(l, tf), p(0, tf)].join('L')}Z`;
				break;
			}
			case 'U': {
				const { b, h, tw } = s;
				// Flange thickness is not in the source for UNP; drawn with the web thickness.
				const tf = s.tf ?? tw;
				d = `M${[p(0, 0), p(b, 0), p(b, tf), p(tw, tf), p(tw, h - tf), p(b, h - tf), p(b, h), p(0, h)].join('L')}Z`;
				break;
			}
			case 'box': {
				const { b, h, t } = s;
				d = `M${[p(0, 0), p(b, 0), p(b, h), p(0, h)].join('L')}Z M${[p(t, t), p(t, h - t), p(b - t, h - t), p(b - t, t)].join('L')}Z`;
				break;
			}
			case 'tube': {
				const R = (s.D / 2) * k;
				const r = (s.D / 2 - s.t) * k;
				const cx = x0 + R;
				const cy = y0 + R;
				const circle = (rad: number) =>
					`M${(cx - rad).toFixed(2)},${cy.toFixed(2)}a${rad.toFixed(2)},${rad.toFixed(2)} 0 1,0 ${(2 * rad).toFixed(2)},0a${rad.toFixed(2)},${rad.toFixed(2)} 0 1,0 ${(-2 * rad).toFixed(2)},0`;
				d = `${circle(R)}${circle(r)}`;
				break;
			}
		}
		return { d, x0, y0, bw, bh, width, height };
	});

	const widthLabel = $derived(section.shape === 'tube' ? 'D' : 'b');
</script>

<figure class="figure">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label={t('profile.section', { name: displayName(section) })}
		class="svg"
	>
		<path d={geo.d} fill="currentColor" fill-rule="evenodd" />
		<!-- b (or D): dimension line above -->
		<g class="dim" aria-hidden="true">
			<line x1={geo.x0} y1={TOP - 14} x2={geo.x0 + geo.bw} y2={TOP - 14} />
			<line x1={geo.x0} y1={TOP - 20} x2={geo.x0} y2={geo.y0 - 4} />
			<line x1={geo.x0 + geo.bw} y1={TOP - 20} x2={geo.x0 + geo.bw} y2={geo.y0 - 4} />
			<text x={geo.x0 + geo.bw / 2} y={TOP - 20} text-anchor="middle"
				>{widthLabel} {formatNumber(geo.width)}</text
			>
		</g>
		{#if section.shape !== 'tube'}
			<!-- h: dimension line on the left -->
			<g class="dim" aria-hidden="true">
				<line x1={LEFT - 14} y1={geo.y0} x2={LEFT - 14} y2={geo.y0 + geo.bh} />
				<line x1={LEFT - 20} y1={geo.y0} x2={geo.x0 - 4} y2={geo.y0} />
				<line x1={LEFT - 20} y1={geo.y0 + geo.bh} x2={geo.x0 - 4} y2={geo.y0 + geo.bh} />
				<text
					x={LEFT - 20}
					y={geo.y0 + geo.bh / 2}
					text-anchor="middle"
					transform="rotate(-90 {LEFT - 20} {geo.y0 + geo.bh / 2})"
					>h {formatNumber(geo.height)}</text
				>
			</g>
		{/if}
	</svg>
	<figcaption class="t-label">
		{section.shape === 'U' && !section.tf ? t('profile.schematicU') : t('profile.schematic')}
	</figcaption>
</figure>

<style>
	.figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.svg {
		width: 100%;
		max-height: 240px;
		color: var(--on-tile);
	}
	.dim line {
		stroke: var(--on-tile);
		stroke-width: 1;
	}
	.dim text {
		font: 500 11px var(--font-mono);
		letter-spacing: 0.02em;
		fill: var(--on-tile);
	}
	figcaption {
		color: var(--on-tile-muted);
	}
</style>
