// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
//import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import "vuetify/styles"
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const customTheme = {
  dark: false,
  colors: {
    primary: '#000'
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  //Layout: BaseLayout,
  enhanceApp({ app }) {
    // app.component('BaseLayout', BaseLayout)   
    app.use(vuetify);
  }
} //satisfies Theme
