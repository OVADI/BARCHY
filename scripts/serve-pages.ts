/**
 * Serves build/ the way GitHub Pages does, for offline and fallback tests:
 * files under BASE_PATH, 'x' → 'x.html' or 'x/index.html', anything else → 404.html with status 404.
 * Run after `BASE_PATH=/barchy npm run build`: npm run serve:pages
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const ROOT = join(import.meta.dirname, '..', 'build');
const BASE = process.env.BASE_PATH ?? '/barchy';
const PORT = Number(process.env.PORT ?? 4174);

const TYPES: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.webmanifest': 'application/manifest+json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2'
};

function resolveFile(path: string): string | null {
	const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
	const candidates = [safe, `${safe}.html`, join(safe, 'index.html')];
	for (const c of candidates) {
		const file = join(ROOT, c);
		if (file.startsWith(ROOT) && existsSync(file) && statSync(file).isFile()) return file;
	}
	return null;
}

createServer((req, res) => {
	const url = new URL(req.url ?? '/', 'http://localhost');
	let file: string | null = null;
	if (url.pathname.startsWith(`${BASE}/`) || url.pathname === BASE) {
		file = resolveFile(decodeURIComponent(url.pathname.slice(BASE.length)) || '/');
	}
	const status = file ? 200 : 404;
	file ??= join(ROOT, '404.html');
	res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
	createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`GitHub Pages-like server: http://localhost:${PORT}${BASE}/`));
