// @ts-expect-error: missing declaration file for 'unplugin-element-plus/vite'
import ElementPlus from 'unplugin-element-plus/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss'
    ],
    // build
    build: {
        transpile: ['element-plus/es'],
    },
    vue: {

    },
    vite: {
        plugins: [ElementPlus(), ],
    },

})
