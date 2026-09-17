import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = site || new URL('https://example.com');
  const base = import.meta.env.BASE_URL.replace(/^\//, '').replace(/\/$/, '');
  const sitemapPath = base ? `${base}/sitemap.xml` : 'sitemap.xml';
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(sitemapPath, origin)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
