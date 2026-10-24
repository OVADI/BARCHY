import { untrack } from 'svelte';
import { read, write } from './kv';

/** One line of the bill of materials. G is copied so the list stays readable if data changes. */
export interface BomItem {
	id: string;
	/** Steel section id, e.g. 'he-200-a'. */
	sectionId: string;
	name: string;
	/** App path without base, e.g. '/steel/hea/200'. */
	path: string;
	G: number;
	/** mm */
	length: number;
	count: number;
}

export interface Bookmark {
	/** App path without base, so stored lists survive a change of base path. */
	path: string;
	name: string;
}

const RECENT_MAX = 8;

const state = $state<{ ready: boolean; bom: BomItem[]; favorites: Bookmark[]; recent: Bookmark[] }>(
	{
		ready: false,
		bom: [],
		favorites: [],
		recent: []
	}
);

let loading: Promise<void> | null = null;

/** Loads the stored lists once (client only). */
export function initSaved(): Promise<void> {
	loading ??= Promise.all([
		read<BomItem[]>('bom', []),
		read<Bookmark[]>('favorites', []),
		read<Bookmark[]>('recent', [])
	]).then(([bom, favorites, recent]) => {
		state.bom = bom;
		state.favorites = favorites;
		state.recent = recent;
		state.ready = true;
	});
	return loading;
}

const newId = () =>
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const saved = {
	get ready() {
		return state.ready;
	},
	get bom(): readonly BomItem[] {
		return state.bom;
	},
	get favorites(): readonly Bookmark[] {
		return state.favorites;
	},
	get recent(): readonly Bookmark[] {
		return state.recent;
	},

	addToBom(item: Omit<BomItem, 'id'>) {
		state.bom.push({ ...item, id: newId() });
		void write('bom', state.bom);
	},
	removeFromBom(id: string) {
		state.bom = state.bom.filter((i) => i.id !== id);
		void write('bom', state.bom);
	},
	clearBom() {
		state.bom = [];
		void write('bom', state.bom);
	},

	isFavorite(path: string): boolean {
		return state.favorites.some((f) => f.path === path);
	},
	toggleFavorite(b: Bookmark) {
		state.favorites = this.isFavorite(b.path)
			? state.favorites.filter((f) => f.path !== b.path)
			: [b, ...state.favorites];
		void write('favorites', state.favorites);
	},

	/** Most recent first, no duplicates. Untracked, so calling it from an $effect does not loop. */
	visit(b: Bookmark) {
		untrack(() => {
			state.recent = [b, ...state.recent.filter((r) => r.path !== b.path)].slice(0, RECENT_MAX);
			void write('recent', state.recent);
		});
	}
};
