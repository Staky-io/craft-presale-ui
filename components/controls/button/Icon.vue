<template>
  <component
    :is="to ? NuxtLink : 'button'"
    class="
      grid
      place-items-center
      w-40
      h-40
      bg-opacity-5
      border-1
      border-opacity-0
      rounded-full
      transition-border
      duration-100
      hover:border-opacity-100
      focus:border-opacity-100
    "
    :class="{
      'text-primary bg-primary border-primary': version === 'primary',
      'text-success bg-success border-success': version === 'success',
      'text-warning bg-warning border-warning': version === 'warning',
      'text-error bg-error border-error': version === 'error',
      'text-info bg-info border-info': version === 'info',
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
  >
    <UtilsIcon
      :name="icon"
      class="w-20 h-20"
    />
  </component>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app'
import type { IconsNames } from '@/composables/useIconsComponents'

type Version =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

type Props = {
  version?: Version
  to?: NuxtLinkProps
  target?: '_self' | '_blank' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  icon: IconsNames
}

withDefaults(defineProps<Props>(), {
  version: 'primary',
  to: null,
  target: null,
  type: null,
})

const { NuxtLink } = useNuxtLink()
</script>
