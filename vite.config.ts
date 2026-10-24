import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import { contentValidation } from './src/lib/content/vite-plugin';

const base = process.env.BASE_PATH ?? '';
const scope = `${base}/`;

export default defineConfig({
	plugins: [
		contentValidation(import.meta.dirname),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			scope,
			base: scope,
			manifest: {
				id: scope,
				name: 'BARCHY',
				short_name: 'BARCHY',
				description:
					'Vademecum voor architectuur- en bouwkundestudenten / Reference for architecture students',
				lang: 'nl',
				start_url: scope,
				scope,
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#141414',
				theme_color: '#141414',
				categories: ['education', 'reference', 'utilities'],
				icons: [
					{ src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
					{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				// Precache the whole app: shell, prerendered pages, content data and fonts.
				globPatterns: [
					'client/**/*.{js,css,ico,png,svg,webp,woff2,json,webmanifest}',
					'prerendered/**/*.{html,json}'
				],
				globIgnores: ['**/dev/**'],
				// Profile URLs (/steel/hea/200) are not prerendered: offline they open the precached SPA shell.
				navigateFallbackDenylist: [/\/data\//],
				cleanupOutdatedCaches: true
			},
			kit: { includeVersionFile: true, adapterFallback: '404.html', spa: true }
		})
	],
	test: {
		include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'tests/unit/**/*.test.ts'],
		environment: 'node'
	}
});
