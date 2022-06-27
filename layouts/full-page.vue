<template>
  <div class="grid grid-rows-auto-1fr h-full">
    <PartialsNavigationHeader />
    <Container class="grid">
      <slot />
    </Container>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" module>
html,
body,
[id=__nuxt] {
  @apply h-full;
}
</style>
