<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
  >
    <h1 class="text-2xl font-bold mb-4">Сброс пароля</h1>
    <form
      @submit.prevent="resetPassword"
      class="flex flex-col gap-4 w-full max-w-md"
    >
      <input
        v-model="newPassword"
        type="password"
        placeholder="Введите новый пароль"
        class="p-2 border rounded"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Сбросить пароль
      </button>
    </form>
    <p class="mt-4">
      <NuxtLink to="/login" class="text-blue-500 hover:underline"
        >Вернуться к входу</NuxtLink
      >
    </p>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const { $supabase } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const newPassword = ref("");

onMounted(async () => {
  // Проверяем параметры URL для сброса пароля
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = hashParams.get("access_token");
  const type = hashParams.get("type");

  if (type === "recovery" && accessToken) {
    try {
      const { error } = await $supabase.auth.setSession({
        access_token: accessToken,
      });

      if (error) {
        console.error("Ошибка установки сессии:", error.message);
        alert("Ссылка для восстановления пароля недействительна или устарела.");
        router.push("/forgot-password");
      }
    } catch (err) {
      console.error("Ошибка установки сессии:", err);
      alert("Ошибка восстановления пароля. Попробуйте снова.");
      router.push("/forgot-password");
    }
  } else {
    console.error("Некорректные параметры в URL");
    alert("Некорректная ссылка для восстановления пароля.");
    router.push("/forgot-password");
  }
});


const resetPassword = async () => {
  try {
    const { error } = await $supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (error) throw error;

    alert("Пароль успешно изменён! Теперь вы можете войти.");
    router.push("/login");
  } catch (error) {
    console.error("Ошибка сброса пароля:", error.message);
    alert("Ошибка сброса пароля. Попробуйте снова.");
  }
};

</script>
