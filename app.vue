<template>
  <UtilsNotificationBanner
    v-if="notificationsBanner"
    v-bind="notificationsBanner"
  />
  <div class="grid grid-rows-auto-1fr h-full">
    <PartialsNavigationHeader />
    <Container class="grid">
      <SectionsPresale />
    </Container>
  </div>
  <transition name="fade">
    <UtilsOverlay v-if="!!currentPopup.component" />
  </transition>
  <transition name="popup-bounce">
    <component
      :is="currentPopup.component"
      v-if="!!currentPopup.component"
      v-bind="currentPopup.params"
      v-on="currentPopup.events"
    />
  </transition>
  <UtilsNotificationToast
    v-for="(notificationToast, i) in notificationsToast"
    :key="`notificationToast-${i}`"
    v-bind="notificationToast"
  />
</template>

<script setup lang="ts">
import type { NotificationBannerProps } from '@/composables/useNotificationBanner'
import type { NotificationToastProps } from '@/composables/useNotificationToast'
import { useDeviceStore } from '@/stores/device'
import { useImagesStore } from '@/stores/images'
import BrowserDetector from '@/assets/scripts/detectors/BrowserDetector.class'
import DeviceDetector from '@/assets/scripts/detectors/DeviceDetector.class'

type IPFSQuery = {
  image: string
}

const { logoHash, unrevealedHash } = useRuntimeConfig()

const [{ data: dataLogo }, { data: dataUnrevealed }] = await Promise.all([
  useAsyncData<IPFSQuery>('logo', () => $fetch(`https://craft-network.mypinata.cloud/ipfs/${logoHash}`)),
  useAsyncData<IPFSQuery>('unrevealed', () => $fetch(`https://craft-network.mypinata.cloud/ipfs/${unrevealedHash}`)),
])

useHead({
  link: [
    { rel: 'shortcut icon', href: dataLogo.value.image },
  ],
})

const { setBrowser, setDevice } = useDeviceStore()
const { setImage } = useImagesStore()
const { bus, events } = useEventsBus()
const { listenIconex } = useIconexListener()
const {
  currentPopup,
  POPUP_CLOSE_CURRENT,
  POPUP_HANDLE_GUARD,
  POPUP_CALL_ACTION,
} = usePopupMethods()

setImage('logo', dataLogo.value.image)
setImage('unrevealed', dataUnrevealed.value.image)

const notificationsBanner = useState<NotificationBannerProps>('notifications-banner')
const notificationsToast = useState<NotificationToastProps[]>('notifications-toast')

watch(() => bus.value.get(events.POPUP_CLOSE), POPUP_CLOSE_CURRENT)
watch(() => bus.value.get(events.POPUP_GUARD), POPUP_HANDLE_GUARD)
watch(() => bus.value.get(events.POPUP_ACTION), POPUP_CALL_ACTION)

onBeforeMount(() => {
  const { browser } = new BrowserDetector()
  const checks = new DeviceDetector()
  setBrowser(browser.toLowerCase())
  setDevice(checks)
  listenIconex()
})
</script>

<style lang="scss" module>
html,
body,
[id=__nuxt] {
  @apply h-full;
}
</style>
