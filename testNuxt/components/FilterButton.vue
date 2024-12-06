<template>
    <button
      @click="onClick"
      :class="[isActive ? activeClass : inactiveClass]"
      class="px-4 py-2 rounded-lg shadow transition-transform hover:scale-105"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  defineProps({
    isActive: Boolean, // Активна ли кнопка
    onClick: Function, // Функция, вызываемая при клике
  });
  
  const activeClass = "bg-blue-500 text-white";
  const inactiveClass = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  </script>
  