<template>
  <div class="relative grid gap-10 m:w-384 p-16 bg-primary bg-opacity-10 border-1 border-primary">
    <h3>
      Ref link - Generate 10 mint & earn
      <client-only>
        <span class="text-primary">1 free {{ collection }}</span>
      </client-only>
    </h3>
  </div>
</template>

<script setup lang="ts">
const { collection } = useRuntimeConfig()
</script>
