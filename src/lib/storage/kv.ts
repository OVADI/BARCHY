import { get as idbGet, set as idbSet } from 'idb-keyval';

/**
 * Small key-value store: IndexedDB via idb-keyval, falling back to localStorage, then to memory
 * (private mode, blocked storage). Values are JSON-serialisable.
 */
const memory = new Map<string, unknown>();
const PREFIX = 'barchy.';

function hasIndexedDb(): boolean {
	try {
		return typeof indexedDB !== 'undefined' && indexedDB !== null;
	} catch {
		return false;
	}
}

export async function read<T>(key: string, fallback: T): Promise<T> {
	if (hasIndexedDb()) {
		try {
			const value = await idbGet<T>(PREFIX + key);
			return value === undefined ? fallback : value;
		} catch {
			// fall through
		}
	}
	try {
		const raw = localStorage.getItem(PREFIX + key);
		if (raw !== null) return JSON.parse(raw) as T;
	} catch {
		// fall through
	}
	return memory.has(key) ? (memory.get(key) as T) : fallback;
}

export async function write<T>(key: string, value: T): Promise<void> {
	memory.set(key, value);
	// Snapshot, so later mutations of reactive proxies are not stored by reference.
	const plain = JSON.parse(JSON.stringify(value)) as T;
	if (hasIndexedDb()) {
		try {
			await idbSet(PREFIX + key, plain);
			return;
		} catch {
			// fall through
		}
	}
	try {
		localStorage.setItem(PREFIX + key, JSON.stringify(plain));
	} catch {
		// memory only
	}
}
