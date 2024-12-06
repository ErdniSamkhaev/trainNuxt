<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 class="text-2xl font-bold mb-4">Сброс пароля</h1>
      <form @submit.prevent="resetPassword" class="flex flex-col gap-4 w-full max-w-md">
        <input
          v-model="password"
          type="password"
          placeholder="Введите новый пароль"
          class="p-2 border rounded"
          required
        />
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Установить новый пароль
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useNuxtApp } from "#app";
  
  const { $supabase } = useNuxtApp();
  const password = ref("");
  const router = useRouter();
  
  const resetPassword = async () => {
    try {
      const { error } = await $supabase.auth.updateUser({
        password: password.value,
      });
      if (error) throw error;
      alert("Пароль успешно обновлен!");
      router.push("/login");
    } catch (error) {
      console.error("Ошибка сброса пароля:", error.message);
      alert(error.message);
    }
  };
  </script>
  