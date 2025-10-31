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
        text: 'Introduction',
        items: [
          {
            text: 'Getting started',
            link: '/',
          },
        ],
      },
      {
        text: 'Guides',
        items: [
          {
            text: 'CLI',
            link: 'guide/cli',
          },
          {
            text: 'JavaScript API',
            link: 'guide/javascript-api',
          },
          {
            text: 'Using Loaders',
            link: 'guide/using-loaders',
          },
        ],
      },
      {
        text: 'APIs',
        items: [
          {
            text: 'Loader API',
            link: 'api/loader',
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
