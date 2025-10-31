import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'dependency-owners',
  description: 'Determine ownership of dependencies in a project',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'Docs',
        link: '/usage/getting-started',
      },
    ],

    sidebar: [
      {
        text: 'Usage',
        items: [{ text: 'Getting started', link: '/usage/getting-started' }],
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
