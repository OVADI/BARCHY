export type InstallPlatform =
	| 'ios-safari'
	| 'ios-other'
	| 'android-chrome'
	| 'android-samsung'
	| 'android-other'
	| 'desktop-chromium'
	| 'desktop-safari'
	| 'desktop-other';

/** Picks the install instructions that match a user agent. */
export function detectPlatform(ua: string, maxTouchPoints = 0): InstallPlatform {
	// iPadOS 13+ reports itself as a Mac, but has touch points.
	const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1);
	if (ios) return /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) ? 'ios-other' : 'ios-safari';
	if (/Android/.test(ua)) {
		if (/SamsungBrowser/.test(ua)) return 'android-samsung';
		if (/Chrome\//.test(ua) && !/EdgA|OPR\/|Firefox/.test(ua)) return 'android-chrome';
		return 'android-other';
	}
	if (/Chrome\/|Edg\//.test(ua)) return 'desktop-chromium';
	if (/Safari\//.test(ua) && !/Firefox/.test(ua)) return 'desktop-safari';
	return 'desktop-other';
}

export const isMobile = (p: InstallPlatform): boolean =>
	p.startsWith('ios') || p.startsWith('android');

/** True when the app already runs from the home screen / as an installed app. */
export function isStandalone(): boolean {
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as Navigator & { standalone?: boolean }).standalone === true
	);
}
