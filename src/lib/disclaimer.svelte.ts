const STORAGE_KEY = 'barchy.disclaimer';
/** Raise this when the disclaimer text changes, so everyone reads it once more. */
const VERSION = '1';

const state = $state({ open: false });

export const disclaimer = {
	get open(): boolean {
		return state.open;
	},
	show() {
		state.open = true;
	},
	/** Closes the dialog and remembers that it has been read. */
	accept() {
		state.open = false;
		try {
			localStorage.setItem(STORAGE_KEY, VERSION);
		} catch {
			// Storage blocked: it shows again next time, which is the safe side.
		}
	}
};

/** Shows the disclaimer on the first visit; call once on the client. */
export function initDisclaimer(): void {
	let seen: string | null = null;
	try {
		seen = localStorage.getItem(STORAGE_KEY);
	} catch {
		seen = null;
	}
	if (seen !== VERSION) state.open = true;
}
