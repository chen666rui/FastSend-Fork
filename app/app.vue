<script setup lang="ts">
useSeoMeta({
  ogTitle: 'FastSend',
  ogType: 'website',
  ogImage: '/favicon.webp',
  twitterCard: 'summary_large_image',
  twitterTitle: 'FastSend',
  twitterDescription: '极速 P2P 文件与目录传输'
})

const appStore = useAppStore()

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    appStore.setDeferredPrompt(event as BeforeInstallPromptEvent)
  })
  appStore.setFullScreenLoading(false)
})
</script>

<template>
  <NuxtPwaManifest />
  <NuxtRouteAnnouncer />
  <FullScreenLoader />
  <Toast position="top-right" />
  <LanRadar />
  <NavBar />
  <NuxtPage />
  <AppFooter />
  <ScrollTop />
  <InstallPWA />
  <DocPanel />
</template>