import raw from '../../content/sources.json';
import type { SourceRef } from './schema/source';

// Validated by Zod in sources.test.ts (and at build time from phase 2), so Zod stays out of the client bundle.
export const sources: Record<string, SourceRef> = raw;

export function source(id: keyof typeof raw): SourceRef {
	return raw[id];
}
