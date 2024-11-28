<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4"
  >
    <p v-if="userEmail">Вы вошли как: {{ userEmail }}</p>
    <h1 class="text-2xl font-bold mb-4">Список задач</h1>
    <button
      @click="toggleTheme"
      class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      {{ isDarkMode ? "🌙 Темная" : "☀️ Светлая" }}
    </button>
    <!-- Создаем фильтр -->
    <div class="flex gap-4 mb-4">
      <button @click="filter = 'all'" class="hover:underline">Все</button>
      <button @click="filter = 'completed'" class="hover:underline">
        Выполненные
      </button>
      <button @click="filter = 'active'" class="hover:underline">
        Невыполненные
      </button>
      <select
        v-model="sortOrder"
        class="border p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
      </select>
    </div>
    <!-- Добавляем новую задачу -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="newTask"
        type="text"
        placeholder="Введите новую задачу"
        class="border p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      />
      <button
        @click="addTask"
        class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
      >
        Добавить
      </button>
    </div>
    <!-- Список задач -->
    <transition-group name="fade" tag="ul" class="w-full max-w-md">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm dark:shadow-sm hover:shadow-md hover:dark:shadow-[0_4px_6px_rgba(255,255,255,0.2)] mb-2 transition-shadow flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="task.completed"
            @change="updateTask(task)"
            class="cursor-pointer"
          />
          <span
            :class="{
              'line-through text-gray-500 dark:text-gray-400': task.completed,
              'text-gray-800': !task.completed,
              'dark:text-gray-400': task.completed && isDarkMode,
              'dark:text-gray-200': !task.completed && isDarkMode,
            }"
          >
            {{ task.text }}
          </span>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ new Date(task.createdAt).toLocaleString() }}
        </div>
        <button
          @click="confirmDelete(task)"
          class="text-red-500 hover:underline"
        >
          Удалить
        </button>
      </li>
    </transition-group>
    <Modal
      :show="isModalVisible"
      message="Вы уверены, что хотите удалить эту задачу?"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
    <button
      @click="goBack"
      class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 mb-4"
    >
      Назад
    </button>
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
// Функция для обновления задачи
const updateTask = async (task) => {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: task.completed })
      .eq("id", task.id);

    if (error) {
      console.error("Ошибка обновления задачи:", error);
      notification.value.show("Ошибка: не удалось обновить задачу.", "error");
      return;
    }
  } catch (error) {
    console.error("Ошибка обновления задачи:", error);
    notification.value.show("Ошибка: Что-то пошло не так.", "error");
  }
};

// Загрузка
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
      .order("created_at", { ascending: false });

    if (error) throw error;

    tasks.value = data.map((task) => ({
      text: task.title,
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
  if (newTask.value.trim()) {
    try {
      const { data: user } = await $supabase.auth.getUser();
      const { data, error } = await $supabase
        .from("tasks")
        .insert([
          { title: newTask.value.trim(), completed: false, user_id: user.id },
        ])
        .select();

      if (error) throw error;

      tasks.value.push({
        text: data[0].title,
        completed: data[0].completed,
        createdAt: data[0].created_at,
        id: data[0].id,
      });
      newTask.value = "";
      notification.value.show("Задача успешно добавлена!", "success");
    } catch (error) {
      notification.value.show("Ошибка: задача не добавлена.", "error");
    }
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
