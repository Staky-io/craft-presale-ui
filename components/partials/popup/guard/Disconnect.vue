<template>
  <PartialsPopup>
    <template #header>
      Log out
    </template>
    <template #body>
      <div class="grid gap-10">
        <ControlsButtonAction version="secondary">
          {{ truncatedAddress }}
        </ControlsButtonAction>
        <ControlsButtonAction
          version="error"
          @click="logoutOnClick"
        >
          Disconnect
        </ControlsButtonAction>
      </div>
    </template>
  </PartialsPopup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const { truncatedAddress } = storeToRefs(useUserStore())

const { logoutUser } = useUserStore()
const { emit, events } = useEventsBus()

const logoutOnClick = (): void => {
  logoutUser()
  emit(events.POPUP_CLOSE)
}
</script>
