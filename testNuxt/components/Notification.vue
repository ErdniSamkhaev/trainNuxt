<template>
    <div
      v-if="visible"
      class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform"
      :class="{ 'opacity-0 translate-y-[-10px]': !visible, 'opacity-100 translate-y-0': visible }"
    >
      {{ message }}
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Локальный стейт для управления видимостью и текста уведомления
  const visible = ref(false);
  const message = ref("");
  
  // Метод для показа уведомления
  const show = (msg) => {
    message.value = msg; // Устанавливаем текст уведомления
    visible.value = true; // Отображаем уведомление
    setTimeout(() => {
      visible.value = false; // Скрываем уведомление через 3 секунды
    }, 3000);
  };
  
  // Экспорт метода `show`, чтобы вызвать его из других компонентов
  defineExpose({ show });
  </script>
  
  <style scoped>
  .transition-transform {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  </style>
  