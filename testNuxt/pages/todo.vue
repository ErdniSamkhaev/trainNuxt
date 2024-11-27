<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4"
  >
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
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Добавить
      </button>
    </div>
    <!-- Список задач -->
    <transition-group name="fade" tag="ul" class="w-full max-w-md">
      <li
        v-for="(task, index) in filteredTasks"
        :key="task.text"
        class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md mb-2 flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="task.completed"
            class="cursor-pointer"
          />
          <span
            :class="{
              'line-through text-gray-500 dark:text-gray-400': task.completed,
              'text-gray-800 dark:text-gray-200': !task.completed,
            }"
          >
            {{ task.text }}
          </span>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ new Date(task.createdAt).toLocaleString() }}
        </div>

        <button
          @click="confirmDelete(index)"
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
  </div>
</template>

<script setup>
// Импортируем зависимости
import { onMounted, ref, computed, watch } from "vue";
import Modal from "~/components/Modal.vue";
// Создаем переменные
const newTask = ref("");
const tasks = ref([]);
const filter = ref("all");
const isModalVisible = ref(false);
const taskToDelete = ref(null);
const isDarkMode = ref(false);
const sortOrder = ref("newest");

// Функкция для сохранения задач в localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};
// Сохранение темы в localStorage
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("theme", theme);
};
// Загрузка задач и темы из localStorage при загрузке страницы
onMounted(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});
// Сохраняем статусы задач
watch(tasks, saveTasks, { deep: true });
// Функиця addTask для добавления задач
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: newTask.value.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    });
    newTask.value = "";
    saveTasks();
  }
};
// Функция для фильтрации задач
const filteredTasks = computed(() => {
  let sortedTasks = [...tasks.value];
  //Фильтрация по выполненным задачам
  if (filter.value === "completed") {
    sortedTasks = sortedTasks.filter((task) => task.completed);
  }
  //Фильтрация по невыполненным задачам
  if (filter.value === "active") {
    sortedTasks = sortedTasks.filter((task) => !task.completed);
  }
  //Сортировка по дате
  if (sortOrder.value === "newest") {
    sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOrder.value === "oldest") {
    sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  return sortedTasks;
});
// Метод для подтверждения удаления
const confirmDelete = (index) => {
  taskToDelete.value = index;
  isModalVisible.value = true;
};
// Метод для подтверждения удаления
const handleConfirmDelete = () => {
  if (taskToDelete.value !== null) {
    tasks.value.splice(taskToDelete.value, 1);
    saveTasks();
  }
  isModalVisible.value = false;
  taskToDelete.value = null;
};
// Метод для отмены удаления
const handleCancelDelete = () => {
  isModalVisible.value = false;
  taskToDelete.value = null;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
