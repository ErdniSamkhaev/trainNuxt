// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    '~/plugins/supabase.js'
  ],
  runtimeConfig: {
    public: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    },
  },
  css: ['~/assets/css/main.css'], // Подключаем стили
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
