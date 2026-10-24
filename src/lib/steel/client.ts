import type { ImportOrigin, Issue, SourceRef } from '$lib/schema/source';
import type { SteelFamily, SteelFile, SteelSection } from '$lib/schema/steel';

/**
 * What the browser gets per family: the validated content minus text that only the import
 * report needs. Generated at build time by /data/steel/[family].json and precached.
 */
export type ClientIssue = Omit<Issue, 'message'>;
/** Omit that keeps a union a union (plain Omit collapses it to the shared fields). */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type ClientSection = DistributiveOmit<SteelSection, 'issues'> & { issues: ClientIssue[] };

export interface ClientSteelFile {
	family: SteelFamily;
	source: SourceRef;
	origin: ImportOrigin;
	sections: ClientSection[];
}

export function toClient(file: SteelFile): ClientSteelFile {
	return {
		family: file.family,
		source: file.source,
		origin: file.origin,
		sections: file.sections.map((s) => ({
			...s,
			issues: s.issues.map(({ check, severity, field, expected, found }) => ({
				check,
				severity,
				field,
				expected,
				found
			}))
		}))
	};
}
