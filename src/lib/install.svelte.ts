import { disclaimer } from '$lib/disclaimer.svelte';
import { detectPlatform, isMobile, isStandalone, type InstallPlatform } from '$lib/install';

const STORAGE_KEY = 'barchy.install';

/** Chromium's install prompt event, which is not in the DOM typings. */
interface InstallPromptEvent extends Event {
	prompt(): Promise<unknown>;
}

const state = $state<{
	open: boolean;
	platform: InstallPlatform;
	prompt: InstallPromptEvent | null;
}>({ open: false, platform: 'desktop-other', prompt: null });

function seen(): boolean {
	try {
		return localStorage.getItem(STORAGE_KEY) !== null;
	} catch {
		return false;
	}
}

export const install = {
	get open(): boolean {
		return state.open;
	},
	get platform(): InstallPlatform {
		return state.platform;
	},
	/** The native install prompt, when the browser offers one. */
	get canPrompt(): boolean {
		return state.prompt !== null;
	},
	show() {
		state.open = true;
	},
	/** Closes the guide and remembers that it has been shown. */
	dismiss() {
		state.open = false;
		try {
			localStorage.setItem(STORAGE_KEY, '1');
		} catch {
			// Storage blocked: it may show again next visit, which is harmless.
		}
	},
	async prompt() {
		const event = state.prompt;
		if (!event) return;
		state.prompt = null;
		await event.prompt();
		install.dismiss();
	}
};

/**
 * Shows the guide once on a first mobile visit, after the disclaimer has been read.
 * Call once on the client.
 */
export function initInstall(): void {
	state.platform = detectPlatform(navigator.userAgent, navigator.maxTouchPoints);
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		state.prompt = e as InstallPromptEvent;
	});
	if (isStandalone() || seen() || !isMobile(state.platform)) return;
	// Never two dialogs at once: wait until the disclaimer is closed.
	const stop = $effect.root(() => {
		$effect(() => {
			if (disclaimer.open) return;
			state.open = true;
			// One-shot: reopening the disclaimer from the About page must not bring this back.
			queueMicrotask(() => stop());
		});
	});
}
