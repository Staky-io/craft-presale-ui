<template>
  <component
    :is="to ? NuxtLink : 'button'"
    class="grid gap-10 grid-flow-col place-content-center place-items-center px-24 rounded-15 whitespace-nowrap select-none transition-default duration-200"
    :class="[
      isLocked
        ? 'bg-grey-000 text-grey-400 pointer-events-none'
        : {
          // Version
          'text-white bg-primary': version === 'primary',
          'text-primary bg-primary bg-opacity-5 border-1 border-primary border-opacity-0 hover:border-opacity-100 focus:border-opacity-100': version === 'secondary',
          'text-white bg-success': version === 'success',
          'text-white bg-warning': version === 'warning',
          'text-white bg-error': version === 'error',
          'text-white bg-info': version === 'info',
        },
      {
        // Size
        'h-32 typo-ui-s': size === 'sm',
        'h-40 typo-ui-m': size === 'md',
        'h-48 typo-ui-l': size === 'lg',
      },
    ]"
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
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

type Size =
  | 'sm'
  | 'md'
  | 'lg'

type Props = {
  version?: Version
  size?: Size
  to?: NuxtLinkProps
  target?: '_self' | '_blank' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  copiedText?: string
  isLocked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  version: 'primary',
  size: 'md',
  to: null,
  target: null,
  type: null,
  copiedText: '',
  isLocked: false,
})

const { copyText } = useCopyText()
const { NuxtLink } = useNuxtLink()

const onClick = (): void => {
  if (props.copiedText) {
    copyText(props.copiedText)
  }
}
</script>
