<template>
  <component
    :is="icon"
    class="text-current inline-block transition-all"
    :class="{
      'duration-100': transition === 'slow',
      'duration-200': !transition,
      'duration-400': transition === 'quick',
    }"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import type { IconsNames, IconsComponents } from '@/composables/useIconsComponents'

type Props = {
  name: IconsNames
  transition?: 'quick' | 'slow'
}

const icons = useIconsComponents()

const props = defineProps<Props>()

const icon = computed<IconsComponents>(() => icons[props.name])
</script>
