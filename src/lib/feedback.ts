export const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export type FeedbackResult = 'ok' | 'offline' | 'error';

export interface Feedback {
	message: string;
	/** Optional reply address. */
	email?: string;
	/** Honeypot: filled in by bots only. Web3Forms drops the message when it is set. */
	botcheck?: string;
}

export function feedbackPayload(key: string, { message, email, botcheck }: Feedback) {
	return {
		access_key: key,
		subject: 'BARCHY feedback',
		from_name: 'BARCHY',
		message: message.trim(),
		...(email?.trim() ? { email: email.trim() } : {}),
		botcheck: botcheck ?? ''
	};
}

/** Sends feedback to the maker via Web3Forms. Works online only; the app itself has no server. */
export async function sendFeedback(
	key: string,
	feedback: Feedback,
	fetchFn: typeof fetch = fetch,
	online: boolean = typeof navigator === 'undefined' || navigator.onLine !== false
): Promise<FeedbackResult> {
	if (!online) return 'offline';
	try {
		const res = await fetchFn(WEB3FORMS_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(feedbackPayload(key, feedback))
		});
		const body = (await res.json().catch(() => ({}))) as { success?: boolean };
		return res.ok && body.success !== false ? 'ok' : 'error';
	} catch {
		// A network failure right after going offline looks the same as being offline.
		return typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error';
	}
}
