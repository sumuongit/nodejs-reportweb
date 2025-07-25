import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Path Point: Sample Power BI Report",
  description: "Sample Power BI Report",
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],

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
  cleanUrls: true 
})
