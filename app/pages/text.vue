<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const { locale } = useI18n()

const ZH = {
  title: '文本传送',
  subtitle: '粘贴文本生成链接，朋友打开即见，无需传文件',
  placeholder: '粘贴文本 / 代码 / 链接…（最多 2000 字）',
  generate: '生成传送链接',
  linkReady: '✅ 链接已生成：',
  warn: '⚠️ 链接内含文本内容，请勿传送密码等隐私',
  copied: '已复制',
  copiedDetail: '传送链接已在剪贴板',
  decoding: '解码中…',
  broken: '😵 链接损坏或不完整',
  brokenHint: '请确认链接被完整复制',
  fromFriend: '字 · 来自朋友的传送',
  copyText: '复制文本',
  textCopiedDetail: '文本已在剪贴板',
  backHome: '回主页'
}
const EN = {
  title: 'Text Teleport',
  subtitle: 'Paste text, generate a link — friends see it instantly, no files needed',
  placeholder: 'Paste text / code / links… (max 2000 chars)',
  generate: 'Generate Teleport Link',
  linkReady: '✅ Link generated:',
  warn: '⚠️ The link contains the text itself — never teleport passwords or private info',
  copied: 'Copied',
  copiedDetail: 'Teleport link copied to clipboard',
  decoding: 'Decoding…',
  broken: '😵 Link broken or incomplete',
  brokenHint: 'Make sure the link was copied in full',
  fromFriend: 'chars · teleported from a friend',
  copyText: 'Copy Text',
  textCopiedDetail: 'Text copied to clipboard',
  backHome: 'Back Home'
}
const L = computed(() => (locale.value === 'zh' ? ZH : EN))

const inputText = ref('')
const shareLink = ref('')
const receivedText = ref('')
const isDecoding = ref(false)
const decodeError = ref(false)
const MAX = 2000

useSeoMeta({ title: computed(() => L.value.title) })

function bufToB64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64ToBuf(b64: string) {
  const s = atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i)
  return bytes
}

async function encode(text: string) {
  const stream = new Blob([new TextEncoder().encode(text)])
    .stream()
    .pipeThrough(new CompressionStream('deflate'))
  const buf = await new Response(stream).arrayBuffer()
  return bufToB64(buf)
}

async function decode(b64: string) {
  const bytes = b64ToBuf(b64)
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'))
  return new Response(stream).text()
}

async function generate() {
  if (!inputText.value.trim()) return
  const d = await encode(inputText.value)
  shareLink.value = `${location.origin}${localePath('/text')}?d=${d}`
}

async function copyLink() {
  await navigator.clipboard.writeText(shareLink.value)
  toast.add({ severity: 'success', summary: L.value.copied, detail: L.value.copiedDetail })
}

async function copyText() {
  await navigator.clipboard.writeText(receivedText.value)
  toast.add({ severity: 'success', summary: L.value.copied, detail: L.value.textCopiedDetail })
}

onMounted(async () => {
  const d = `${route.query.d || ''}`
  if (d) {
    isDecoding.value = true
    try {
      receivedText.value = await decode(d)
    } catch {
      decodeError.value = true
    }
    isDecoding.value = false
  }
})
</script>

<template>
  <div class="md:w-[60%] md:mx-auto p-4 pb-16">
    <!-- 接收模式 -->
    <template v-if="route.query.d">
      <h1 class="text-2xl tracking-wider text-center mt-6">📝 {{ L.title }}</h1>
      <div v-if="isDecoding" class="text-center py-16 text-sm">{{ L.decoding }}</div>
      <div v-else-if="decodeError" class="text-center py-16">
        <p class="text-xl">{{ L.broken }}</p>
        <p class="text-sm text-neutral-500 mt-2">{{ L.brokenHint }}</p>
      </div>
      <div v-else class="mt-8">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-neutral-500">{{ receivedText.length }} {{ L.fromFriend }}</p>
          <Button size="small" severity="contrast" rounded @click="copyText">
            <Icon name="solar:copy-linear" class="mr-1" />{{ L.copyText }}
          </Button>
        </div>
        <pre
          class="whitespace-pre-wrap break-words text-sm p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-neutral-200 dark:border-zinc-800 leading-6"
        >{{ receivedText }}</pre>
      </div>
    </template>

    <!-- 发送模式 -->
    <template v-else>
      <h1 class="text-2xl tracking-wider text-center mt-6">📝 {{ L.title }}</h1>
      <p class="text-center text-xs text-neutral-500 mt-2">{{ L.subtitle }}</p>
      <Textarea
        v-model="inputText"
        rows="8"
        :maxlength="MAX"
        :placeholder="L.placeholder"
        class="w-full mt-6"
      />
      <p class="text-right text-xs text-neutral-500 mt-1">{{ inputText.length }} / {{ MAX }}</p>
      <Button
        rounded
        severity="contrast"
        class="w-full tracking-wider mt-4"
        :disabled="!inputText.trim()"
        @click="generate"
        ><Icon name="solar:plain-linear" class="mr-2" />{{ L.generate }}</Button
      >

      <div v-if="shareLink" class="mt-6">
        <p class="text-sm mb-2">{{ L.linkReady }}</p>
        <div class="flex gap-2">
          <InputText :model-value="shareLink" readonly class="flex-1 text-xs" />
          <Button severity="contrast" size="small" @click="copyLink"
            ><Icon name="solar:copy-linear"
          /></Button>
        </div>
        <p class="text-xs text-neutral-500 mt-2">{{ L.warn }}</p>
      </div>
    </template>

    <div class="text-center mt-10">
      <NuxtLink :to="localePath('/')">
        <Button severity="secondary" outlined rounded size="small" class="tracking-wider"
          ><Icon name="solar:home-2-linear" class="mr-2" />{{ L.backHome }}</Button
        >
      </NuxtLink>
    </div>
  </div>
</template>