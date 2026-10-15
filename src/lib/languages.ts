// Languages offered in the Google Translate selector: the scheduled languages of India
// that Google Translate supports (checked 15 Oct 2026). Bodo and Kashmiri are not
// supported by Google yet. `code` is Google's language code.

export interface Language {
  code: string;
  name: string; // in the language itself
  englishName: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', englishName: 'English' },
  { code: 'as', name: 'অসমীয়া', englishName: 'Assamese' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali' },
  { code: 'doi', name: 'डोगरी', englishName: 'Dogri' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'gom', name: 'कोंकणी', englishName: 'Konkani' },
  { code: 'mai', name: 'मैथिली', englishName: 'Maithili' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'mni-Mtei', name: 'ꯃꯤꯇꯩꯂꯣꯟ', englishName: 'Manipuri' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali' },
  { code: 'or', name: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { code: 'sa', name: 'संस्कृतम्', englishName: 'Sanskrit' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ', englishName: 'Santali' },
  { code: 'sd', name: 'سنڌي', englishName: 'Sindhi' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu' },
  { code: 'ur', name: 'اردو', englishName: 'Urdu' },
];

/**
 * The page opened through Google Translate's website proxy. Works only for pages on
 * a public URL. Pass the current Pages deployment URL, or the configured site URL.
 */
export function proxyUrl(site: URL, path: string, code: string): string {
  const host = site.host.replace(/-/g, '--').replace(/\./g, '-');
  return `https://${host}.translate.goog${path}?_x_tr_sl=en&_x_tr_tl=${code}&_x_tr_hl=${code}`;
}
