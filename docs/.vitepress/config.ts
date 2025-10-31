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
            text: 'CLI',
            link: 'usage/cli',
          },
          {
            text: 'Configuration',
            link: '/usage/configuration',
          },
          {
            text: 'Loaders',
            link: '/usage/loaders',
          },
        ],
      },
      {
        text: 'Guides',
        items: [
          {
            text: 'JavaScript API',
            link: 'guides/javascript-api',
          },
          {
            text: 'Loader development',
            link: 'guides/loader-development',
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
