<template>
  <div class="wish-board">
    <h1 class="text-2xl font-bold mb-4">
      {{ currentLanguage === "ru" ? "Карта желаний" : "Wish Board" }}
    </h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="(item, index) in wishes"
        :key="index"
        class="wish-item bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      >
        <img
          v-if="item.image"
          :src="item.image"
          alt="Wish image"
          class="w-full h-32 object-cover rounded-md mb-2"
        />
        <h3 class="text-lg font-bold">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ item.description }}
        </p>
      </div>
    </div>
    <!-- Кнопка добавления желания -->
    <button
      @click="addWish"
      class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
    >
      {{ currentLanguage === "ru" ? "Добавить желание" : "Add Wish" }}
    </button>
    <!-- Кнопка редактирования желания -->
    <button @click="editWish(index)" class="text-blue-500 hover:underline">
      {{ currentLanguage === "ru" ? "Редактировать" : "Edit" }}
    </button>
    <!-- Кнопка удаления желания -->
    <button @click="removeWish(index)" class="text-red-500 hover:underline">
      {{ currentLanguage === "ru" ? "Удалить" : "Delete" }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const currentLanguage = ref("ru"); // По умолчанию русский язык

defineProps({
  currentLanguage: String, // Ожидаемая строка ('ru' или 'en')
});

const wishes = ref([
  { title: "New Car", description: "A red Tesla Model S", image: null },
  {
    title: "Travel to Japan",
    description: "Visit Tokyo and Kyoto",
    image: null,
  },
]);
// Функция добавления желания
const addWish = () => {
  wishes.value.push({
    title: "New Wish",
    description: "Description here",
    image: null,
  });
};
// Функция редактирования желания
const editWish = (index) => {
  const wish = wishes.value[index];
  const newTitle = prompt(
    currentLanguage.value === "ru"
      ? "Введите новое название:"
      : "Enter new title:",
    wish.title
  );
  if (newTitle) wishes.value[index].title = newTitle;
};
// Функция удаления желания
const removeWish = (index) => {
  wishes.value.splice(index, 1);
};

</script>

<style scoped>
.wish-item img {
  transition: transform 0.3s ease-in-out;
}
.wish-item img:hover {
  transform: scale(1.1);
}
</style>
