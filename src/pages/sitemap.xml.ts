import type { APIRoute } from 'astro';

const routes = [
  '/', '/programs/', '/about/', '/classes/', '/gallery/', '/resources/', '/join/', '/register/',
  '/en/', '/en/programs/', '/en/about/', '/en/classes/', '/en/gallery/', '/en/resources/', '/en/join/', '/en/register/',
];

export const GET: APIRoute = ({ site }) => {
  const origin = site || new URL('https://example.com');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = routes.map((path) => `<url><loc>${new URL(`${base}${path}`, origin)}</loc></url>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
