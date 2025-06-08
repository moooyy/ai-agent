import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import TDesign from 'tdesign-vue-next';
import TDesignChat from '@tdesign-vue-next/chat'; // 引入chat组件

const app = createApp(App);
app.use(router)
app.use(TDesign).use(TDesignChat);
app.mount('#app')