<script setup lang="ts">
const rtt = ref(0)
const on = (e: Event) => (rtt.value = (e as CustomEvent).detail.rtt)
onMounted(() => window.addEventListener('fs-rtt', on))
onUnmounted(() => window.removeEventListener('fs-rtt', on))
const bars = computed(() => {
  if (!rtt.value) return 0
  if (rtt.value <= 50) return 4
  if (rtt.value <= 120) return 3
  if (rtt.value <= 300) return 2
  return 1
})
const color = computed(() => (bars.value >= 3 ? 'bg-emerald-500' : bars.value === 2 ? 'bg-amber-500' : 'bg-rose-500'))
</script>

<template>
  <div class="flex flex-col items-end gap-0.5" :title="rtt + 'ms'">
    <div class="flex items-end gap-0.5">
      <div
        v-for="i in 4"
        :key="i"
        :style="{ height: 4 + i * 3 + 'px' }"
        class="w-1 rounded-sm"
        :class="i <= bars ? color : 'bg-neutral-300 dark:bg-zinc-700'"
      />
    </div>
    <p class="text-[10px] text-neutral-500">{{ rtt ? rtt + 'ms' : '…' }}</p>
  </div>
</template>