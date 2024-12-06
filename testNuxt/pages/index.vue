<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-between items-center"
  >
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
        <!-- Кнопка "Войти" -->
        <nuxt-link
          to="/login"
          class="relative px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg overflow-hidden group transition-transform hover:scale-105 shadow-lg"
        >
          <span
            class="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></span>
          <span class="relative z-10 group-hover:text-white">
            {{ currentLanguage === "ru" ? "Войти" : "Login" }}
          </span>
        </nuxt-link>

        <!-- Кнопка "Зарегистрироваться" -->
        <nuxt-link
          to="/register"
          class="relative mt-4 px-6 py-3 border-2 border-green-500 text-green-500 rounded-lg overflow-hidden group transition-transform hover:scale-105 shadow-lg"
        >
          <span
            class="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></span>
          <span class="relative z-10 group-hover:text-white">
            {{ currentLanguage === "ru" ? "Зарегистрироваться" : "Register" }}
          </span>
        </nuxt-link>
      </template>
    </div>

    <!-- О приложении -->
    <div class="bg-gray-200 dark:bg-gray-800 w-full py-8 px-4 text-center">
      <h2 class="text-2xl font-bold mb-6">
        {{
          currentLanguage === "ru"
            ? "Что вы можете делать?"
            : "What can you do?"
        }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="feature-card p-6 rounded-lg bg-white dark:bg-gray-700 shadow-lg transform transition-transform hover:scale-105"
        >
          <div class="icon text-blue-500 mb-4 text-4xl">
            <i class="fas fa-tasks"></i>
          </div>
          <h3 class="text-lg font-bold">
            {{
              currentLanguage === "ru"
                ? "Создавайте и управляйте задачами"
                : "Create and manage tasks"
            }}
          </h3>
          <p class="text-sm">
            {{
              currentLanguage === "ru"
                ? "Легко добавляйте задачи и управляйте своим расписанием."
                : "Easily add tasks and manage your schedule."
            }}
          </p>
        </div>
        <div
          class="feature-card p-6 rounded-lg bg-white dark:bg-gray-700 shadow-lg transform transition-transform hover:scale-105"
        >
          <div class="icon text-green-500 mb-4 text-4xl">
            <i class="fas fa-filter"></i>
          </div>
          <h3 class="text-lg font-bold">
            {{
              currentLanguage === "ru"
                ? "Фильтруйте и сортируйте"
                : "Filter and sort"
            }}
          </h3>
          <p class="text-sm">
            {{
              currentLanguage === "ru"
                ? "Сортируйте задачи по дате, приоритету или статусу."
                : "Sort tasks by date, priority, or status."
            }}
          </p>
        </div>
        <div
          class="feature-card p-6 rounded-lg bg-white dark:bg-gray-700 shadow-lg transform transition-transform hover:scale-105"
        >
          <div class="icon text-yellow-500 mb-4 text-4xl">
            <i class="fas fa-adjust"></i>
          </div>
          <h3 class="text-lg font-bold">
            {{
              currentLanguage === "ru"
                ? "Переключайтесь между темами"
                : "Switch themes"
            }}
          </h3>
          <p class="text-sm">
            {{
              currentLanguage === "ru"
                ? "Выбирайте светлую или тёмную тему на ваш вкус."
                : "Choose between light and dark themes."
            }}
          </p>
        </div>
        <div
          class="feature-card p-6 rounded-lg bg-white dark:bg-gray-700 shadow-lg transform transition-transform hover:scale-105"
        >
          <div class="icon text-red-500 mb-4 text-4xl">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>
          <h3 class="text-lg font-bold">
            {{ currentLanguage === "ru" ? "Сохраняйте задачи" : "Save tasks" }}
          </h3>
          <p class="text-sm">
            {{
              currentLanguage === "ru"
                ? "Данные автоматически сохраняются в Supabase."
                : "Data is automatically saved in Supabase."
            }}
          </p>
        </div>
        <div
          class="feature-card p-6 rounded-lg bg-white dark:bg-gray-700 shadow-lg transform transition-transform hover:scale-105"
        >
          <div class="icon text-purple-500 mb-4 text-4xl">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3 class="text-lg font-bold">
            {{
              currentLanguage === "ru"
                ? "Добавляйте приложение как PWA"
                : "Add as PWA"
            }}
          </h3>
          <p class="text-sm">
            {{
              currentLanguage === "ru"
                ? "Устанавливайте приложение на главный экран устройства."
                : "Install the app on your device's home screen."
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Елка -->
    <div class="tree-container">
      <svg
        viewBox="0 0 200 350"
        xmlns="http://www.w3.org/2000/svg"
        class="tree"
      >
        <!-- Ствол -->
        <rect x="90" y="300" width="20" height="50" fill="#8B4513" />

        <!-- Ветки -->
        <polygon
          v-for="(layer, index) in branches"
          :key="index"
          :points="layer.points"
          :fill="layer.color"
        />

        <!-- Украшения -->
        <circle
          v-for="(ornament, index) in ornaments"
          :key="index"
          :cx="ornament.x"
          :cy="ornament.y"
          :r="ornament.size"
          :fill="ornament.color"
          class="ornament"
          :style="{ animationDelay: ornament.delay + 's' }"
        />

        <!-- Звезда -->
        <polygon
          points="100,20 110,50 140,50 115,70 125,100 100,80 75,100 85,70 60,50 90,50"
          fill="gold"
        />
      </svg>
    </div>
    <div class="countdown-timer text-center mt-8">
      <h2 class="text-2xl font-bold">
        {{
          currentLanguage === "ru"
            ? "До Нового года осталось:"
            : "Time left until New Year:"
        }}
      </h2>
      <div class="flex justify-center space-x-4 mt-4">
        <div class="countdown-unit">
          <span class="text-4xl font-bold">{{ countdown.days }}</span>
          <p>{{ currentLanguage === "ru" ? "Дней" : "Days" }}</p>
        </div>
        <div class="countdown-unit">
          <span class="text-4xl font-bold">{{ countdown.hours }}</span>
          <p>{{ currentLanguage === "ru" ? "Часов" : "Hours" }}</p>
        </div>
        <div class="countdown-unit">
          <span class="text-4xl font-bold">{{ countdown.minutes }}</span>
          <p>{{ currentLanguage === "ru" ? "Минут" : "Minutes" }}</p>
        </div>
        <div class="countdown-unit">
          <span class="text-4xl font-bold">{{ countdown.seconds }}</span>
          <p>{{ currentLanguage === "ru" ? "Секунд" : "Seconds" }}</p>
        </div>
      </div>
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
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const calculateCountdown = () => {
  const now = new Date();
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const difference = nextYear - now;

  countdown.value.days = Math.floor(difference / (1000 * 60 * 60 * 24));
  countdown.value.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  countdown.value.minutes = Math.floor((difference / (1000 * 60)) % 60);
  countdown.value.seconds = Math.floor((difference / 1000) % 60);
};

onMounted(() => {
  calculateCountdown();
  setInterval(calculateCountdown, 1000);
});

const branches = ref([
  { points: "20,280 180,280 100,200", color: "#006400" }, // Нижняя самая широкая ветка
  { points: "30,240 170,240 100,160", color: "#228B22" }, // Вторая по ширине
  { points: "40,200 160,200 100,120", color: "#2E8B57" }, // Третья
  { points: "50,160 150,160 100,80", color: "#006400" }, // Верхняя самая узкая ветка
]);

const ornaments = ref(
  Array.from({ length: 30 }).map(() => ({
    x: Math.random() * 120 + 40, // Украшения располагаются внутри дерева
    y: Math.random() * 200 + 100,
    size: Math.random() * 3 + 3,
    color: ["red", "blue", "gold", "silver"][Math.floor(Math.random() * 4)],
    delay: Math.random() * 2, // Случайная задержка анимации
  }))
);
// Снежинки
const snowflakes = ref(
  Array.from({ length: 50 }).map(() => ({
    left: Math.random() * 100, // Позиция снежинки
    animationDuration: 5 + Math.random() * 5, // Скорость: 5–10 секунд
    animationDelay: Math.random() * -5, // Отрицательная задержка: уже началась анимация
  }))
);
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

<style>
/* Стили для анимации снежинок */
@keyframes snow {
  0% {
    transform: translateY(-10%);
    opacity: 0; /* Снежинка появляется постепенно */
  }
  50% {
    transform: translate(10px, 50vh); /* Движение слегка влево */
  }
  80% {
    opacity: 1; /* Снежинка полностью видна большую часть времени */
  }
  100% {
    transform: translateY(110vh); /* Снежинка уходит за пределы экрана */
    opacity: 0; /* Постепенное исчезновение */
  }
}

.snowflake {
  position: fixed;
  top: -10px;
  font-size: 1.2em;
  z-index: 1000;
  pointer-events: none;
  animation: snow var(--speed, 5s) linear infinite;
  animation-delay: var(--delay, 0s);
}

.snow-container .snowflake {
  left: var(--left); /* Оставляем значение, но оно фиксировано */
}

/* Стили для ёлки */
.tree-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  position: relative;
}

.tree {
  width: 250px; /* Увеличение ширины ёлки */
  height: 350px; /* Увеличение высоты ёлки */
}

.ornament {
  transition: transform 0.3s ease-in-out;
  animation: blink 2s infinite ease-in-out;
}

.ornament:hover {
  transform: scale(1.3);
}

/* Анимация мигания */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
/* Стили для таймера */
.countdown-timer {
  color: #ff4500; /* Красивый яркий цвет для таймера */
}

.countdown-unit {
  text-align: center;
  width: 80px;
}

.countdown-unit span {
  display: block;
}
/* О приложении */
.feature-card {
  transition: all 0.3s ease-in-out;
  background: linear-gradient(145deg, #ffffff, #f8f8f8); /* Убрали насыщенность */
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9);
  border-radius: 8px; /* Добавили легкое скругление */
  text-align: left; /* Выравнивание текста */
}

.feature-card h3 {
  font-size: 1.2rem; /* Увеличили размер заголовка */
  color: #333; /* Четкий темный цвет */
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 0.9rem; /* Читаемый размер для текста */
  color: #666; /* Четкий цвет для описания */
}

.feature-card:hover {
  transform: translateY(-5px); /* Эффект небольшого подъема */
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9);
  background: linear-gradient(145deg, #f9f9f9, #ffffff); /* Подсветка на hover */
}

.icon {
  font-size: 3rem; /* Увеличили размер иконки */
  margin-bottom: 12px;
}

.icon i {
  color: inherit; /* Используем цвет родительского элемента */
}


</style>
