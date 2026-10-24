/**
 * Text normalisation shared by the index builder and the search box, so a query and the
 * indexed text always go through the same steps.
 */

/**
 * Lower case, no accents, '×' as 'x', decimal comma as point, other punctuation as space.
 * 'HE 200 A' → 'he 200 a', 'Ø48,3×4' → 'ø48.3x4', 'Uitzettingscoëfficiënt' → 'uitzettingscoefficient'.
 */
export function normalize(text: string): string {
	return (
		text
			.toLowerCase()
			// Ø is a letter of its own in Unicode; keep it, but drop the accents of é, ë and the like.
			.replace(/⌀/g, 'ø')
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/×/g, 'x')
			.replace(/(\d),(?=\d)/g, '$1.')
			// A point only survives between digits: 'art. 4.163' → 'art 4.163'.
			.replace(/\.(?!\d)|(?<!\d)\./g, ' ')
			.replace(/[^a-z0-9.ø]+/g, ' ')
			.trim()
	);
}

/** Without spaces: 'he 200 a' → 'he200a', so 'HEA200' and 'HEA 200' meet. */
export const compact = (normalized: string) => normalized.replace(/ /g, '');
