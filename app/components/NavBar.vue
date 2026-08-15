<script setup lang="ts">
const localePath = useLocalePath()
const { locale, setLocale } = useI18n()
const colorMode = useColorMode()
const isBgBlur = ref(false)
const userStore = useUserStore()
const { userInfo, isConfirmDefault } = storeToRefs(userStore)
const tmpNickname = ref('')
const userInfoPopover = ref()
const themePopover = ref()

// ===== 自定义主题色 =====
const themes = [
  { name: '科技蓝', light: '#0ea5e9', dark: '#38bdf8' },
  { name: '活力橙', light: '#f97316', dark: '#fb923c' },
  { name: '清新绿', light: '#10b981', dark: '#34d399' },
  { name: '尊贵紫', light: '#8b5cf6', dark: '#a78bfa' },
  { name: '樱花粉', light: '#ec4899', dark: '#f472b6' }
]
// -1 代表默认黑白色
const currentTheme = ref(-1)

// ===== 按键音效开关 =====
const keySoundOn = ref(false)
function switchKeySound() {
  localStorage.setItem('fs-key-sound', keySoundOn.value ? 'on' : 'off')
}

// 生成主题覆盖样式
function buildThemeCss(color: string, contrast: string) {
  return `
    /* 实心黑按钮的黑底 */
    .bg-surface-900 { background-color: ${color} !important; }
    .dark .dark\\:bg-surface-900 { background-color: ${color} !important; }
    /* 描边按钮的黑边框 */
    .border-surface-900 { border-color: ${color} !important; }
    .dark .dark\\:border-surface-0 { border-color: ${color} !important; }
    /* 描边按钮的黑字和图标 */
    .text-surface-900 { color: ${color} !important; }
    .bg-transparent.dark\\:text-surface-0 { color: ${color} !important; }
    .dark .dark\\:bg-transparent.dark\\:text-surface-0 { color: ${color} !important; }
    /* 悬停效果 */
    .hover\\:bg-surface-800:hover { background-color: ${color} !important; filter: brightness(1.15); }
    .hover\\:border-surface-800:hover { border-color: ${color} !important; }
    /* 兼容旧的黑类名 */
    .bg-neutral-900, .bg-black { background-color: ${color} !important; }
    .text-neutral-900, .text-black { color: ${color} !important; }
    .border-neutral-900, .border-black { border-color: ${color} !important; }
  `
}
// 应用主题色
function applyTheme(index: number) {
  currentTheme.value = index
  const theme = themes[index]
  const isDark = colorMode.preference === 'dark'
  const color = isDark ? theme.dark : theme.light

  let styleEl = document.getElementById('fs-theme-style') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'fs-theme-style'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = buildThemeCss(color, '#ffffff')
  localStorage.setItem('fs-theme-index', String(index))
}

// ===== 自定义取色 =====
const customColor = ref('#0ea5e9')
function applyCustom(color: string) {
  currentTheme.value = -2
  customColor.value = color
  let styleEl = document.getElementById('fs-theme-style') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'fs-theme-style'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = buildThemeCss(color, '#ffffff')
  localStorage.setItem('fs-theme-index', 'custom:' + color)
}
function onCustomColor(e: Event) {
  applyCustom((e.target as HTMLInputElement).value)
}

// 恢复默认
function resetTheme() {
  localStorage.removeItem('fs-theme-index')
  currentTheme.value = -1
  document.getElementById('fs-theme-style')?.remove()
}

// 暗色模式切换
function switchColorMode() {
  if (colorMode.preference === 'light') {
    colorMode.preference = 'dark'
  } else {
    colorMode.preference = 'light'
  }
  // 切换后重新应用当前自定义主题色（默认黑白则不干预）
  setTimeout(() => {
    if (currentTheme.value >= 0) applyTheme(currentTheme.value)
  }, 50)
}

// 打开主题设置面板
function showThemePanel(event: Event) {
  themePopover.value.toggle(event)
}

// 中英语言切换
function switchI18n() {
  if (locale.value === 'en') {
    setLocale('zh')
  } else {
    setLocale('en')
  }
}

// 是否开启发送方自动确认
function switchConfirmDefault() {
  userStore.setConfirmDefault(isConfirmDefault.value)
}

// 展示昵称编辑弹框
function showNicknameEditor(event: Event) {
  tmpNickname.value = userInfo.value.nickname
  userInfoPopover.value.toggle(event)
}

// 编辑昵称
function editNickname() {
  userStore.setNickname(tmpNickname.value)
  tmpNickname.value = userInfo.value.nickname
  userInfoPopover.value.hide()
}

// 编辑头像
function editAvatar() {
  userStore.openAvatarPicker()
}

// 重置用户信息
function clearUserInfo() {
  userStore.resetUserInfo()
  tmpNickname.value = userInfo.value.nickname
}

onMounted(() => {
  keySoundOn.value = localStorage.getItem('fs-key-sound') === 'on'
  window.addEventListener('scroll', () => {
    isBgBlur.value = getScrollTop() > 64
  })
  userStore.initializeFromStorage()
  tmpNickname.value = userInfo.value.nickname
  // 恢复上次保存的主题色（没保存过 = 默认黑白）
   const saved = localStorage.getItem('fs-theme-index')
  if (saved) {
    if (saved.startsWith('custom:')) applyCustom(saved.slice(7))
    else if (saved !== '-1') applyTheme(parseInt(saved))
  }
})
</script>

<template>
  <nav
    class="flex flex-row items-center py-3 px-4 md:py-4 md:px-[10vw] sticky left-0 right-0 top-0 z-50 nav-bar"
    :class="{ 'backdrop-blur': isBgBlur }"
  >
    <NuxtLink :to="localePath('/')">
      <div class="tracking-wider">
        <img src="/favicon.webp" class="inline-block size-[32px] mr-1" />FastSend
      </div>
    </NuxtLink>

    <div class="flex-1"></div>

    <div class="contents text-sm">
      <Avatar
        :image="userInfo.avatarURL"
        shape="circle"
        class="shadow cursor-pointer"
        @click="showNicknameEditor"
      />
      <p class="ml-2 truncate shrink-[1000] hidden md:block">
        {{ userInfo.nickname }}
      </p>
    </div>

    <!-- 用户信息弹出框 -->
    <Popover ref="userInfoPopover">
      <div class="relative p-3 m-2">
        <div class="absolute top-0 right-0 z-10">
          <Button
            severity="secondary"
            text
            @click="clearUserInfo"
            size="small"
            class="py-3"
            aria-label="Reset"
          >
            <Icon name="material-symbols:sync-rounded" class="text-rose-500 dark:text-rose-600" />
          </Button>
        </div>

        <div class="relative flex flex-col items-center gap-4">
          <Avatar
            :image="userInfo.avatarURL"
            shape="circle"
            class="shadow-md cursor-pointer"
            size="xlarge"
            @click="editAvatar"
          />
          <InputGroup>
            <InputText
              severity="contrast"
              size="small"
              placeholder="昵称"
              v-model:model-value="tmpNickname"
              @keydown.enter="editNickname"
            />
            <Button severity="contrast" size="small" class="m-0" @click="editNickname"
              ><Icon name="material-symbols:check-rounded"
            /></Button>
          </InputGroup>
        </div>

        <Divider />

        <div class="flex flex-row items-center justify-between">
          <p class="text-sm">{{ $t('label.autoConfirmBySender') }}</p>
          <ToggleSwitch v-model="isConfirmDefault" @change="switchConfirmDefault" />
        </div>
      </div>
    </Popover>

    <div class="contents">
      <Button
        severity="secondary"
        text
        @click="switchI18n"
        size="small"
        class="py-3"
        aria-label="Language"
      >
        <Icon
          name="icon-park-outline:chinese"
          class="text-black/90 dark:text-white/90"
          v-if="locale === 'zh'"
        />
        <Icon
          name="icon-park-outline:english"
          class="text-black/90 dark:text-white/90"
          v-else-if="locale === 'en'"
        />
      </Button>

      <!-- ☀️ 太阳/月亮图标：点开主题设置面板 -->
      <Button
        severity="secondary"
        text
        @click="showThemePanel"
        size="small"
        class="py-3"
        aria-label="Theme"
      >
        <Icon
          name="solar:moon-linear"
          class="text-yellow-500/90"
          v-if="colorMode.preference === 'dark'"
        />
        <Icon name="solar:sun-broken" class="text-black" v-else />
      </Button>
    </div>

    <!-- 主题设置弹出框 -->
    <Popover ref="themePopover">
      <div class="relative p-3 m-2 flex flex-col gap-3" style="min-width: 210px">
        <div class="flex flex-row items-center justify-between">
          <p class="text-sm">暗黑模式</p>
          <ToggleSwitch
            :model-value="colorMode.preference === 'dark'"
            @change="switchColorMode"
          />
        </div>
        <Divider class="my-0" />
        <p class="text-sm">主题色</p>
        <div class="flex flex-row gap-2">
        <label class="flex items-center gap-2 text-sm cursor-pointer mt-1">
          <input
            type="color"
            :value="customColor"
            class="w-7 h-7 rounded cursor-pointer border-none bg-transparent p-0"
            @input="onCustomColor"
          />
          <span>自定义颜色</span>
        </label>

          <button
            v-for="(t, i) in themes"
            :key="t.name"
            :title="t.name"
            class="theme-dot"
            :class="{ active: currentTheme === i }"
            :style="{ background: t.light }"
            @click="applyTheme(i)"
          ></button>
        </div>
        <Divider class="my-0" />
        <div class="flex flex-row items-center justify-between">
          <p class="text-sm">按键音效</p>
          <ToggleSwitch v-model="keySoundOn" @change="switchKeySound" />
        </div>

        <Button severity="secondary" size="small" outlined rounded @click="resetTheme">
          恢复默认
        </Button>
      </div>
    </Popover>
  </nav>
</template>

<style scoped>
.nav-bar {
  transition: backdrop-filter 0.5s ease;
}
.theme-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.theme-dot:hover {
  transform: scale(1.15);
}
.theme-dot.active {
  border-color: #333;
  transform: scale(1.1);
}
.dark .theme-dot.active {
  border-color: #fff;
}
</style>