<template>
  <header class="sticky top-0 py-10 bg-white">
    <Container class="grid gap-20 grid-flow-col items-center justify-between">
      <div class="grid gap-10 grid-flow-col items-center justify-self-start">
        <img
          src="~/assets/images/logo.svg"
          :alt="title"
        >
        <div class="text-grey-800 text-12 font-extrabold uppercase">
          {{ title }}
        </div>
      </div>
      <div class="grid gap-10 grid-flow-col items-center justify-self-end">
        <a
          v-for="(externalLink, i) in externalLinks"
          :key="`externalLink-${i}`"
          :href="externalLink.url"
          class="text-grey-600 typo-ui-m transition-color duration-100 hover:text-primary"
        >
          {{ externalLink.name }}
        </a>
        <div class="grid gap-6 grid-flow-col items-center">
          <a
            v-for="(socialLink, i) in socialLinks"
            :key="`socialLink-${i}`"
            :href="socialLink.url"
            class="grid place-items-center w-20 h-20"
            :style="{ color: socialLink.color }"
          >
            <UtilsIcon
              :name="socialLink.icon"
              class="w-full h-full"
            />
          </a>
        </div>
        <client-only>
          <template v-if="isLoggedIn && truncatedAddress">
            <ControlsButtonAction version="secondary">
              {{ truncatedAddress }}
            </ControlsButtonAction>
            <button
              class="grid place-items-center w-40 h-40 text-error bg-error bg-opacity-15 rounded-full"
              @click="emit(events.POPUP_GUARD)"
            >
              <UtilsIcon
                name="Logout"
                class="w-20 h-20"
              />
            </button>
          </template>
          <ControlsButtonAction
            v-else
            @click="emit(events.POPUP_GUARD)"
          >
            Connect wallet
          </ControlsButtonAction>
        </client-only>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { IconsNames } from '@/composables/useIconsComponents'

type ExternalLink = {
  name: string
  url: string
}

type SocialLink = {
  icon: IconsNames
  url: string
  color: string
}

const { isLoggedIn, truncatedAddress } = storeToRefs(useUserStore())
const { emit, events } = useEventsBus()

const { collection } = useRuntimeConfig()

const title = ref<string>(collection)
const externalLinks = ref<ExternalLink[]>([
  { name: 'Guide', url: '' },
  { name: 'Marketplace', url: '' },
])
const socialLinks = ref<SocialLink[]>([
  { icon: 'Logo/Discord', url: '', color: '#667CD3' },
  { icon: 'Logo/Twitter', url: '', color: '#6FC4FE' },
  { icon: 'Logo/Telegram', url: '', color: '#00C0F1' },
])
</script>
