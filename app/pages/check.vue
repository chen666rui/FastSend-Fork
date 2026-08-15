<script setup lang="ts">
const localePath = useLocalePath()
const { locale } = useI18n()

const ZH: Record<string, string> = {
  title: '一键诊断',
  subtitle: '朋友的设备连不上？在那台设备上打开本页，原因一目了然',
  recheck: '重新检测',
  backHome: '回主页',
  checking: '检测中…',
  secure: '安全上下文（HTTPS）',
  rtc: 'WebRTC 支持',
  dc: 'DataChannel 数据通道',
  fs: '文件系统 API',
  clip: '剪贴板 API',
  crypto: 'WebCrypto 加密',
  comp: '流式压缩',
  online: '网络连接',
  net: '网络类型',
  nat: 'NAT 穿透（STUN）',
  browser: '浏览器'
}
const EN: Record<string, string> = {
  title: 'Diagnostics',
  subtitle: "Friend's device can't connect? Open this page on that device — the cause becomes obvious",
  recheck: 'Re-check',
  backHome: 'Back Home',
  checking: 'Checking…',
  secure: 'Secure context (HTTPS)',
  rtc: 'WebRTC support',
  dc: 'DataChannel support',
  fs: 'File System API',
  clip: 'Clipboard API',
  crypto: 'WebCrypto',
  comp: 'Stream compression',
  online: 'Online',
  net: 'Network type',
  nat: 'NAT traversal (STUN)',
  browser: 'Browser'
}
const L = computed(() => (locale.value === 'zh' ? ZH : EN))

const rows = ref<{ id: string; ok: boolean; v: string }[]>([])
const busy = ref(false)

function browserInfo() {
  const m = navigator.userAgent.match(/(Edg|OPR|Firefox|Chrome|Safari)\/([\d.]+)/)
  return m ? `${m[1] === 'Edg' ? 'Edge' : m[1]} ${m[2].split('.')[0]}` : 'Unknown'
}

async function stunTest(): Promise<string> {
  return new Promise((resolve) => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
      const types: string[] = []
      const done = () => {
        pc.close()
        resolve(types.includes('srflx') ? '✅ srflx' : types.includes('host') ? 'host only' : types.join(',') || 'none')
      }
      pc.onicecandidate = (e) => {
        if (!e.candidate) return done()
        if (e.candidate.type && !types.includes(e.candidate.type)) types.push(e.candidate.type)
      }
      pc.createDataChannel('t')
      pc.createOffer().then((o) => pc.setLocalDescription(o))
      setTimeout(done, 3000)
    } catch {
      resolve('error')
    }
  })
}

async function run() {
  busy.value = true
  const conn = (navigator as any).connection
  rows.value = [
    { id: 'secure', ok: window.isSecureContext, v: window.isSecureContext ? 'HTTPS' : 'HTTP' },
    { id: 'rtc', ok: 'RTCPeerConnection' in window, v: '' },
    { id: 'dc', ok: 'RTCDataChannel' in window, v: '' },
    { id: 'fs', ok: 'showDirectoryPicker' in window, v: '' },
    { id: 'clip', ok: !!navigator.clipboard, v: '' },
    { id: 'crypto', ok: !!crypto?.subtle, v: '' },
    { id: 'comp', ok: 'CompressionStream' in window, v: '' },
    { id: 'online', ok: navigator.onLine, v: '' },
    { id: 'net', ok: true, v: conn?.effectiveType || 'unknown' },
    { id: 'browser', ok: true, v: browserInfo() }
  ]
  const nat = await stunTest()
  rows.value.push({ id: 'nat', ok: nat.includes('srflx'), v: nat })
  busy.value = false
}

useSeoMeta({ title: computed(() => L.value.title) })
onMounted(run)
</script>

<template>
  <div class="md:w-[50%] md:mx-auto p-4 pb-16">
    <h1 class="text-2xl tracking-wider text-center mt-6">🩺 {{ L.title }}</h1>
    <p class="text-center text-xs text-neutral-500 mt-2">{{ L.subtitle }}</p>

    <div class="mt-8 space-y-2">
      <div
        v-for="r in rows"
        :key="r.id"
        class="flex items-center justify-between text-sm p-3 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-neutral-200 dark:border-zinc-800"
      >
        <span>{{ L[r.id] }}</span>
        <span class="flex items-center gap-2">
          <span v-if="r.v" class="text-xs text-neutral-500">{{ r.v }}</span>
          <span v-if="r.id === 'browser' || r.id === 'net'"></span>
          <span v-else>{{ r.ok ? '✅' : '❌' }}</span>
        </span>
      </div>
      <div v-if="busy" class="text-center text-xs text-neutral-500 py-2">{{ L.checking }}</div>
    </div>

    <Button rounded severity="contrast" class="w-full tracking-wider mt-6" @click="run">
      <Icon name="solar:refresh-square-broken" class="mr-2" />{{ L.recheck }}
    </Button>

    <div class="text-center mt-8">
      <NuxtLink :to="localePath('/')">
        <Button severity="secondary" outlined rounded size="small" class="tracking-wider"
          ><Icon name="solar:home-2-linear" class="mr-2" />{{ L.backHome }}</Button
        >
      </NuxtLink>
    </div>
  </div>
</template>