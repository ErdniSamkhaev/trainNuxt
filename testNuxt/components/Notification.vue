<template>
    <div>
      <div
        v-if="visible"
        class="fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all transform"
        :class="[
          type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]',
        ]"
      >
        <span class="font-medium">{{ message }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Локальный стейт для управления видимостью, текстом и типом уведомления
  const visible = ref(false);
  const message = ref("");
  const type = ref("success"); // Тип: success или error
  
  // Метод для показа уведомления
  const show = (msg, notificationType = "success") => {
    message.value = msg;
    type.value = notificationType;
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 3000);
  };
  // Экспорт метода `show`, чтобы вызвать его из других компонентов
  defineExpose({ show });
  </script>
  
  <style scoped>
  .transition-all {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  </style>
  