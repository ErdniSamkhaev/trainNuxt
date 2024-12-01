<template>
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4"
    >
      <h1 class="text-2xl font-bold mb-4">Задача</h1>
      <div
        v-if="task"
        class="bg-white dark:bg-gray-800 border p-4 rounded-lg shadow w-full max-w-md"
      >
        <h2 class="text-lg font-semibold">{{ task.title }}</h2>
        <p
          class="text-sm px-2 py-1 rounded-full mt-2 inline-block"
          :class="{
            'bg-blue-500 text-white': task.category === 'Работа',
            'bg-green-500 text-white': task.category === 'Дом',
            'bg-yellow-500 text-white': task.category === 'Хобби',
            'bg-gray-500 text-white': task.category === 'Другое',
          }"
        >
          {{ task.category }}
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
      .select("title, category")
      .eq("id", route.params.id)
      .single();
  
    if (error) {
      console.error("Ошибка загрузки задачи:", error);
    } else {
      task.value = data;
    }
  });
  </script>
  