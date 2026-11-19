
// Plugins
import { registerPlugins } from './plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import './index.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
