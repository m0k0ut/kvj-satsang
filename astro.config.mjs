import { defineConfig } from 'astro/config';

const [repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split('/') || [];
const isProjectPage = Boolean(repositoryName && !repositoryName.endsWith('.github.io'));
const githubPagesOrigin = repositoryOwner ? `https://${repositoryOwner}.github.io` : undefined;

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || githubPagesOrigin || 'https://example.com',
  base: process.env.BASE_PATH || (isProjectPage ? `/${repositoryName}` : '/'),
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'te',
    locales: ['te', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
