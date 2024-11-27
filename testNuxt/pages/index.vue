<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center bg-gray-100 gap-4"
  >
    <HelloWorld />
    <nuxt-link to="/todo" class="mt-4 text-blue-500 hover:underline">
      Перейти к списку задач
    </nuxt-link>
  </div>
</template>

<script setup>
import HelloWorld from "~/components/HelloWorld.vue";
</script>
