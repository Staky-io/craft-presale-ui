<template>
  <div class="grid gap-32 place-content-center place-items-center">
    <div class="grid gap-40 m:grid-flow-col">
      <div class="grid gap-20 content-between self-center">
        <div class="grid">
          <client-only>
            <div
              class="grid gap-6 grid-flow-col items-center justify-start"
              :class="isLive === null
                ? 'text-primary'
                : {
                  'text-success': isLive,
                  'text-error': !isLive,
                }
              "
            >
              <UtilsIcon
                name="Dot"
                class="w-12 h-12"
              />
              <span class="uppercase typo-capital">
                Public sale is {{ isLive ? 'live' : 'closed' }}
              </span>
            </div>
            <div
              v-if="isWhitelistEnabled"
              class="grid mt-12 gap-6 grid-flow-col items-center justify-start text-primary"
            >
              <span class="uppercase typo-capital">
                Whitelist is enabled and your are <span :class="isWhitelisted ? '' : 'text-error'">{{ isWhitelisted ? 'whitelisted' : 'not whitelisted' }}</span>
              </span>
            </div>
          </client-only>
          <h1 class="mt-12 mb-4 text-grey-900 typo-h1">
            Public sale
          </h1>
          <p class="text-grey-900 typo-body">
            Mint <span class="typo-body-bold">a NFT from {{collection}}</span> and earn <a href="https://craft.network/cft" target="blank" class="text-craft">$CFT tokens</a>
          </p>
        </div>
        <div class="grid gap-12">
          <ControlsFormInput
            v-model="v$.mintNumber.$model"
            :errors="v$.mintNumber.$errors"
            type="number"
            :min="0"
            :max="remainingMintable"
            placeholder="Amount"
          />
          <div class="grid gap-12 grid-flow-col justify-between items-center">
            <span class="text-left text-primary typo-caption-semibold">Total</span>
            <div class="grid gap-4 grid-flow-col items-center">
              <UtilsIcon
                name="Logo/Icon"
                class="w-12 h-12 text-[#00AC97]"
              />
              <span class="text-right text-grey-400 typo-caption-semibold">{{ formStates.mintNumber * price }}</span>
            </div>
          </div>
        </div>
        <ControlsButtonAction
          type="submit"
          size="lg"
          :is-locked="!isLive || (isWhitelistEnabled && !isWhitelisted)"
          @click="presaleMintOnClick"
        >
          Mint
        </ControlsButtonAction>
      </div>
      <div class="w-288 xxs:w-320 l:w-384 h-288 xxs:h-320 l:h-384">
        <client-only>
          <img
            :src="currentImage"
            alt="Unrevealed"
            class="w-full h-full object-cover"
          >
          <template v-if="isLive && totalMintable">
            <div class="relative mt-12 w-full h-4 bg-grey-200 text-center">
              <div
                class="absolute to-)0 bottom-0 left-0 h-full bg-primary"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </template>
          <div class="grid text-center">
            <span class="font-furore text-24 text-primary">{{remainingMintable}}</span>
            <span class="typo-caption-s text-grey-400">remaining</span>
          </div>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { required, decimal } from '@vuelidate/validators'
import { useImagesStore } from '@/stores/images'
import { useUserStore } from '@/stores/user'

type FormStates = {
  mintNumber: number
}

type FormValidators =
  | typeof required
  | typeof decimal

type FormRules = {
  [key in keyof FormStates]: Record<string, FormValidators>
}

const { collection } = useRuntimeConfig()

const { emit, events } = useEventsBus()
const { notify } = useNotificationToast()
const { SCORECallReadOnly } = useScoreService()
const { images } = storeToRefs(useImagesStore())
const { isLoggedIn, address } = storeToRefs(useUserStore())

const totalMintable = ref<number>(0)
const remainingMintable = ref<number>(totalMintable.value)
const progress = ref<number>(0)
const price = ref<number>(200)
const isLoaded = ref<boolean>(false)
const isLive = ref<boolean>(false)
const isWhitelisted = ref<boolean>(false)
const isWhitelistEnabled = ref<boolean>(false)
const mintLimit = ref<number>(0)
const userMintCount = ref<number>(0)

const formStates = reactive<FormStates>({
  mintNumber: null,
})

const v$ = useVuelidate<FormStates, FormRules>({
  mintNumber: { required, decimal },
}, formStates)

const currentImage = computed<string>(() => images.value.unrevealed)

const checkPresale = async (): Promise<void> => {
  try {
    isLive.value = await SCORECallReadOnly('presaleOpened') !== '0x0'

    if (isLive.value) {
      totalMintable.value = parseInt(await SCORECallReadOnly('maxPresale'), 16)
      remainingMintable.value = totalMintable.value - parseInt(await SCORECallReadOnly('presaleId'), 16)
      progress.value = (remainingMintable.value / totalMintable.value) * 100
      price.value = parseInt(await SCORECallReadOnly('presalePrice'), 16) / (10 ** 18)
      mintLimit.value = parseInt(await SCORECallReadOnly('mintLimit'), 16)


      if (isLoggedIn.value) {
        isWhitelistEnabled.value = await SCORECallReadOnly('requireWhitelist') !== '0x0'
        isWhitelisted.value = await SCORECallReadOnly('isWhitelisted', { _address: address.value }) !== '0x0'
        userMintCount.value = parseInt(await SCORECallReadOnly('mintCount', { _address: address.value }), 16)
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
  } else if (mintLimit.value > 0 && (userMintCount.value + formStates.mintNumber) >= mintLimit.value) {
    notify.error({
      title: 'Error',
      message: 'You exceed the mint limit.',
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
        image: currentImage,
      },
      handleGuard: true,
    })
  }
}

onMounted(async () => {
  await checkPresale()
})
</script>
