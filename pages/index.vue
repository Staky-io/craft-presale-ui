<template>
  <div class="grid gap-60 place-content-center place-items-center">
    <div class="grid gap-24 grid-flow-col">
      <div class="grid gap-24 content-between">
        <div>
          <h1 class="text-primary font-bold">
            Public sale
          </h1>
          <p v-if="referrer">
            Using {{ referrer }} as referrer
          </p>
        </div>
        <div class="grid gap-16 w-full">
          <div class="grid gap-8">
            <ControlsFormInput
              v-model="v$.mintNumber.$model"
              :errors="v$.mintNumber.$errors"
              type="number"
              :min="0"
              :max="remainingMintable"
            />
            <div class="grid gap-12 grid-flow-col justify-between items-center">
              <span class="text-left">Total</span>
              <div class="grid gap-4 grid-flow-col items-center">
                <span class="text-right">{{ formStates.mintNumber * price }}</span>
                <UtilsIcon
                  name="Logo/Icon"
                  class="w-12 h-12 text-[#00AC97]"
                />
              </div>
            </div>
          </div>
          <ControlsButtonAction
            type="submit"
            @click="presaleMintOnClick"
          >
            Mint
          </ControlsButtonAction>
        </div>
      </div>
      <img
        src="~/assets/images/unrevealed.png"
        alt="Unrevealed"
        class="w-320 h-320 object-cover"
      >
    </div>

    <span
      v-if="freeMinted"
      class="text-center"
    >
      Congratulations! You won <span class="text-primary">{{ freeMinted }}</span> free mints.
      <br>
      It will be airdropped to your wallet at the end of the public sale
    </span>

    <client-only>
      <DisplaysCardReference v-if="isLoggedIn && isWhitelisted" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { required, decimal } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'
import { serializeQuery } from '@/assets/scripts/helpers'

type FormStates = {
  mintNumber: number
}

type FormValidators =
  | typeof required
  | typeof decimal

type FormRules = {
  [key in keyof FormStates]: Record<string, FormValidators>
}

definePageMeta({
  layout: 'full-page',
})

useHead({
  titleTemplate: 'Presale - %s',
})

const { collection } = useRuntimeConfig()

await useFetch('/api/free-mints')
const route = useRoute()

const { emit, events } = useEventsBus()
const { notify } = useNotificationToast()
const { SCORECallReadOnly } = useScoreService()
const { isLoggedIn, address } = storeToRefs(useUserStore())

const freeMinted = ref<number>(0)
const referrer = ref<string>('')
const totalMintable = ref<number>(10000)
const remainingMintable = ref<number>(totalMintable.value)
const progress = ref<number>(0)
const price = ref<number>(200)
const isLoaded = ref<boolean>(false)
const isLive = ref<boolean>(false)
const isWhitelisted = ref<boolean>(false)
const isWhitelistEnabled = ref<boolean>(false)

const formStates = reactive<FormStates>({
  mintNumber: null,
})

const v$ = useVuelidate<FormStates, FormRules>({
  mintNumber: { required, decimal },
}, formStates)

const checkPresale = async (): Promise<void> => {
  try {
    isLive.value = await SCORECallReadOnly('presaleOpened') !== '0x0'

    if (isLive.value) {
      remainingMintable.value = totalMintable.value - parseInt(await SCORECallReadOnly('presaleId'), 16)
      progress.value = (remainingMintable.value / totalMintable.value) * 100
      price.value = parseInt(await SCORECallReadOnly('presalePrice'), 16) / (10 ** 18)

      if (isLoggedIn.value) {
        isWhitelistEnabled.value = await SCORECallReadOnly('requireWhitelist') !== '0x0'
        isWhitelisted.value = await SCORECallReadOnly('isWhitelisted', { _address: address.value }) !== '0x0'
      }
    }
  } catch (error) {
    throw new Error(error)
  } finally {
    isLoaded.value = true
  }
}

const presaleMintOnClick = (): void => {
  if (!isLoggedIn.value) {
    notify.error({
      title: 'Error',
      message: 'You need to log in first.',
      timeout: 5000,
    })
  }
  if (route.query?.ref === address.value) {
    notify.error({
      title: 'Error',
      message: 'You cannot self-refer.',
      timeout: 5000,
    })
  } else if (formStates.mintNumber > 200) {
    notify.error({
      title: 'Error',
      message: `You can only mint 200 ${collection} per transaction.`,
      timeout: 5000,
    })
  } else if (!formStates.mintNumber) {
    notify.error({
      title: 'Error',
      message: `You must mint at least 1 ${collection} to purchase.`,
      timeout: 5000,
    })
  } else if (formStates.mintNumber > remainingMintable.value) {
    notify.error({
      title: 'Error',
      message: `Not enough ${collection} remaining.`,
      timeout: 5000,
    })
  } else if (formStates.mintNumber <= remainingMintable.value) {
    emit(events.POPUP_ACTION, {
      name: 'PresaleMint',
      params: {
        amount: formStates.mintNumber,
        price: price.value,
        referrer: route.query?.ref,
      },
      handleGuard: true,
    })
  }
}

watch(() => address.value, async (adr) => {
  if (adr) {
    const { data } = await useFetch(serializeQuery('/api/free-mints', { address: address.value }))
    freeMinted.value = data.value as number
  }
}, { immediate: true })

onMounted(async () => {
  const { ref } = route.query
  if (ref && typeof ref === 'string') {
    referrer.value = ref
  }

  await checkPresale()
})
</script>
