<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { locale } = useI18n()

const ZH = {
  title: '阅后即焚机密',
  subtitle: 'AES-GCM 端到端加密 · 密文过云端 · 密钥只留在 # 片段 · 打开后自毁',
  placeholder: '输入机密内容…（最多 2000 字）',
  generate: '生成阅后即焚链接',
  linkReady: '✅ 链接已生成（含 # 密钥，务必完整复制）：',
  burned: '内容已焚烧，不留痕迹',
  decrypting: '端到端解密中…',
  expired: '⏳ 该机密已自毁（24 小时有效期）',
  broken: '😵 解密失败',
  brokenHint: '链接不完整（#k= 密钥部分必须完整保留）',
  decrypted: '🔐 解密成功 · 链接已从地址栏销毁',
  burnNow: '立即焚烧',
  watermarkWarn: '⚠️ 已启用截图威慑：页面布满溯源水印，关闭后内容不可恢复',
  passPlaceholder: '口头暗语（可选，留空 = 无暗语）',
  needPass: '此机密设有口头暗语',
  unlock: '解锁',
  wrongPass: '暗语错误，无法解锁',
  backHome: '回主页'
}
const EN = {
  title: 'Burn-After-Reading Secret',
  subtitle: 'AES-GCM end-to-end encryption · ciphertext via cloud · key stays in # fragment · self-destructs on open',
  placeholder: 'Enter secret content… (max 2000 chars)',
  generate: 'Generate Burn Link',
  linkReady: '✅ Link generated (includes the # key — copy it in full):',
  burned: 'Content burned, no trace left',
  decrypting: 'Decrypting end-to-end…',
  expired: '⏳ This secret has self-destructed (24h validity)',
  broken: '😵 Decryption failed',
  brokenHint: 'Link incomplete (the #k= key part must be kept intact)',
  decrypted: '🔐 Decrypted · link destroyed from address bar',
  burnNow: 'Burn Now',
  watermarkWarn: '⚠️ Screenshot deterrent active: trace watermarks cover the page; content is unrecoverable after closing',

  passPlaceholder: 'Passphrase (optional, empty = none)',
  needPass: 'This secret is locked by a passphrase',
  unlock: 'Unlock',
  wrongPass: 'Wrong passphrase',
  backHome: 'Back Home'
}
const L = computed(() => (locale.value === 'zh' ? ZH : EN))

const inputText = ref('')
const shareLink = ref('')
const revealed = ref('')
const state = ref<'idle' | 'loading' | 'ok' | 'expired' | 'broken'>('idle')
const burned = ref(false)
const wmTime = new Date().toLocaleString()
const MAX = 2000
const passphrase = ref('')
const needPass = ref(false)
const pending = ref<{ d: Uint8Array; iv: Uint8Array; bundle: Uint8Array | null } | null>(null)
const W_MAGIC = 'w1.'

async function deriveWrapKey(pass: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pass),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function reveal(rawKey: Uint8Array) {
  const p = pending.value
  if (!p) return
  state.value = 'loading'
  try {
    const key = await crypto.subtle.importKey('raw', rawKey as BufferSource, { name: 'AES-GCM' }, false, ['decrypt'])
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: p.iv as BufferSource }, key, p.d as BufferSource)
    const stream = new Blob([new Uint8Array(plain)]).stream().pipeThrough(new DecompressionStream('deflate'))
    const json = JSON.parse(await new Response(stream).text())
    if (json.exp && Date.now() > json.exp) {
      state.value = 'expired'
    } else {
      revealed.value = json.c
      state.value = 'ok'
      history.replaceState(null, '', location.pathname)
    }
  } catch {
    state.value = 'broken'
  }
}

async function unlock() {
  const p = pending.value
  if (!p || !p.bundle) return
  const salt = p.bundle.slice(0, 16)
  const kiv = p.bundle.slice(16, 28)
  const kct = p.bundle.slice(28)
  try {
    const wk = await deriveWrapKey(passphrase.value, salt)
    const rawKey = new Uint8Array(
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv: kiv as BufferSource }, wk, kct as BufferSource)
    )
    needPass.value = false
    await reveal(rawKey)
  } catch {
    toast.add({ severity: 'error', summary: '🔒', detail: L.value.wrongPass, life: 4e3 })
  }
}
useSeoMeta({ title: computed(() => L.value.title) })

const b64e = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const b64d = (s: string) => {
  const str = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i)
  return bytes
}

async function generate() {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const payload = JSON.stringify({ c: inputText.value, exp: Date.now() + 24 * 3600 * 1000 })
  const stream = new Blob([new TextEncoder().encode(payload)])
    .stream()
    .pipeThrough(new CompressionStream('deflate'))
  const plain = await new Response(stream).arrayBuffer()
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain)
  const rawKey = new Uint8Array(await crypto.subtle.exportKey('raw', key))

  let kPart = b64e(rawKey)
  if (passphrase.value) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const kiv = crypto.getRandomValues(new Uint8Array(12))
    const wk = await deriveWrapKey(passphrase.value, salt)
    const kct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: kiv }, wk, rawKey))
    const bundle = new Uint8Array(16 + 12 + kct.length)
    bundle.set(salt, 0)
    bundle.set(kiv, 16)
    bundle.set(kct, 28)
    kPart = W_MAGIC + b64e(bundle)
  }
  shareLink.value = `${location.origin}${localePath('/burn')}?d=${b64e(ct)}&iv=${b64e(iv)}#k=${kPart}`
}
async function copyLink() {
  await navigator.clipboard.writeText(shareLink.value)
  toast.add({ severity: 'success', summary: '✅', detail: L.value.linkReady })
}

function burnNow() {
  revealed.value = ''
  burned.value = true
}

onMounted(async () => {
  const d = `${route.query.d || ''}`
  const ivs = `${route.query.iv || ''}`
  const k = location.hash.startsWith('#k=') ? location.hash.slice(3) : ''
  if (!d || !ivs || !k) return
  if (k.startsWith(W_MAGIC)) {
    pending.value = { d: b64d(d), iv: b64d(ivs), bundle: b64d(k.slice(W_MAGIC.length)) }
    needPass.value = true
    return
  }
  pending.value = { d: b64d(d), iv: b64d(ivs), bundle: null }
  await reveal(b64d(k))
})
</script>

<template>
  <div class="md:w-[60%] md:mx-auto p-4 pb-16 select-none" @contextmenu.prevent>
    <!-- 已焚烧 -->
    <div v-if="burned" class="text-center py-20">
      <p class="text-6xl">🔥</p>
      <p class="text-xl tracking-wider mt-6">{{ L.burned }}</p>
    </div>

    <!-- 接收模式 -->
    <template v-else-if="route.query.d">
      <h1 class="text-2xl tracking-wider text-center mt-6">🔥 {{ L.title }}</h1>
      <div v-if="state === 'loading'" class="text-center py-16 text-sm">{{ L.decrypting }}</div>
   <div v-else-if="needPass" class="text-center py-10 md:w-[70%] md:mx-auto">
     <p class="text-xl">🔒 {{ L.needPass }}</p>
     <InputPassword v-model="passphrase" class="w-full mt-6" :placeholder="L.passPlaceholder" toggleMask />
     <Button rounded severity="contrast" class="w-full tracking-wider mt-4" @click="unlock">
       <Icon name="solar:lock-keyhole-minimalistic-linear" class="mr-2" />{{ L.unlock }}
     </Button>
   </div>
      <div v-else-if="state === 'expired'" class="text-center py-16">
        <p class="text-xl">{{ L.expired }}</p>
      </div>
      <div v-else-if="state === 'broken'" class="text-center py-16">
        <p class="text-xl">{{ L.broken }}</p>
        <p class="text-sm text-neutral-500 mt-2">{{ L.brokenHint }}</p>
      </div>
      <div v-else-if="state === 'ok'" class="relative mt-8">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-neutral-500">{{ L.decrypted }}</p>
          <Button size="small" severity="danger" rounded @click="burnNow">
            <Icon name="solar:flame-linear" class="mr-1" />{{ L.burnNow }}
          </Button>
        </div>
        <div
          class="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-4"
        >
          <pre class="whitespace-pre-wrap break-words text-sm leading-6">{{ revealed }}</pre>
          <!-- 溯源水印 -->
          <div
            class="absolute inset-0 pointer-events-none opacity-[0.07] flex flex-wrap gap-6 p-2 rotate-[-15deg] scale-125"
          >
            <span v-for="i in 24" :key="i" class="text-xs whitespace-nowrap">
              {{ userInfo.nickname }} · {{ wmTime }}
            </span>
          </div>
        </div>
        <p class="text-xs text-neutral-500 mt-2">{{ L.watermarkWarn }}</p>
      </div>
    </template>

    <!-- 发送模式 -->
    <template v-else>
      <h1 class="text-2xl tracking-wider text-center mt-6">🔥 {{ L.title }}</h1>
      <p class="text-center text-xs text-neutral-500 mt-2">{{ L.subtitle }}</p>
      <Textarea
        v-model="inputText"
        rows="8"
        :maxlength="MAX"
        :placeholder="L.placeholder"
        class="w-full mt-6"
      />
      <p class="text-right text-xs text-neutral-500 mt-1">{{ inputText.length }} / {{ MAX }}</p>
   <InputPassword v-model="passphrase" class="w-full mt-3" :placeholder="L.passPlaceholder" toggleMask />
      <Button
        rounded
        severity="contrast"
        class="w-full tracking-wider mt-4"
        :disabled="!inputText.trim()"
        @click="generate"
        ><Icon name="solar:flame-linear" class="mr-2" />{{ L.generate }}</Button
      >
      <div v-if="shareLink" class="mt-6">
        <p class="text-sm mb-2">{{ L.linkReady }}</p>
        <div class="flex gap-2">
          <InputText :model-value="shareLink" readonly class="flex-1 text-xs" />
                <Button severity="contrast" size="small" aria-label="copy link" @click="copyLink"
            ><Icon name="solar:copy-linear"
          /></Button>
        </div>
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