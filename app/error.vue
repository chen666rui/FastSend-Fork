<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const zh = computed(() =>
  (typeof navigator !== 'undefined' ? navigator.language : 'en').startsWith('zh')
)
const title = computed(() => {
  if (props.error.statusCode === 404) return zh.value ? '页面走丢了' : 'Page not found'
  return zh.value ? '服务开了个小差' : 'Something went wrong'
})
const tip = computed(() =>
  zh.value
    ? '别慌，文件还在路上，点下面回主页继续传～'
    : "Don't panic, your files are safe. Head back home~"
)
const back = computed(() => (zh.value ? '回主页' : 'Back Home'))

useHead({ title: `${props.error.statusCode} | FastSend` })
const home = () => clearError({ redirect: '/' })
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-zinc-950 text-neutral-900 dark:text-neutral-100 p-6"
  >
    <p class="text-7xl mb-6">{{ error.statusCode === 404 ? '' : '💥' }}</p>
    <h1 class="text-4xl tracking-wider font-bold">
      <span class="text-red-600">Fast</span> Send
    </h1>
    <p class="mt-4 text-6xl font-black text-neutral-300 dark:text-zinc-700">
      {{ error.statusCode }}
    </p>
    <p class="mt-4 text-lg">{{ title }}</p>
    <p class="mt-2 text-sm text-neutral-500">{{ tip }}</p>
    <button
      class="mt-8 px-8 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 tracking-wider hover:opacity-80 transition"
      @click="home"
    >
      {{ back }}
    </button>
  </div>
</template>