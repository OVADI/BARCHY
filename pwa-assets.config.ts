import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// The source is a full-bleed orange square: Android and iOS round the corners themselves,
// and the mark sits well inside the maskable safe zone, so no extra padding is added.
export default defineConfig({
	headLinkOptions: { preset: '2023' },
	preset: {
		...minimal2023Preset,
		transparent: { ...minimal2023Preset.transparent, padding: 0 },
		maskable: { ...minimal2023Preset.maskable, padding: 0 },
		apple: { ...minimal2023Preset.apple, padding: 0 }
	},
	images: ['static/logo-oranje.png']
});
