<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-between items-center"
  >
    <!-- Основная секция -->
    <div class="flex flex-col items-center text-center p-6 gap-6">
      <h1 class="text-4xl font-bold">Добро пожаловать в ToDo App</h1>
      <p class="text-lg">
        Простое, но функциональное приложение для управления задачами. Начните
        прямо сейчас!
      </p>

      <!-- Кнопки навигации -->
      <template v-if="user">
        <p class="text-lg">Вы вошли как: <strong>{{ user.email }}</strong></p>
        <button
          @click="goToTasks"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform hover:scale-105"
        >
          Перейти к списку задач
        </button>
        <button
          @click="logout"
          class="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform hover:scale-105"
        >
          Выйти
        </button>
      </template>
      <template v-else>
        <nuxt-link
          to="/login"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform hover:scale-105"
        >
          Войти
        </nuxt-link>
        <nuxt-link
          to="/register"
          class="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform hover:scale-105"
        >
          Зарегистрироваться
        </nuxt-link>
      </template>
    </div>

    <!-- О приложении -->
    <div class="bg-gray-200 dark:bg-gray-800 w-full py-8 px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">Что вы можете делать?</h2>
      <ul class="list-disc list-inside text-lg">
        <li>Создавайте и управляйте задачами</li>
        <li>Фильтруйте и сортируйте по дате и статусу</li>
        <li>Переключайтесь между темной и светлой темой</li>
        <li>Сохраняйте задачи с использованием Supabase</li>
        <li>Добавляйте приложение на главный экран как PWA</li>
      </ul>
    </div>

    <!-- Footer -->
    <footer class="w-full bg-gray-900 text-gray-200 text-center py-4 relative">
      <p>&copy; 2024 ToDo App. Все права защищены.</p>
    </footer>

    <!-- Кнопка переключения темы -->
    <div class="fixed bottom-16 right-4 sm:bottom-4">
      <button
        @click="toggleTheme"
        class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform hover:scale-105"
      >
        {{ isDarkMode ? "🌙 Темная" : "☀️ Светлая" }}
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

fetchUser();
</script>
