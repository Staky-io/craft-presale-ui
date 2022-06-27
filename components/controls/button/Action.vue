<template>
  <component
    :is="to ? NuxtLink : 'button'"
    class="grid gap-10 grid-flow-col place-content-center place-items-center whitespace-nowrap select-none transition duration-200"
    :class="{
      '': version === 'primary',
    }"
    v-bind="{
      ...$attrs,
      ...Object.entries({
        to,
        target,
        type,
      })
        .filter(([_, value]) => !!value)
        .reduce((accu, [key, value]) => ({ ...accu, ...!!value && { [key]: value } }), {}),
    }"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app'

type Version =
  | 'primary'

type Props = {
  version?: Version
  to?: NuxtLinkProps
  target?: '_self' | '_blank' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  copiedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  version: 'primary',
  to: null,
  target: null,
  type: null,
  copiedText: '',
})

const { copyText } = useCopyText()
const { NuxtLink } = useNuxtLink()

const onClick = (): void => {
  if (props.copiedText) {
    copyText(props.copiedText)
  }
}
</script>
