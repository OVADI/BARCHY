import { describe, expect, it } from 'vitest';
import { detectPlatform } from './install';

const UA = {
	iosSafari:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
	iosChrome:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0 Mobile/15E148 Safari/604.1',
	ipadOs:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
	androidChrome:
		'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Mobile Safari/537.36',
	samsung:
		'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0 Mobile Safari/537.36',
	androidFirefox: 'Mozilla/5.0 (Android 14; Mobile; rv:124.0) Gecko/124.0 Firefox/124.0',
	chromeMac:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
	safariMac:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
	firefoxMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0'
};

describe('detectPlatform', () => {
	it('recognises iOS browsers', () => {
		expect(detectPlatform(UA.iosSafari)).toBe('ios-safari');
		expect(detectPlatform(UA.iosChrome)).toBe('ios-other');
	});
	it('treats a touch-capable Mac UA as iPadOS', () => {
		expect(detectPlatform(UA.ipadOs, 5)).toBe('ios-safari');
		expect(detectPlatform(UA.ipadOs, 0)).toBe('desktop-safari');
	});
	it('recognises Android browsers', () => {
		expect(detectPlatform(UA.androidChrome)).toBe('android-chrome');
		expect(detectPlatform(UA.samsung)).toBe('android-samsung');
		expect(detectPlatform(UA.androidFirefox)).toBe('android-other');
	});
	it('recognises desktop browsers', () => {
		expect(detectPlatform(UA.chromeMac)).toBe('desktop-chromium');
		expect(detectPlatform(UA.safariMac)).toBe('desktop-safari');
		expect(detectPlatform(UA.firefoxMac)).toBe('desktop-other');
	});
});
