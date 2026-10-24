import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateContent } from './validate';

const CONTENT = join(import.meta.dirname, '..', '..', '..', 'content');

describe('validateContent', () => {
	let dir: string | undefined;
	afterEach(() => dir && rmSync(dir, { recursive: true, force: true }));

	/** A scratch copy of /content to break on purpose. */
	function copy(): string {
		dir = mkdtempSync(join(tmpdir(), 'barchy-content-'));
		cpSync(CONTENT, dir, { recursive: true });
		return dir;
	}

	function edit(root: string, file: string, change: (data: Record<string, unknown>) => void) {
		const path = join(root, file);
		const data = JSON.parse(readFileSync(path, 'utf8'));
		change(data);
		writeFileSync(path, JSON.stringify(data));
	}

	it('accepts the committed content', () => {
		expect(validateContent(CONTENT)).toEqual([]);
	});

	it('rejects a steel record with a negative area', () => {
		const root = copy();
		edit(root, 'steel/ipe.json', (d) => ((d.sections as { A: number }[])[0]!.A = -1));
		expect(validateContent(root).some((e) => e.file === 'steel/ipe.json')).toBe(true);
	});

	it('rejects a record that has errors but claims to be verified', () => {
		const root = copy();
		edit(root, 'steel/ipe.json', (d) => {
			const flagged = (d.sections as { status: string }[]).find((s) => s.status === 'flagged')!;
			flagged.status = 'auto_checked';
		});
		expect(
			validateContent(root)
				.map((e) => e.message)
				.join()
		).toMatch(/has errors but status is auto_checked/);
	});

	it('rejects a missing translation', () => {
		const root = copy();
		edit(root, 'i18n/en.json', (d) => delete (d.nav as Record<string, string>).home);
		expect(validateContent(root)).toContainEqual({
			file: 'i18n/en.json',
			message: 'missing key nav.home'
		});
	});

	it('rejects a file without a schema', () => {
		const root = copy();
		writeFileSync(join(root, 'steel', 'angles.json'), '{}');
		expect(validateContent(root)[0]?.message).toMatch(/no schema/);
	});

	it('rejects a fact without a source', () => {
		const root = copy();
		const fact = {
			id: 'test-fact',
			topic: 'stairs',
			type: 'data',
			label: { nl: 'Test', en: 'Test' },
			value: 1,
			unit: 'mm',
			status: 'flagged'
		};
		mkdirSync(join(root, 'facts'), { recursive: true });
		writeFileSync(join(root, 'facts', 'stairs.json'), JSON.stringify({ facts: [fact] }));
		expect(validateContent(root).some((e) => e.message.startsWith('facts.0.source'))).toBe(true);
	});
});
