<template>
  <li
    class="task-item"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
    :class="{ 'scale-95': isPressed }"
  >
    <!-- Метка категории -->
    <span
      class="text-sm px-2 py-1 rounded-full"
      :class="['inline-block text-center min-w-[50px]', task.categoryColor]"
    >
      {{ task.category }}
    </span>

    <!-- Основная информация -->
    <div class="flex flex-wrap gap-2 items-center w-full">
      <!-- Чекбокс -->
      <div class="relative">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="onToggle"
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

      <!-- Текст задачи или поле редактирования -->
      <div v-if="task.editing" class="flex-grow">
        <input
          v-model="task.text"
          class="border w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        />
        <div class="flex justify-end mt-2 gap-2">
          <button
            @click="onSave"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Сохранить
          </button>
          <button
            @click="onCancel"
            class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
        </div>
      </div>
      <div v-else class="flex-grow">
        <span
          :class="{
            'line-through text-gray-500 dark:text-gray-400': task.completed,
            'text-gray-800 dark:text-gray-200': !task.completed,
          }"
        >
          {{ task.text }}
        </span>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Создано: {{ formatDate(task.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div>
      <button
        v-if="!task.editing"
        @click="onEdit"
        class="text-blue-500 hover:underline"
      >
        Редактировать
      </button>
      <button @click="onDelete" class="text-red-500 hover:underline ml-2">
        Удалить
      </button>
    </div>
  </li>
</template>

<script setup>
const isPressed = ref(false);

defineProps({
  task: Object, // Объект задачи
  onToggle: Function, // Переключение статуса задачи
  onEdit: Function, // Начало редактирования
  onSave: Function, // Сохранение изменений
  onCancel: Function, // Отмена редактирования
  onDelete: Function, // Удаление задачи
});

const formatDate = (date) => {
  const utcDate = new Date(date); // Преобразуем строку в объект Date
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
</script>

<style scoped>
.task-item {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-center transition-shadow duration-300;
}

.task-item {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-center transition-shadow duration-300;
}

.task-item:hover {
  @apply shadow-lg bg-gray-100 dark:bg-gray-700; /* Тень и изменение фона */
}

@media (hover: none) {
  .task-item:active {
    transform: scale(0.98); /* Легкое уменьшение */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Больше тени */
    background-color: #f1f5f9; /* Легкое изменение фона */
  }
}
.task-item.scale-95 {
  transform: scale(0.95);
  transition: transform 0.2s ease-in-out;
}

</style>
