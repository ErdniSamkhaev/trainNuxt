<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 class="text-2xl font-bold mb-4">Регистрация</h1>
      <form @submit.prevent="register" class="flex flex-col gap-4 w-full max-w-md">
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
          Зарегистрироваться
        </button>
      </form>
      <p class="mt-4">
        Уже есть аккаунт?
        <NuxtLink to="/login" class="text-blue-500 hover:underline">Войти</NuxtLink>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { createClient } from "@supabase/supabase-js";
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.VITE_SUPABASE_URL, config.public.VITE_SUPABASE_ANON_KEY);
  
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  
  const register = async () => {
    try {
      const { error } = await supabase.auth.signUp({ email: email.value, password: password.value });
      if (error) throw error;
      alert("Регистрация прошла успешно! Проверьте вашу почту.");
      router.push("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      alert(error.message);
    }
  };
  </script>
  