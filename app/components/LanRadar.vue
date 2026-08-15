<script setup lang="ts">
const show = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
function onLan() {
  show.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => (show.value = false), 6000)
}
onMounted(() => window.addEventListener('fs-lan-direct', onLan))
onUnmounted(() => {
  window.removeEventListener('fs-lan-direct', onLan)
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="radar">
    <div
      v-if="show"
      class="fixed top-20 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full shadow-2xl border border-emerald-400/60 bg-white/90 dark:bg-zinc-900/90 backdrop-blur flex flex-row items-center gap-2"
    >
      <span class="relative flex size-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full size-3 bg-emerald-500"></span>
      </span>
      <p class="text-sm tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
        🚀 局域网千兆直连已激活 · 数据不出内网
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.radar-enter-active,
.radar-leave-active {
  transition: all 0.4s ease;
}
.radar-enter-from,
.radar-leave-to {
  opacity: 0;
  transform: translate(-50%, -16px);
}
.radar-enter-to,
.radar-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>