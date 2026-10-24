import { describe, expect, it, vi } from 'vitest';
import { WEB3FORMS_URL, feedbackPayload, sendFeedback } from './feedback';

function response(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), { status });
}

describe('feedbackPayload', () => {
	it('trims the message and leaves out an empty email', () => {
		expect(feedbackPayload('k', { message: '  Graag HEB 1000  ', email: ' ' })).toEqual({
			access_key: 'k',
			subject: 'BARCHY feedback',
			from_name: 'BARCHY',
			message: 'Graag HEB 1000',
			botcheck: ''
		});
	});

	it('keeps a reply address', () => {
		expect(feedbackPayload('k', { message: 'x', email: 'a@b.nl' }).email).toBe('a@b.nl');
	});
});

describe('sendFeedback', () => {
	it('posts JSON to Web3Forms', async () => {
		const fetchFn = vi.fn(async () => response(200, { success: true }));
		expect(await sendFeedback('k', { message: 'hoi' }, fetchFn, true)).toBe('ok');
		const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe(WEB3FORMS_URL);
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body as string)).toMatchObject({ access_key: 'k', message: 'hoi' });
	});

	it('does not send while offline', async () => {
		const fetchFn = vi.fn();
		expect(await sendFeedback('k', { message: 'hoi' }, fetchFn, false)).toBe('offline');
		expect(fetchFn).not.toHaveBeenCalled();
	});

	it('reports a rejected or failed request as an error', async () => {
		expect(
			await sendFeedback(
				'k',
				{ message: 'hoi' },
				async () => response(400, { success: false }),
				true
			)
		).toBe('error');
		expect(
			await sendFeedback(
				'k',
				{ message: 'hoi' },
				async () => response(200, { success: false }),
				true
			)
		).toBe('error');
		expect(
			await sendFeedback(
				'k',
				{ message: 'hoi' },
				async () => {
					throw new TypeError('network');
				},
				true
			)
		).toBe('error');
	});
});
