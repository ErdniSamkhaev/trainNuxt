export default defineNuxtConfig({
  modules: ["@vite-pwa/nuxt"],
  pwa: {
    manifest: {
      name: "Todo App",
      short_name: "Todo",
      description: "Простое приложение для управления задачами",
      theme_color: "#ffffff",
      icons: [
        {
          src: "/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"], // Автокэширование файлов
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/train-nuxt\.vercel\.app\//, // URL приложения
          handler: "NetworkFirst", // Приоритет сети
          options: {
            cacheName: "app-cache",
            expiration: {
              maxEntries: 50, // Ограничение по количеству файлов
              maxAgeSeconds: 24 * 60 * 60, // 1 день
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//, // Google Fonts
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1 год
            },
          },
        },
      ],
    },
    registerType: "autoUpdate", // Автоматическое обновление Service Worker
  },
  ssr: false,
  app: {
    baseURL: "/",
  },
  plugins: ["~/plugins/supabase.client.js"],
  runtimeConfig: {
    public: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    },
  },
  css: ["~/assets/css/main.css"], // Подключаем стили
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
