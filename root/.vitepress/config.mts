import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "A1 Polymer Power BI Report",
  description: "A1 Polymer Power BI Secure Report",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],

    // For PNG favicon
    //['link', { rel: 'icon', type: 'image/png', href: '/images/favicon.png', sizes: '105x96' }]
  ],

  themeConfig: {

  },
  vite: {
    ssr: {
      noExternal: [/\.css$/, /^vuetify/],
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: 4201
    // }
  },
  markdown: {
    // Ensure HTML is enabled in markdown-it
    html: true
  },
  cleanUrls: true,
})
