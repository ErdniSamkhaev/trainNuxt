<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 class="text-2xl font-bold mb-4">Вход</h1>
      <form @submit.prevent="login" class="flex flex-col gap-4 w-full max-w-md">
        <input
          v-model="email"
          type="email"
          placeholder="Введите email"
          class="p-2 border rounded"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Введите пароль"
          class="p-2 border rounded"
          required
        />
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>
      </form>
      <p class="mt-4">
        Нет аккаунта?
        <NuxtLink to="/register" class="text-blue-500 hover:underline">Зарегистрироваться</NuxtLink>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const { $supabase } = useNuxtApp();
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  
  const login = async () => {
  try {
    const { error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    alert("Вы успешно вошли!");
    router.push("/");
  } catch (error) {
    console.error("Ошибка входа:", error.message);
    alert(error.message);
  }
};
  </script>
  