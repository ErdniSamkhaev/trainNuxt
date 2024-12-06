<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col items-center justify-center relative p-4"
  >
    <!-- Снежинки -->
    <div class="snow-container">
      <span
        v-for="(snowflake, index) in snowflakes"
        :key="index"
        class="snowflake"
        :style="{
          left: `${snowflake.left}%`,
          animationDuration: `${snowflake.animationDuration}s`,
          animationDelay: `${snowflake.animationDelay}s`,
        }"
      >
        ❄
      </span>
    </div>

    <!-- Заголовок -->
    <h1 class="text-3xl font-bold mb-6 text-center">
      🎄 Регистрация 🎅
    </h1>

    <!-- Форма регистрации -->
    <form
      @submit.prevent="register"
      class="flex flex-col gap-4 w-full max-w-md bg-white text-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 class="text-2xl font-bold text-center mb-4">Создайте аккаунт</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Введите email"
        class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Введите пароль"
        class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Подтвердите пароль"
        class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
      <button
        type="submit"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Зарегистрироваться
      </button>
    </form>

    <!-- Ссылки -->
    <p class="mt-6">
      Уже есть аккаунт?
      <NuxtLink to="/login" class="text-yellow-400 hover:underline"
        >Войти</NuxtLink
      >
    </p>

    <!-- Кнопка "Назад" -->
    <button
      @click="goBack"
      class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      Вернуться на главную
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

const { $supabase } = useNuxtApp(); // Получаем Supabase из Nuxt
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const router = useRouter();

// Снежинки
const snowflakes = ref(
  Array.from({ length: 50 }).map(() => ({
    left: Math.random() * 100,
    animationDuration: 5 + Math.random() * 5,
    animationDelay: Math.random() * -5,
  }))
);

const register = async () => {
  errorMessage.value = ""; // Сбрасываем сообщение об ошибке

  // Проверяем совпадение паролей
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Пароли не совпадают.";
    return;
  }

  try {
    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    alert("Регистрация прошла успешно! Проверьте вашу почту.");
    router.push("/login");
  } catch (error) {
    console.error("Ошибка регистрации:", error.message);
    errorMessage.value = error.message;
  }
};

// Функция для перехода на главную
const goBack = () => {
  router.push("/");
};
</script>

<style>
/* Снежинки */
@keyframes snow {
  0% {
    transform: translateY(-10%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh);
    opacity: 0;
  }
}

.snowflake {
  position: fixed;
  top: -10px;
  font-size: 1.2em;
  color: white;
  pointer-events: none;
  animation: snow linear infinite;
}

.snow-container .snowflake {
  left: var(--left);
}

/* Основной фон */
body {
  background: linear-gradient(to bottom, #001f3f, #0074d9);
}

/* Новогодняя форма */
form {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

form h2 {
  color: #333333;
}

form button {
  background-color: #e74c3c;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #c0392b;
}

.text-red-500 {
  color: #f56565;
}
</style>
