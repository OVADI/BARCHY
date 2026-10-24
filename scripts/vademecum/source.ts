import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ImportOrigin, SourceRef } from '../../src/lib/schema/source';

/** Pinned upstream commit: a new import is a deliberate change of this line. */
export const REPO = 'https://github.com/TeachBooks/vademecum';
export const COMMIT = '9a2f70afd158b7cee533c119bf4c88ae15106d4a';

export const SOURCE: SourceRef = {
	title: 'TU Delft Vademecum (TeachBooks)',
	ref: 'Oorspronkelijke staaldata: Bouwen met Staal',
	url: REPO,
	license: 'CC BY 4.0'
};

// Only the intro of staal.md names Bouwen met Staal; hout.md and betonstaal.md name no origin.
export const TIMBER_SOURCE: SourceRef = { ...SOURCE, ref: 'Dimensietabellen: Hout' };
export const REBAR_SOURCE: SourceRef = { ...SOURCE, ref: 'Dimensietabellen: Betonstaal' };

export const FILES = {
	steel: 'book/basis_gegevens/dimensietabellen/staal.md',
	timber: 'book/basis_gegevens/dimensietabellen/hout.md',
	rebar: 'book/basis_gegevens/dimensietabellen/betonstaal.md'
} as const;

const CACHE = join(import.meta.dirname, '..', '.cache', 'vademecum', COMMIT);

export function origin(path: string, section: string): ImportOrigin {
	return { repo: REPO, commit: COMMIT, path, section };
}

/** Reads a file at the pinned commit, from the local cache or GitHub. */
export async function load(path: string): Promise<string> {
	const file = join(CACHE, path);
	if (existsSync(file)) return readFileSync(file, 'utf8');
	const url = `https://raw.githubusercontent.com/TeachBooks/vademecum/${COMMIT}/${path}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
	const text = await res.text();
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, text);
	return text;
}
