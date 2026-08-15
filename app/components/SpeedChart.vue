<script setup lang="ts">
const props = defineProps<{ speed: number }>()
const points = ref<number[]>([])
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    points.value.push(props.speed)
    if (points.value.length > 60) points.value.shift()
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const path = computed(() => {
  const arr = points.value
  if (arr.length < 2) return ''
  const max = Math.max(...arr, 1)
  const w = 300
  const h = 60
  return arr
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (arr.length - 1)) * w).toFixed(1)},${(h - (v / max) * (h - 6)).toFixed(1)}`)
    .join(' ')
})
</script>

<template>
  <svg viewBox="0 0 300 60" class="w-full h-14 mt-2 text-sky-500 dark:text-sky-400">
    <path :d="path" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>