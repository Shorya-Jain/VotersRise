// Google Search Console ownership check for https://votersrise.pages.dev/
// (URL-prefix property, "HTML tag" method). Paste only the content value.
export const googleSiteVerification = 'NtqNSPM3JXfJne67_J0k6drFnL0UHk_WF5U6rBk2FUU';

/** schema.org JSON-LD for a page: site info on the home page, breadcrumbs elsewhere. */
export function structuredData(site: URL, path: string, pageName: string, siteName: string) {
  const home = new URL('/', site).href;
  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: siteName, url: home, inLanguage: 'en-IN' },
        {
          '@type': 'Organization',
          name: siteName,
          url: home,
          sameAs: ['https://github.com/Shorya-Jain/VotersRise'],
        },
      ],
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: siteName, item: home },
      { '@type': 'ListItem', position: 2, name: pageName, item: new URL(path, site).href },
    ],
  };
}
