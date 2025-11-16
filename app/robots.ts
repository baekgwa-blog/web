import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://blog.baekgwa.site';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/blog/write/', '/stack/create/', '/stack/*/edit/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
