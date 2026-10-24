import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import raw from '../../content/sources.json';
import { SourceRef } from './schema/source';

describe('content/sources.json', () => {
	it('matches the SourceRef schema', () => {
		expect(() => z.record(z.string(), SourceRef).parse(raw)).not.toThrow();
	});
});
