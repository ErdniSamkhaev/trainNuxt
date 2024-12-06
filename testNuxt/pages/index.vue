<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-between items-center"
  >
    <!-- Верхняя панель с кнопками -->
    <div class="w-full flex justify-end items-center p-4 space-x-4">
      <!-- Кнопка переключения языка -->
      <button
        @click="toggleLanguage"
        class="relative px-4 py-2 border-2 border-purple-500 text-purple-500 rounded-full overflow-hidden group transition-transform hover:scale-105"
      >
        <span
          class="absolute inset-0 bg-purple-500 group-hover:translate-y-0 translate-y-full transition-transform duration-300"
        ></span>
        <span class="relative z-10 group-hover:text-white">
          {{ currentLanguage === "ru" ? "EN" : "RU" }}
        </span>
      </button>

      <!-- Кнопка переключения темы -->
      <button
        @click="toggleTheme"
        class="relative px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-full overflow-hidden group transition-transform hover:scale-105"
      >
        <span
          class="absolute inset-0 bg-blue-500 group-hover:translate-y-0 translate-y-full transition-transform duration-300"
        ></span>
        <span class="relative z-10 group-hover:text-white">
          {{ isDarkMode ? "🌙" : "☀️" }}
        </span>
      </button>
    </div>

    <!-- Основная секция -->
    <div class="flex flex-col items-center text-center p-6 gap-6">
      <h1 class="text-4xl font-bold">
        {{
          currentLanguage === "ru"
            ? "Добро пожаловать в ToDo App"
            : "Welcome to ToDo App"
        }}
      </h1>
      <p class="text-lg">
        {{
          currentLanguage === "ru"
            ? "Простое, но функциональное приложение для управления задачами. Начните прямо сейчас!"
            : "A simple yet functional task management app. Get started now!"
        }}
      </p>

      <!-- Кнопки навигации -->
      <template v-if="user">
        <p class="text-lg">
          {{
            currentLanguage === "ru" ? "Вы вошли как:" : "You are logged in as:"
          }}
          <strong>{{ user.email }}</strong>
        </p>
        <div class="p-10">
          <div class="flex flex-col items-center gap-4">
            <!-- Кнопка "Перейти к списку задач" -->
            <button
              @click="goToTasks"
              class="relative px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg overflow-hidden group transition-transform hover:scale-105 shadow-lg"
            >
              <span
                class="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></span>
              <span class="relative z-10 group-hover:text-white">
                {{
                  currentLanguage === "ru"
                    ? "Перейти к списку задач"
                    : "Go to Task List"
                }}
              </span>
            </button>

            <!-- Кнопка "Выйти" -->
            <button
              @click="logout"
              class="relative px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg overflow-hidden group transition-transform hover:scale-105 shadow-lg"
            >
              <span
                class="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></span>
              <span class="relative z-10 group-hover:text-white">
                {{ currentLanguage === "ru" ? "Выйти" : "Logout" }}
              </span>
            </button>
          </div>
        </div>
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
      <h2 class="text-2xl font-bold mb-4">
        {{
          currentLanguage === "ru"
            ? "Что вы можете делать?"
            : "What can you do?"
        }}
      </h2>
      <ul class="list-disc list-inside text-lg">
        <li>
          {{
            currentLanguage === "ru"
              ? "Создавайте и управляйте задачами"
              : "Create and manage tasks"
          }}
        </li>
        <li>
          {{
            currentLanguage === "ru"
              ? "Фильтруйте и сортируйте по дате и статусу"
              : "Filter and sort by date and status"
          }}
        </li>
        <li>
          {{
            currentLanguage === "ru"
              ? "Переключайтесь между темной и светлой темой"
              : "Switch between dark and light themes"
          }}
        </li>
        <li>
          {{
            currentLanguage === "ru"
              ? "Сохраняйте задачи с использованием Supabase"
              : "Save tasks using Supabase"
          }}
        </li>
        <li>
          {{
            currentLanguage === "ru"
              ? "Добавляйте приложение на главный экран как PWA"
              : "Add the app to your home screen as a PWA"
          }}
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <footer class="w-full bg-gray-900 text-gray-200 text-center py-4">
      <p>
        &copy; 2024 ToDo App.
        {{
          currentLanguage === "ru"
            ? "Все права защищены."
            : "All rights reserved."
        }}
      </p>
    </footer>
  </div>
</template>

<script setup>
// Импортируем зависимости
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);
const { $supabase } = useNuxtApp();
const router = useRouter();
const isDarkMode = ref(false);
const currentLanguage = ref("ru"); // Язык по умолчанию

// Функция для загрузки сохраненных настроек из localStorage
const loadSettings = () => {
  // Загружаем язык
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    currentLanguage.value = savedLanguage;
  }

  // Загружаем тему
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove("dark");
  }
};

// Сохраняем пользователя
const fetchUser = async () => {
  const { data } = await $supabase.auth.getUser();
  user.value = data.user;
};

const logout = async () => {
  await $supabase.auth.signOut();
  user.value = null;
  alert(
    currentLanguage.value === "ru" ? "Вы вышли из системы!" : "Logged out!"
  );
};

const goToTasks = () => {
  router.push("/todo");
};

// Функция переключения темы
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("theme", theme); // Сохраняем тему
};

// Функция переключения языка
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === "ru" ? "en" : "ru";
  localStorage.setItem("language", currentLanguage.value); // Сохраняем язык
};

// Загружаем настройки при монтировании компонента
onMounted(() => {
  loadSettings();
  fetchUser();
});
</script>
