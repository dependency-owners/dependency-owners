import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'dependency-owners',
  description: 'Determine ownership of dependencies in a project',
  base: '/dependency-owners/',
  themeConfig: {
    nav: [
      {
        text: 'Docs',
        link: '/',
      },
    ],
    sidebar: [
      {
        text: 'Usage',
        items: [
          {
            text: 'Getting started',
            link: '/',
          },
          {
            text: 'Configuration',
            link: '/usage/configuration',
          },
          {
            text: 'Loaders',
            link: '/usage/loaders',
          },
          {
            text: 'CLI',
            link: '/usage/cli',
          },
        ],
      },
      {
        text: 'CI Configuration',
        items: [
          {
            text: 'GitHub Actions',
            link: '/ci-configuration/github-actions',
          },
        ],
      },
      {
        text: 'Developer Guide',
        items: [
          {
            text: 'JavaScript API',
            link: '/developer-guide/javascript-api',
          },
          {
            text: 'Loader Development',
            link: '/developer-guide/loader-development',
          },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/dependency-owners/dependency-owners',
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/dependency-owners',
      },
    ],
  },
});
