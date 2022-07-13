<template>
  <header class="sticky top-0 py-10 bg-white">
    <Container class="grid gap-20 grid-flow-col items-center justify-between">
      <nuxt-link
        to="/"
        class="grid gap-10 grid-flow-col items-center justify-self-start"
      >
        <client-only>
          <img
            class="w-32 h-32 object-cover"
            :src="images.logo"
            :alt="title"
          >
          <div class="text-grey-800 text-12 font-extrabold uppercase">
            {{ title }}
          </div>
        </client-only>
      </nuxt-link>
      <div class="grid gap-12 grid-flow-col items-center justify-self-end">
        <div class="grid gap-4 grid-flow-col items-center">
          <a
            v-for="(externalLink, i) in externalLinks"
            :key="`externalLink-${i}`"
            :href="externalLink.url"
            class="
              px-8
              py-2
              text-grey-600
              typo-ui-m
              bg-primary
              bg-opacity-0
              rounded-5
              transition-default
              duration-100
              hover:text-primary
              hover:bg-opacity-5
              focus:text-primary
              focus:bg-opacity-5
            "
          >
            {{ externalLink.name }}
          </a>
        </div>
        <div class="grid gap-4 grid-flow-col items-center">
          <a
            v-for="(socialLink, i) in socialLinks"
            :key="`socialLink-${i}`"
            :href="socialLink.url"
            class="
              relative
              grid
              place-items-center
              w-32
              h-32
              before:content-['']
              before:absolute
              before:left-0
              before:top-0
              before:w-full
              before:h-full
              before:rounded-full
              before:bg-current
              before:opacity-0
              before:transition-opacity
              before:duration-100
              hover:before:opacity-5
              focus:before:opacity-5
            "
            :style="{ color: socialLink.color }"
          >
            <UtilsIcon
              :name="socialLink.icon"
              class="w-20 h-20"
            />
          </a>
        </div>
        <client-only>
          <template v-if="isLoggedIn && truncatedAddress">
            <ControlsButtonAction version="secondary">
              {{ truncatedAddress }}
            </ControlsButtonAction>
            <ControlsButtonIcon
              version="error"
              icon="Logout"
              @click="emit(events.POPUP_GUARD)"
            />
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
import { useImagesStore } from '@/stores/images'
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

const { images } = storeToRefs(useImagesStore())
const { isLoggedIn, truncatedAddress } = storeToRefs(useUserStore())
const { emit, events } = useEventsBus()

const { collection, scoreAddress } = useRuntimeConfig()

const title = ref<string>(collection)
const externalLinks = ref<ExternalLink[]>([
  { name: 'Guide', url: 'https://medium.com/@craftnetwork/tutorial-how-to-mint-an-nft-on-a-launchpad-presale-671914a5b3dd' },
  { name: 'Marketplace', url: `https://craft.network/collection/${scoreAddress}` },
])
const socialLinks = ref<SocialLink[]>([
  { icon: 'Logo/Discord', url: '', color: '#667CD3' },
  { icon: 'Logo/Twitter', url: '', color: '#6FC4FE' },
  { icon: 'Logo/Telegram', url: '', color: '#00C0F1' },
])
</script>
