import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { z, type ZodType } from 'zod';
import { keyPaths } from '../i18n/messages';
import { RebarFile } from '../schema/concrete';
import { SteelCorrectionsFile } from '../schema/corrections';
import { DrawingFile } from '../schema/drawing';
import { FactFile } from '../schema/fact';
import { SourceRef } from '../schema/source';
import { ProfiledSheetFile, SteelFile } from '../schema/steel';
import { TimberFile } from '../schema/timber';

/**
 * Validates everything under /content. Used by the Vite plugin (a failed check fails the build),
 * `npm run validate` and the tests. Every file must match a schema: unknown files are errors too,
 * so nothing reaches the app unchecked.
 */

const Messages: ZodType = z.lazy(() =>
	z.record(z.string(), z.union([z.string().min(1), Messages]))
);

const SCHEMAS: [RegExp, ZodType][] = [
	[/^i18n\/(nl|en)\.json$/, Messages],
	[/^sources\.json$/, z.record(z.string(), SourceRef)],
	[/^steel\/(he|ipe|unp|shs|rhs|chs)\.json$/, SteelFile],
	[/^steel\/sheets\.json$/, ProfiledSheetFile],
	[/^steel\/corrections\.json$/, SteelCorrectionsFile],
	[/^timber\/sections\.json$/, TimberFile],
	[/^concrete\/rebar\.json$/, RebarFile],
	[/^drawing\/conventions\.json$/, DrawingFile],
	[/^facts\/[a-z0-9-]+\.json$/, FactFile]
];

export interface ContentError {
	file: string;
	message: string;
}

function files(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
		e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]
	);
}

export function validateContent(contentDir: string): ContentError[] {
	const errors: ContentError[] = [];
	const parsed = new Map<string, unknown>();

	for (const path of files(contentDir)) {
		const file = relative(contentDir, path).split('\\').join('/');
		if (file.endsWith('.md') || file.split('/').pop()!.startsWith('.')) continue;
		const schema = SCHEMAS.find(([re]) => re.test(file))?.[1];
		if (!schema) {
			errors.push({
				file,
				message: 'no schema for this file; add it to src/lib/content/validate.ts'
			});
			continue;
		}
		let data: unknown;
		try {
			data = JSON.parse(readFileSync(path, 'utf8'));
		} catch (e) {
			errors.push({ file, message: `invalid JSON: ${(e as Error).message}` });
			continue;
		}
		const result = schema.safeParse(data);
		if (!result.success) {
			for (const issue of result.error.issues.slice(0, 20)) {
				errors.push({ file, message: `${issue.path.join('.') || '(root)'}: ${issue.message}` });
			}
			continue;
		}
		parsed.set(file, result.data);
	}

	// Both locales must have exactly the same keys.
	const nl = parsed.get('i18n/nl.json');
	const en = parsed.get('i18n/en.json');
	if (nl && en) {
		const a = new Set(keyPaths(nl as object));
		const b = new Set(keyPaths(en as object));
		for (const k of a)
			if (!b.has(k)) errors.push({ file: 'i18n/en.json', message: `missing key ${k}` });
		for (const k of b)
			if (!a.has(k)) errors.push({ file: 'i18n/nl.json', message: `missing key ${k}` });
	}

	// Fact ids are unique across all fact files.
	const factIds = new Map<string, string>();
	for (const [file, data] of parsed) {
		if (!file.startsWith('facts/')) continue;
		for (const fact of (data as z.infer<typeof FactFile>).facts) {
			const other = factIds.get(fact.id);
			if (other) errors.push({ file, message: `fact id ${fact.id} also in ${other}` });
			factIds.set(fact.id, file);
		}
	}
	return errors;
}

export function formatErrors(errors: ContentError[]): string {
	return `Invalid content (${errors.length}):\n${errors.map((e) => `  content/${e.file}: ${e.message}`).join('\n')}`;
}
