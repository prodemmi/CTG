import {createApp} from 'vue'
import App from './App.vue'
import './node-api'
import "./scss/app.scss"
import pinia from "./store"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus);
app.use(pinia);

app.mount('#app').$nextTick(() => {
    postMessage({payload: 'removeLoading'}, '*')
})