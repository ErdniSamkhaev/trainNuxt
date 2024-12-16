<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4 sm:px-10"
  >
    <p v-if="userEmail">Вы вошли как: {{ userEmail }}</p>
    <h1 class="text-2xl font-bold mb-4 holiday-title">Список задач</h1>

    <!-- Кнопка для переключения темы -->
    <button
      @click="toggleTheme"
      class="mb-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform hover:scale-105"
    >
      {{ isDarkMode ? "🌙 Темная" : "☀️ Светлая" }}
    </button>

    <!-- Создаем фильтр для задач -->
    <div class="flex flex-wrap gap-2 sm:gap-4 mb-4 justify-center">
      <!-- Фильтр "Все" -->
      <FilterButton
        :isActive="filter === 'all'"
        :onClick="() => (filter = 'all')"
      >
        Все
      </FilterButton>

      <!-- Фильтр "Выполненные" -->
      <FilterButton
        :isActive="filter === 'completed'"
        :onClick="() => (filter = 'completed')"
      >
        Выполненные
      </FilterButton>

      <!-- Фильтр "Невыполненные" -->
      <FilterButton
        :isActive="filter === 'active'"
        :onClick="() => (filter = 'active')"
      >
        Невыполненные
      </FilterButton>

      <!-- Сортировка по дате -->
      <select
        v-model="sortOrder"
        class="px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-transform hover:scale-105"
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
      </select>
      <!-- Фильтр по категориям -->
      <select
        v-model="selectedCategory"
        class="px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-transform hover:scale-105"
      >
        <option value="">Все категории</option>
        <option
          v-for="category in uniqueCategories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Добавляем новую задачу -->
    <div class="flex flex-wrap gap-2 sm:gap-4 mb-4 justify-center">
      <select
        v-model="newTaskCategory"
        class="border p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full"
      >
        <option value="" disabled selected>Выберите категорию</option>
        <option value="Дом">Дом</option>
        <option value="Работа">Работа</option>
        <option value="Хобби">Хобби</option>
        <option value="Другое">Другое</option>
      </select>

      <!-- Поле ввода для новой категории -->
      <input
        v-if="newTaskCategory === 'Другое'"
        v-model="customCategory"
        type="text"
        placeholder="Введите свою категорию"
        class="border p-2 rounded-lg w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      />
      <!-- Поле ввода для новой задачи -->
      <input
        v-model="newTask"
        type="text"
        placeholder="Введите новую задачу"
        class="border p-2 rounded-lg w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      />
      <!-- Кнопки для добавления задачи и возврата -->
      <div class="flex gap-4 mt-4 justify-center">
        <!-- Кнопка "Добавить" -->
        <button
          @click="addTask"
          class="relative px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg overflow-hidden group transition-transform hover:scale-105 shadow-lg"
        >
          <span
            class="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></span>
          <span class="relative z-10 group-hover:text-white">Добавить</span>
        </button>

        <!-- Кнопка "Назад" -->
        <button
          @click="goBack"
          class="relative px-6 py-3 border-2 border-gray-500 text-gray-500 rounded-lg overflow-hidden group transition-transform hover:scale-105 shadow-lg"
        >
          <span
            class="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></span>
          <span class="relative z-10 group-hover:text-white">Назад</span>
        </button>
      </div>
    </div>

    <!-- Список задач -->
    <transition-group name="fade" tag="ul" class="w-full max-w-md space-y-4">
      <Task
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :onToggle="() => toggleTaskCompletion(task)"
        :onEdit="() => editTask(task)"
        :onSave="() => saveTask(task)"
        :onCancel="() => cancelEdit(task)"
        :onDelete="() => confirmDelete(task)"
      />
    </transition-group>

    <!-- Модальное окно для подтверждения удаления -->
    <Modal
      :show="isModalVisible"
      message="Вы уверены, что хотите удалить эту задачу?"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
    />

    <!-- Модальное окно для уведомлений -->
    <Notification ref="notification" />
  </div>
</template>

<script setup>
// Импортируем зависимости
import { onMounted, ref, computed } from "vue";
import Modal from "~/components/Modal.vue";
import Notification from "~/components/Notification.vue";
import FilterButton from "~/components/FilterButton.vue";
import Task from "~/components/Task.vue";

// Создаем переменные
const newTask = ref("");
const notification = ref(null);
const tasks = ref([]);
const filter = ref("all");
const isModalVisible = ref(false);
const taskToDelete = ref(null);
const isDarkMode = ref(false);
const sortOrder = ref("newest");
const { $supabase } = useNuxtApp();
const userEmail = ref("");
const router = useRouter();
const newTaskCategory = ref("");
const customCategory = ref("");
const selectedCategory = ref("");
const uniqueCategories = computed(() => {
  const categories = tasks.value.map((task) => task.category);
  return Array.from(new Set(categories)); // Уникальные категории
});

const categoryColors = [
  "bg-red-500 text-white",
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-yellow-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
];
// Функции для редактирования задач
const editTask = (task) => {
  // Восстанавливаем оригинальный текст при отмене
  task.originalText = task.text;
  task.editing = true
};
// Функции для отмены редактирования
const cancelEdit = (task) => {
  // Восстанавливаем оригинальный текст задачи при отмене
  if (task.originalText !== undefined) {
    task.text = task.originalText;
  }
  task.editing = false;
  delete task.originalText; // Удаляем временное поле
};
// Функции для сохранения задач
const saveTask = async (task) => {
  task.editing = false;
  delete task.originalText; // Удаляем временное поле после сохранения
  try {
    const { error } = await $supabase
      .from("tasks")
      .update({ title: task.text })
      .eq("id", task.id);
    if (error) throw error;

    notification.value.show("Задача успешно сохранена!", "success");
  } catch (error) {
    console.error("Ошибка сохранения задачи:", error);
    notification.value.show("Ошибка: задача не сохранена.", "error");
  }
};
// Защита роутов
definePageMeta({
  middleware: "auth",
});
// Сохранение темы в localStorage
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("theme", theme);
};
// Функция для переключения состояния задачи
const toggleTaskCompletion = async (task) => {
  task.completed = !task.completed; // Локально меняем состояние
  try {
    const { error } = await $supabase
      .from("tasks")
      .update({ completed: task.completed })
      .eq("id", task.id);

    if (error) {
      console.error("Ошибка обновления задачи:", error);
      notification.value.show("Ошибка: не удалось обновить задачу.", "error");
      task.completed = !task.completed; // Если ошибка, возвращаем предыдущее состояние
    }
  } catch (error) {
    console.error("Ошибка обновления задачи:", error);
    notification.value.show("Ошибка: Что-то пошло не так.", "error");
    task.completed = !task.completed; // Возвращаем состояние при ошибке
  }
};
// Загрузка темы, загрузка задач
onMounted(async () => {
  // Тема из localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove("dark");
  }

  try {
    const { data: session } = await $supabase.auth.getSession();
    if (!session?.session) {
      return navigateTo("/login");
    }
    userEmail.value = session.session.user.email;

    const { data, error } = await $supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    tasks.value = data.map((task) => ({
      text: task.title,
      category: task.category, // Категория
      categoryColor: task.categoryColor, // Цвет категории
      completed: task.completed,
      createdAt: task.created_at,
      id: task.id,
    }));
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
  }
});
// Функиця addTask для добавления задач
const addTask = async () => {
  const category =
    newTaskCategory.value === "Другое" && customCategory.value.trim()
      ? customCategory.value.trim()
      : newTaskCategory.value;

  if (!newTask.value.trim() || !category) {
    notification.value.show("Введите задачу и выберите категорию!", "error");
    return;
  }

  const color = getRandomColor(); // Генерация случайного цвета

  try {
    const { data: user } = await $supabase.auth.getUser();
    if (!user?.user?.id) throw new Error("Пользователь не авторизован.");

    const { data, error } = await $supabase
      .from("tasks")
      .insert([
        {
          title: newTask.value.trim(),
          category,
          categoryColor: color,
          completed: false,
          user_id: user.user.id,
        },
      ])
      .select();

    if (error) throw error;

    tasks.value.push({
      text: data[0].title,
      category: data[0].category,
      completed: data[0].completed,
      categoryColor: data[0].categoryColor,
      createdAt: data[0].created_at,
      id: data[0].id,
    });
    // Очистка полей
    newTask.value = "";
    newTaskCategory.value = "";
    customCategory.value = "";
    notification.value.show("Задача успешно добавлена!", "success");
  } catch (error) {
    notification.value.show("Ошибка: задача не добавлена.", "error");
  }
};
// Функция для фильтрации задач
const filteredTasks = computed(() => {
  let filteredTasks = tasks.value;

  // Фильтрация по категории
  if (selectedCategory.value) {
    filteredTasks = filteredTasks.filter(
      (task) => task.category === selectedCategory.value
    );
  }

  // Фильтрация по выполненным/невыполненным задачам
  if (filter.value === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filter.value === "active") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // Сортировка по дате
  filteredTasks = filteredTasks
    .slice()
    .sort((a, b) =>
      sortOrder.value === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return filteredTasks;
});
// Метод для подтверждения удаления
const confirmDelete = (task) => {
  taskToDelete.value = task;
  isModalVisible.value = true;
};
// Метод для подтверждения удаления
const handleConfirmDelete = async () => {
  if (taskToDelete.value) {
    try {
      const { error } = await $supabase
        .from("tasks")
        .delete()
        .eq("id", taskToDelete.value.id);
      if (error) throw error;

      tasks.value = tasks.value.filter(
        (task) => task.id !== taskToDelete.value.id
      );
      notification.value.show("Задача успешно удалена!", "error");
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
      notification.value.show("Ошибка: задача не удалена.", "error");
    }
  }
  isModalVisible.value = false;
  taskToDelete.value = null;
};
// Метод для отмены удаления
const handleCancelDelete = () => {
  isModalVisible.value = false;
  taskToDelete.value = null;
};
// Функция "Назад"
const goBack = () => {
  router.go(-1);
};
// Функция для рандомного цвета задачи
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * categoryColors.length);
  return categoryColors[randomIndex];
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-500 ease-in-out;
}
.fade-enter-from {
  @apply opacity-0 scale-90;
}
.fade-leave-to {
  @apply opacity-0 scale-90;
}
ul {
  max-width: 45%; /* Ширина для больших экранов */
  word-wrap: break-word;
}

@media (max-width: 768px) {
  /* Для экранов с шириной менее 768px */
  ul {
    max-width: 100%; /* Ширина для мобильных устройств */
  }
}
select {
  @apply px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-transform hover:scale-105;
}

.FilterButton {
  @apply px-4 py-2 rounded-lg shadow text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform hover:scale-105;
}

.holiday-title {
  position: relative;
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  background: linear-gradient(90deg, #ffcc00, #ff6600, #ffcc00);
  background-size: 400% 400%;
  animation: glow 6s infinite;
  border-radius: 10px;
}

.holiday-title::before {
  content: "✨🎄✨"; /* Текст огоньков */
  position: absolute;
  top: -2rem; /* Размещаем огоньки над заголовком */
  left: 50%; /* Центрируем относительно заголовка */
  transform: translateX(-50%); /* Центровка по горизонтали */
  font-size: 1.5em; /* Увеличиваем размер */
  color: #ffcc00; /* Цвет огоньков */
  animation: blink 2s infinite; /* Анимация мерцания */
  white-space: nowrap; /* Огоньки будут в одну строку */
}

@keyframes glow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes blink {
  50% {
    opacity: 0.5; /* Полупрозрачность в середине анимации */
  }
}
</style>
