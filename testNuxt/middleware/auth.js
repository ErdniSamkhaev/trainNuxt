export default defineNuxtRouteMiddleware(async () => {
    const { $supabase } = useNuxtApp();
    const { data: session } = await $supabase.auth.getSession();
  
    // Проверяем, есть ли активная сессия
    if (!session?.session) {
      const { error } = await $supabase.auth.refreshSession();
      if (error) {
        return navigateTo("/login");
      }
    }
  });
  