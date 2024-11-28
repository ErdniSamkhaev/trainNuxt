<template>
    <div
      class="min-h-screen flex flex-col justify-center items-center bg-gray-100 gap-4"
    >
      <h1 class="text-2xl font-bold mb-4">Добро пожаловать в ToDo App</h1>
      <template v-if="user">
        <p>Вы вошли как: {{ user.email }}</p>
        <button
          @click="goToTasks"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Перейти к списку задач
        </button>
        <button
          @click="logout"
          class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
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
  import { useRouter } from "vue-router";
  
  const user = ref(null);
  const { $supabase } = useNuxtApp();
  const router = useRouter();
  
  const fetchUser = async () => {
    const { data } = await $supabase.auth.getUser();
    user.value = data.user;
  };
  
  const logout = async () => {
    await $supabase.auth.signOut();
    user.value = null;
    alert("Вы вышли из системы!");
  };
  
  const goToTasks = () => {
    router.push("/todo");
  };
  
  fetchUser();
  </script>
  