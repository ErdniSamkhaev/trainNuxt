<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-between items-center"
  >
    <!-- Основная секция -->
    <div class="flex flex-col items-center text-center p-6 gap-6">
      <h1 class="text-4xl font-bold">{{ currentLanguage === "ru" ? "Добро пожаловать в ToDo App" : "Welcome to ToDo App" }}</h1>
      <p class="text-lg">
        {{
          currentLanguage === "ru"
            ? "Простое, но функциональное приложение для управления задачами. Начните прямо сейчас!"
            : "A simple yet functional task management app. Get started now!"
        }}
      </p>

      <!-- Кнопки навигации -->
      <template v-if="user">
        <p class="text-lg">{{
            currentLanguage === "ru"
              ? "Вы вошли как:"
              : "You are logged in as:"
          }} <strong>{{ user.email }}</strong></p>
        <button
          @click="goToTasks"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform hover:scale-105"
        >
        {{ currentLanguage === "ru" ? "Перейти к списку задач" : "Go to Task List" }}
        </button>
        <button
          @click="logout"
          class="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform hover:scale-105"
        >
        {{ currentLanguage === "ru" ? "Выйти" : "Logout" }}
        </button>
      </template>
      <template v-else>
        <nuxt-link
          to="/login"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform hover:scale-105"
        >
        {{ currentLanguage === "ru" ? "Войти" : "Login" }}
        </nuxt-link>
        <nuxt-link
          to="/register"
          class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform hover:scale-105"
        >
        {{ currentLanguage === "ru" ? "Зарегистрироваться" : "Register" }}
        </nuxt-link>
      </template>
    </div>

    <!-- О приложении -->
    <div class="bg-gray-200 dark:bg-gray-800 w-full py-8 px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">{{ currentLanguage === "ru" ? "Что вы можете делать?" : "What can you do?" }}</h2>
      <ul class="list-disc list-inside text-lg">
        <li>{{ currentLanguage === "ru" ? "Создавайте и управляйте задачами" : "Create and manage tasks" }}</li>
        <li>{{ currentLanguage === "ru" ? "Фильтруйте и сортируйте по дате и статусу" : "Filter and sort by date and status" }}</li>
        <li>{{ currentLanguage === "ru" ? "Переключайтесь между темной и светлой темой" : "Switch between dark and light themes" }}</li>
        <li>{{ currentLanguage === "ru" ? "Сохраняйте задачи с использованием Supabase" : "Save tasks using Supabase" }}</li>
        <li>{{ currentLanguage === "ru" ? "Добавляйте приложение на главный экран как PWA" : "Add the app to your home screen as a PWA" }}</li>
      </ul>
    </div>

    <!-- Footer -->
    <footer class="w-full bg-gray-900 text-gray-200 text-center py-4 relative">
      <p>&copy; 2024 ToDo App. {{ currentLanguage === "ru" ? "Все права защищены." : "All rights reserved." }}</p>
    </footer>

    <!-- Кнопка переключения темы -->
    <div class="fixed bottom-16 right-4 sm:bottom-4">
      <button
        @click="toggleTheme"
        class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform hover:scale-105"
      >
        {{ isDarkMode ? "🌙 Темная" : "☀️ Светлая" }}
      </button>
      <!-- Кнопка изменения языка -->
      <button
        @click="toggleLanguage"
        class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform hover:scale-105"
      >
        {{ currentLanguage === "ru" ? "Switch to English" : "Переключиться на русский" }}
      </button>
    </div>
  </div>
</template>

<script setup>
// Импортируем зависимости
import { ref } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);
const { $supabase } = useNuxtApp();
const router = useRouter();
const isDarkMode = ref(false);
const currentLanguage = ref("ru"); // Язык по умолчанию

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

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("theme", theme);
};
// Функция переключения языка
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === "ru" ? "en" : "ru";
};

fetchUser();
</script>
