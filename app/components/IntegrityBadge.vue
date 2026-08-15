<script setup lang="ts">
const props = defineProps<{ dir: 'send' | 'receive' }>()
const { locale } = useI18n()
const fp = ref('')
const bytes = ref(0)
const stamp = ref('')
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    const g = (window as any).__fsIntegrity
    if (!g) return
    const agg = props.dir === 'send' ? g.OUT : g.IN
    if (agg.len > 0) {
      fp.value = Array.from(agg.acc)
        .map((b: number) => b.toString(16).padStart(2, '0'))
        .join('')
      bytes.value = agg.len
      if (!stamp.value) stamp.value = new Date().toLocaleString()
    }
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function copy() {
  await navigator.clipboard.writeText(fp.value)
}
</script>

<template>
  <div
    v-if="fp"
    class="mt-6 w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs tracking-wider text-neutral-500">
        {{
          locale === 'zh'
            ? '🔐 完整性指纹 SHA-256（两端一致=零损坏）'
            : '🔐 SHA-256 integrity fingerprint (match = zero corruption)'
        }}
      </p>
      <Button text size="small" severity="secondary" @click="copy">
        {{ locale === 'zh' ? '复制' : 'Copy' }}
      </Button>
    </div>
    <p class="font-mono text-xs break-all mt-1 select-all">{{ fp }}</p>
    <p class="text-[10px] text-neutral-400 mt-1">{{ bytes }} B · {{ stamp }}</p>
  </div>
</template>