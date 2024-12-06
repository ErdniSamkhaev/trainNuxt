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
      class="category-badge relative"
      :class="task.categoryColor"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      {{ task.category }}
      <span
        v-if="showTooltip"
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded shadow-lg pointer-events-none"
      >
        {{ task.category }}
      </span>
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
        <textarea
          v-model="task.text"
          rows="3"
          class="border w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
        ></textarea>
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

      <!-- Дата создания и название категории -->
      <div v-else class="flex-grow">
        <span
          class="task-text"
          :class="{
            'line-through text-gray-500 dark:text-gray-400': task.completed,
            'text-gray-800 dark:text-gray-200': !task.completed,
          }"
        >
          {{ task.text }}
        </span>
        <!-- Дата создания -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Создано: {{ formatDate(task.createdAt) }}
        </p>
        <!-- Название категории -->
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Категория: {{ task.category }}
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
import { ref } from "vue";

const isPressed = ref(false);
const showTooltip = ref(false);

defineProps({
  task: Object, // Объект задачи
  onToggle: Function, // Переключение статуса задачи
  onEdit: Function, // Начало редактирования
  onSave: Function, // Сохранение изменений
  onCancel: Function, // Отмена редактирования
  onDelete: Function, // Удаление задачи
});

const formatDate = (date) => {
  const utcDate = new Date(date);
  const moscowOffset = 3 * 60 * 60 * 1000;
  const moscowDate = new Date(utcDate.getTime() + moscowOffset);
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

.task-item:hover {
  @apply shadow-lg bg-gray-100 dark:bg-gray-700;
}

.task-item.scale-95 {
  transform: scale(0.95);
  transition: transform 0.2s ease-in-out;
}
/* Добавлено для текста задачи */
.task-text {
  max-width: 100%; /* Убедиться, что текст не превышает ширину контейнера */
  overflow-wrap: break-word; /* Перенос слов */
  word-break: break-word; /* Перенос слов */
  overflow: hidden; /* Скрыть текст, который выходит за пределы */
  display: -webkit-box; /* Для ограничения количества строк */
  -webkit-line-clamp: 3; /* Максимум 3 строки */
  -webkit-box-orient: vertical;
}

.category-badge {
  width: 7rem;
  height: 4rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}
</style>
