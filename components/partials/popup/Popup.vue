<template>
  <div
    class="fixed top-0 left-0 grid w-screen h-screen z-100 py-10"
    @click="closeOnClick"
  >
    <Container class="grid">
      <div
        class="grid gap-24 content-start justify-self-center self-center w-full p-20 bg-white rounded-15 transition-width duration-200"
        :class="{
          's:w-256': size === 's',
          's:w-320': size === 'm',
          's:w-576': size === 'l',
        }"
        @click.stop
      >
        <div class="grid gap-10 grid-flow-col items-center justify-between">
          <h3 class="text-grey-900 typo-h2">
            <slot name="header" />
          </h3>
          <button
            class="grid place-items-center w-20 h-20 text-grey-400 transition-color hover:text-primary"
            @click="closeOnClick"
          >
            <UtilsIcon
              name="Cross"
              class="w-full h-full"
            />
          </button>
        </div>
        <slot name="body" />
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
type Size = 's' | 'm' | 'l'

type Props = {
  size?: Size
}

withDefaults(defineProps<Props>(), {
  size: 's',
})

const { emit, events } = useEventsBus()

const closeOnClick = (): void => {
  emit(events.POPUP_CLOSE)
}

const closeOnEscape = ({ key }: KeyboardEvent): void => {
  if (key === 'Escape') {
    closeOnClick()
  }
}

onMounted(() => {
  window.addEventListener('keydown', closeOnEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', closeOnEscape)
})
</script>
