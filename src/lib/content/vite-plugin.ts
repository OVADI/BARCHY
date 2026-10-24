import { join } from 'node:path';
import type { Plugin } from 'vite';
import { formatErrors, validateContent } from './validate';

/** Fails the build on invalid content; in dev, shows the error overlay when a content file changes. */
export function contentValidation(root: string): Plugin {
	const dir = join(root, 'content');
	return {
		name: 'barchy-content-validation',
		buildStart() {
			const errors = validateContent(dir);
			if (errors.length) this.error(formatErrors(errors));
		},
		handleHotUpdate({ file, server }) {
			if (!file.startsWith(dir)) return;
			const errors = validateContent(dir);
			if (errors.length) {
				server.ws.send({ type: 'error', err: { message: formatErrors(errors), stack: '' } });
			}
		}
	};
}
