// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Vuex store configuration

import './assets/css/main.css'

createApp(App).use(router).use(store).mount('#app')