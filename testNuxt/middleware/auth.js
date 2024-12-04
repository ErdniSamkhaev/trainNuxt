export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $supabase } = useNuxtApp();
  const { data: session } = await $supabase.auth.getSession();

  // Разрешаем доступ к странице восстановления пароля без проверки сессии
  if (to.path === "/reset-password") {
    return;
  }

  // Если сессии нет, пытаемся обновить токен или перенаправляем на /login
  if (!session?.session) {
    const { error } = await $supabase.auth.refreshSession();
    if (error) {
      return navigateTo("/login");
    }
  }

  // Если пользователь авторизован и пытается зайти на страницу входа или регистрации
  if (session?.session && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/");
  }
});
