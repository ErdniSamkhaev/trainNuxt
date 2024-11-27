<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg p-4 w-80"
    >
      <h3 class="text-lg font-bold mb-4">Подтверждение</h3>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <button
          @click="cancel"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Отмена
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps(["show", "message"]);

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
</script>
