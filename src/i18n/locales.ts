// English plus the 22 languages of the Eighth Schedule of the Constitution.
// `itCode` is the FLORES-style code IndicTrans2 uses for that language.
// Set `reviewed: true` once a native speaker has checked the translation;
// until then the page shows a "machine-translated" notice.

export interface Locale {
  code: string;
  itCode: string;
  name: string; // in the language itself
  englishName: string;
  dir: 'ltr' | 'rtl';
  reviewed: boolean;
}

export const locales: Locale[] = [
  { code: 'en', itCode: 'eng_Latn', name: 'English', englishName: 'English', dir: 'ltr', reviewed: true },
  { code: 'as', itCode: 'asm_Beng', name: 'অসমীয়া', englishName: 'Assamese', dir: 'ltr', reviewed: false },
  { code: 'bn', itCode: 'ben_Beng', name: 'বাংলা', englishName: 'Bengali', dir: 'ltr', reviewed: false },
  { code: 'brx', itCode: 'brx_Deva', name: 'बड़ो', englishName: 'Bodo', dir: 'ltr', reviewed: false },
  { code: 'doi', itCode: 'doi_Deva', name: 'डोगरी', englishName: 'Dogri', dir: 'ltr', reviewed: false },
  { code: 'gu', itCode: 'guj_Gujr', name: 'ગુજરાતી', englishName: 'Gujarati', dir: 'ltr', reviewed: false },
  { code: 'hi', itCode: 'hin_Deva', name: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', reviewed: false },
  { code: 'kn', itCode: 'kan_Knda', name: 'ಕನ್ನಡ', englishName: 'Kannada', dir: 'ltr', reviewed: false },
  { code: 'ks', itCode: 'kas_Arab', name: 'کٲشُر', englishName: 'Kashmiri', dir: 'rtl', reviewed: false },
  { code: 'kok', itCode: 'gom_Deva', name: 'कोंकणी', englishName: 'Konkani', dir: 'ltr', reviewed: false },
  { code: 'mai', itCode: 'mai_Deva', name: 'मैथिली', englishName: 'Maithili', dir: 'ltr', reviewed: false },
  { code: 'ml', itCode: 'mal_Mlym', name: 'മലയാളം', englishName: 'Malayalam', dir: 'ltr', reviewed: false },
  { code: 'mni', itCode: 'mni_Mtei', name: 'ꯃꯤꯇꯩꯂꯣꯟ', englishName: 'Manipuri', dir: 'ltr', reviewed: false },
  { code: 'mr', itCode: 'mar_Deva', name: 'मराठी', englishName: 'Marathi', dir: 'ltr', reviewed: false },
  { code: 'ne', itCode: 'npi_Deva', name: 'नेपाली', englishName: 'Nepali', dir: 'ltr', reviewed: false },
  { code: 'or', itCode: 'ory_Orya', name: 'ଓଡ଼ିଆ', englishName: 'Odia', dir: 'ltr', reviewed: false },
  { code: 'pa', itCode: 'pan_Guru', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', dir: 'ltr', reviewed: false },
  { code: 'sa', itCode: 'san_Deva', name: 'संस्कृतम्', englishName: 'Sanskrit', dir: 'ltr', reviewed: false },
  { code: 'sat', itCode: 'sat_Olck', name: 'ᱥᱟᱱᱛᱟᱲᱤ', englishName: 'Santali', dir: 'ltr', reviewed: false },
  { code: 'sd', itCode: 'snd_Arab', name: 'سنڌي', englishName: 'Sindhi', dir: 'rtl', reviewed: false },
  { code: 'ta', itCode: 'tam_Taml', name: 'தமிழ்', englishName: 'Tamil', dir: 'ltr', reviewed: false },
  { code: 'te', itCode: 'tel_Telu', name: 'తెలుగు', englishName: 'Telugu', dir: 'ltr', reviewed: false },
  { code: 'ur', itCode: 'urd_Arab', name: 'اردو', englishName: 'Urdu', dir: 'rtl', reviewed: false },
];

export const defaultLocale = locales[0];

export function getLocale(code: string | undefined): Locale {
  return locales.find((l) => l.code === code) ?? defaultLocale;
}

/** For `getStaticPaths` in `src/pages/[...locale]/`: English lives at the root. */
export function localeStaticPaths() {
  return locales.map((l) => ({ params: { locale: l.code === 'en' ? undefined : l.code } }));
}
