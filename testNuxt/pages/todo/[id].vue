<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4">
      <h1 class="text-2xl font-bold mb-4">Детали задачи</h1>
      <div v-if="task" class="bg-white dark:bg-gray-800 border p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold">{{ task.title }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Создана: {{ formatDate(task.createdAt) }}
        </p>
        <p :class="{ 'line-through': task.completed }">
          {{ task.completed ? "Выполнена" : "Не выполнена" }}
        </p>
      </div>
      <div v-else>
        <p>Задача не найдена.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const task = ref(null);
  const { $supabase } = useNuxtApp();
  
  onMounted(async () => {
    const { data, error } = await $supabase
      .from("tasks")
      .select("*")
      .eq("id", route.params.id)
      .single();
  
    if (error) {
      console.error("Ошибка загрузки задачи:", error);
    } else {
      task.value = data;
    }
  });
  
  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ru-RU", options);
  };
  </script>
  