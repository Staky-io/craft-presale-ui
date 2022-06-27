<template>
  <PartialsPopup>
    <template #header>
      <client-only>
        You minted {{ amount }} {{ collection }}
      </client-only>
    </template>
    <template #body>
      <div>
        <!--  -->
      </div>
    </template>
  </PartialsPopup>
</template>

<script setup lang="ts">
type Props = {
  amount: number
  price: number
  referrer?: string
}

defineProps<Props>()

const { collection } = useRuntimeConfig()
</script>
