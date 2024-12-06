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
      🎄 Добро пожаловать! 🎅
    </h1>

    <!-- Форма входа -->
    <form
      @submit.prevent="login"
      class="flex flex-col gap-4 w-full max-w-md bg-white text-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 class="text-2xl font-bold text-center mb-4">Вход</h2>
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
      <button
        type="submit"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Войти
      </button>
    </form>

    <!-- Ссылки -->
    <p class="mt-6">
      Нет аккаунта?
      <NuxtLink to="/register" class="text-yellow-400 hover:underline"
        >Зарегистрироваться</NuxtLink
      >
    </p>
    <p class="mt-2">
      Забыли пароль?
      <NuxtLink to="/ForgotPassword" class="text-yellow-400 hover:underline"
        >Восстановить</NuxtLink
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

const { $supabase } = useNuxtApp();
const email = ref("");
const password = ref("");
const router = useRouter();

const snowflakes = ref(
  Array.from({ length: 50 }).map(() => ({
    left: Math.random() * 100, // Позиция снежинки
    animationDuration: 5 + Math.random() * 5, // Скорость: 5–10 секунд
    animationDelay: Math.random() * -5, // Отрицательная задержка: уже началась анимация
  }))
);

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
    console.error("Ошибка входа:", error.message, "Введите правильные данные");
    alert(error.message);
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
  left: var(--left); /* Оставляем значение, но оно фиксировано */
  animation-duration: var(--speed, 5s);
  animation-delay: var(--delay, 0s);
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
</style>
