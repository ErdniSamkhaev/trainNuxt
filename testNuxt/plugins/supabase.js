import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Инициализируем Supabase клиент
  const supabase = createClient(
    config.public.VITE_SUPABASE_URL,
    config.public.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true, // Сохраняем сессию
        autoRefreshToken: true, // Обновляем токены автоматически
      },
    }
  );  

  // Предоставляем Supabase во все части приложения
  nuxtApp.provide("supabase", supabase);
});