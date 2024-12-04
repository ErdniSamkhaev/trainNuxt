<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 class="text-2xl font-bold mb-4">Восстановление пароля</h1>
      <form @submit.prevent="sendResetEmail" class="flex flex-col gap-4 w-full max-w-md">
        <input
          v-model="email"
          type="email"
          placeholder="Введите email"
          class="p-2 border rounded"
          required
        />
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Отправить письмо для восстановления
        </button>
      </form>
      <p class="mt-4">
        <NuxtLink to="/login" class="text-blue-500 hover:underline">Вернуться к входу</NuxtLink>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const { $supabase } = useNuxtApp();
  const email = ref("");
  const router = useRouter();
  
  const sendResetEmail = async () => {
    try {
      const { error } = await $supabase.auth.resetPasswordForEmail(email.value);
      if (error) throw error;
      alert("Письмо для восстановления пароля отправлено! Проверьте свою почту.");
      router.push("/login");
    } catch (error) {
      console.error("Ошибка восстановления пароля:", error.message);
      alert(error.message);
    }
  };
  </script>
  