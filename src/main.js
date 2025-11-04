import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import {
  VApp,
  VContainer,
  VSelect,
  VIcon,
  VBtn,
  VListItem,
  VCard,
  VMenu,
  VToolbar,
} from 'vuetify/components'
import '@mdi/font/css/materialdesignicons.css'
import { VCalendar } from 'vuetify/labs/VCalendar'

const vuetify = createVuetify({
  components: {
    VSelect,
    VCalendar,
    VBtn,
    VIcon,
    VApp,
    VContainer,
    VListItem,
    VCard,
    VMenu,
    VToolbar,
  },
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify) // <— UPEWNIJ SIE, ze Vuetify jest uzyte na TYM app
app.mount('#app')
