import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import { VCalendar } from 'vuetify/labs/VCalendar'

const vuetify = createVuetify({
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    components: { VCalendar },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)        // <— UPEWNIJ SIE, ze Vuetify jest uzyte na TYM app
app.mount('#app')
