<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4 sm:px-10"
  >
    <p v-if="userEmail">Вы вошли как: {{ userEmail }}</p>
    <h1 class="text-2xl font-bold mb-4">Список задач</h1>

    <!-- Кнопка для переключения темы -->
    <button
      @click="toggleTheme"
      class="mb-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform hover:scale-105"
    >
      {{ isDarkMode ? "🌙 Темная" : "☀️ Светлая" }}
    </button>

    <!-- Создаем фильтр для задач -->
    <div class="flex flex-wrap gap-2 sm:gap-4 mb-4 justify-center">
      <!-- Кнопка фильтра "Все" -->
      <button
        @click="filter = 'all'"
        :class="[
          'px-4 py-2 rounded-lg shadow transition-transform hover:scale-105',
          filter === 'all'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        ]"
      >
        Все
      </button>

      <!-- Кнопка фильтра "Выполненные" -->
      <button
        @click="filter = 'completed'"
        :class="[
          'px-4 py-2 rounded-lg shadow transition-transform hover:scale-105',
          filter === 'completed'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        ]"
      >
        Выполненные
      </button>

      <!-- Кнопка фильтра "Невыполненные" -->
      <button
        @click="filter = 'active'"
        :class="[
          'px-4 py-2 rounded-lg shadow transition-transform hover:scale-105',
          filter === 'active'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        ]"
      >
        Невыполненные
      </button>

      <!-- Сортировка по дате -->
      <select
        v-model="sortOrder"
        class="px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-transform hover:scale-105"
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
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
      <!-- Кнопка для добавления задачи -->
      <button
        @click="addTask"
        class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md w-full sm:w-auto hover:shadow-lg hover:scale-105 transition-transform"
      >
        Добавить
      </button>
    </div>

    <!-- Список задач -->
    <transition-group name="fade" tag="ul" class="w-full max-w-md">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm flex-col sm:flex-row hover:shadow-md mb-2 gap-2 sm:gap-4 flex justify-between items-center"
      >
        <!-- Метка категории -->
        <span
          class="text-sm px-2 py-1 rounded-full"
          :class="task.categoryColor"
        >
          {{ task.category }}
        </span>

        <!-- Кастомный чекбокс -->
        <div class="flex flex-wrap gap-2 items-center w-full">
          <div class="relative">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="toggleTaskCompletion(task)"
              class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div
              class="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center transition-all duration-300"
              :class="{
                'bg-green-500 border-green-500': task.completed,
                'bg-white dark:bg-gray-800': !task.completed,
              }"
            >
              <svg
                v-if="task.completed"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="white"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <!-- Режим редактирования -->
          <div v-if="task.editing" class="flex-grow">
            <input
              v-model="task.text"
              type="text"
              class="border w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            <div class="flex justify-end mt-2">
              <!-- Кнопка сохранения -->
              <button
                @click="saveTask(task)"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Сохранить
              </button>

              <!-- Кнопка отмены -->
              <button
                @click="cancelEdit(task)"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 ml-2"
              >
                Отмена
              </button>
            </div>
          </div>

          <!-- Режим просмотра -->
          <div v-else class="flex-grow">
            <span
              :class="{
                'line-through text-gray-500 dark:text-gray-400': task.completed,
                'text-gray-800 dark:text-gray-200': !task.completed,
              }"
            >
              {{ task.text }}
            </span>
            <!-- Отображение даты создания задачи -->
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Создано: {{ formatDate(task.createdAt) }}
            </p>
          </div>
        </div>
        <!-- Кнопки -->
        <div>
          <!-- Кнопка редактирования -->
          <button
            @click="editTask(task)"
            v-if="!task.editing"
            class="text-blue-500 hover:underline"
          >
            Редактировать
          </button>

          <!-- Кнопка удаления -->
          <button
            @click="confirmDelete(task)"
            class="text-red-500 hover:underline ml-2"
          >
            Удалить
          </button>
        </div>
      </li>
    </transition-group>
    <!-- Модальное окно для подтверждения удаления -->
    <Modal
      :show="isModalVisible"
      message="Вы уверены, что хотите удалить эту задачу?"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
    />
    <!-- Кнопка назад -->
    <button
      @click="goBack"
      class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 mb-4"
    >
      Назад
    </button>

    <!-- Модальное окно для уведомлений -->
    <Notification ref="notification" />
  </div>
</template>

<script setup>
// Импортируем зависимости
import { onMounted, ref, computed } from "vue";
import Modal from "~/components/Modal.vue";
import Notification from "~/components/Notification.vue";
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
  task.editing = true;
};
const cancelEdit = (task) => {
  task.editing = false;
};
const saveTask = async (task) => {
  task.editing = false;
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
  // Фильтрация по выполненным/невыполненным задачам
  if (filter.value === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filter.value === "active") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // Копия массива для сортировки
  const sortedTasks = [...filteredTasks];

  // Сортировка по дате
  sortedTasks.sort((a, b) =>
    sortOrder.value === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  return sortedTasks;
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
// Дата создания задачи
const formatDate = (date) => {
  const utcDate = new Date(date); // Преобразуем в объект Date
  const moscowOffset = 3 * 60 * 60 * 1000; // Московский UTC+3 в миллисекундах
  const moscowDate = new Date(utcDate.getTime() + moscowOffset); // Добавляем разницу
  return moscowDate.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
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
</style>
