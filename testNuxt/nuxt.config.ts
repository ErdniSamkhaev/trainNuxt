export default defineNuxtConfig({
  modules: ["@vite-pwa/nuxt"],
  pwa: {
    manifest: {
      name: "Todo App",
      short_name: "Todo",
      description: "Простое приложение для управления задачами",
      theme_color: "#ffffff",
      icons: [
        { src: "/icon-72x72.png", sizes: "72x72", type: "image/png" },
        { src: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
        { src: "/icon-128x128.png", sizes: "128x128", type: "image/png" },
        { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-256x256.png", sizes: "256x256", type: "image/png" },
        { src: "/icon-384x384.png", sizes: "384x384", type: "image/png" },
        { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/train-nuxt\.vercel\.app\/todo\/.*/, // Динамические маршруты
          handler: "NetworkFirst",
          options: {
            cacheName: "dynamic-routes",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 7 * 24 * 60 * 60,
            },
            networkTimeoutSeconds: 10,
          },
        },
        {
          urlPattern: /^https:\/\/train-nuxt\.vercel\.app\//,
          handler: "NetworkFirst",
          options: {
            cacheName: "app-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 365 * 24 * 60 * 60,
            },
          },
        },
      ],
      navigateFallback: null, // Отключить fallback
    },
    registerType: "autoUpdate",
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
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
