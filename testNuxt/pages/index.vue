<template>
    <div
      class="min-h-screen flex flex-col justify-center items-center bg-gray-100 gap-4"
    >
      <h1 class="text-2xl font-bold mb-4">Добро пожаловать в ToDo App</h1>
      <template v-if="user">
        <p>Вы вошли как: {{ user.email }}</p>
        <nuxt-link to="/todo" class="mt-4 text-blue-500 hover:underline">
          Перейти к списку задач
        </nuxt-link>
        <button @click="logout" class="mt-2 text-red-500 hover:underline">
          Выйти
        </button>
      </template>
      <template v-else>
        <nuxt-link to="/login" class="mt-4 text-blue-500 hover:underline">
          Войти
        </nuxt-link>
        <nuxt-link to="/register" class="mt-2 text-green-500 hover:underline">
          Зарегистрироваться
        </nuxt-link>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
 
  const user = ref(null);
  const { $supabase } = useNuxtApp();

  const fetchUser = async () => {
    const { data } = await $supabase.auth.getUser();
    user.value = data.user;
  };
  
  const logout = async () => {
    await $supabase.auth.signOut();
    user.value = null;
    alert("Вы вышли из системы!");
  };
  
  fetchUser();
  </script>
  