<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <h1 class="text-2xl font-bold mb-4">Список задач</h1>
    <!-- Создаем фильтр -->
    <div class="flex gap-4 mb-4">
      <button @click="filter = 'all'" class="hover:underline">Все</button>
      <button @click="filter = 'completed'" class="hover:underline">
        Выполненные
      </button>
      <button @click="filter = 'active'" class="hover:underline">
        Невыполненные
      </button>
    </div>
    <!-- Добавляем новую задачу -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="newTask"
        type="text"
        placeholder="Введите новую задачу"
        class="border p-2 rounded-lg"
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
        class="bg-white p-2 rounded-lg shadow-md mb-2 flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="task.completed"
            class="cursor-pointer"
          />
          <span :class="{ 'line-through text-gray-500': task.completed }">
            {{ task.text }}
          </span>
        </div>
        <button @click="removeTask(index)" class="text-red-500 hover:underline">
          Удалить
        </button>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
// Импортируем ref для работы с переменными
import { ref, computed } from "vue";
// Создаем переменные
const newTask = ref("");
const tasks = ref([]);
const filter = ref("all");
// Функиця addTask для добавления задач
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: newTask.value.trim(),
      completed: false,
    });
    newTask.value = "";
  }
};
// Функция removeTask для удаления задач
const removeTask = (index) => {
  tasks.value.splice(index, 1);
};
// Функция для фильтрации задач
const filteredTasks = computed(() => {
  if (filter.value === "completed") {
    return tasks.value.filter((task) => task.completed);
  }
  if (filter.value === "active") {
    return tasks.value.filter((task) => !task.completed);
  }
  return tasks.value;
});
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
