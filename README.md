# My First Nuxt App

Это базовый проект на Nuxt 3 с интеграцией TailwindCSS. 

## Установка

### Шаг 1: Установка Node.js
Перед началом работы необходимо установить [Node.js](https://nodejs.org/). Рекомендуется использовать LTS-версию.

Чтобы проверить установленную версию Node.js и npm, выполните команды:

```bash
node -v
npm -v
```
Далее устанавливаем проект через Nuxt

```bash
npx nuxi@latest init <project-name>
```
Соглашаемся через npm

и переходим в папку проекта

Устанавливаем node_modules
```bash
npm i
```
и остальные зависимости которые нужны для проекта

Установите Tailwind CSS
Установите tailwindcss и его одноранговые зависимости через npm и создайте свой tailwind.config.js файл.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```


Добавьте Tailwind в вашу конфигурацию PostCSS
Добавьте tailwindcss и autoprefixer в свой postcss.config.js файл или в любое другое место, где в вашем проекте настроен PostCSS.

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'], // Подключаем стили
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
```


Настройте пути к вашим шаблонам
Добавьте пути ко всем файлам вашего шаблона в вашем tailwind.config.js файле.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Добавьте директивы Tailwind в ваш CSS
Добавьте директивы @tailwind для каждого из слоёв Tailwind в основной файл CSS.
Создать папку assets/css/main.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Создай папку components/HelloWorld.vue
Создай папку pages/index.vue
и настрой файл app.vue
```Vue
<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <NuxtPage />
  </div>
</template>

<script setup>
// Если понадобится добавить какие-то глобальные скрипты, их можно писать здесь.
</script>

```
И запускай проект
```bash
npm run dev
```