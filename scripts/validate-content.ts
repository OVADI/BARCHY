import { join } from 'node:path';
import { formatErrors, validateContent } from '../src/lib/content/validate';

const errors = validateContent(join(import.meta.dirname, '..', 'content'));
if (errors.length) {
	console.error(formatErrors(errors));
	process.exit(1);
}
console.log('Content OK');
