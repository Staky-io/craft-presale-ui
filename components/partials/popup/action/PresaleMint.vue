<template>
  <PartialsPopup>
    <template #header>
      <h2>
        <client-only>
          <template v-if="ACTION_PRESALEMINT.tx.hash">
            Your NFT has been minted!
          </template>
          <template v-else-if="ACTION_PRESALEMINT.isLoading || ACTION_PRESALEMINT.isWaiting">
            Minting...
          </template>
        </client-only>
      </h2>
    </template>
    <template #body>
      <transition
        name="fade-bounce"
        mode="out-in"
      >
        <!-- SUCCESS -->
        <div
          v-if="ACTION_PRESALEMINT.tx.hash"
          key="success"
          class="grid gap-20"
        >
          <img
            :src="image"
            alt="Unrevealed"
          >
          <span class="test-grey-600 typo-ui-m">
            Congratulations! The artwork has officially been minted as an NFT on the ICX blockchain to the collection {{ collection }}.
          </span>
          <!-- <UtilsTxLink :id="ACTION_PRESALEMINT.id" /> -->
          <ControlsButtonAction @click="closePopup">
            Close
          </ControlsButtonAction>
        </div>
        <!-- LOADING -->
        <div
          v-else-if="ACTION_PRESALEMINT.isLoading || ACTION_PRESALEMINT.isWaiting"
          key="loading"
          class="grid gap-20"
        >
          <img
            :src="image"
            alt="Unrevealed"
          >
          <span class="test-grey-600 typo-ui-m">
            Your NFT is currently minting. Please wait for few minutes.
          </span>
        </div>
      </transition>
    </template>
  </PartialsPopup>
</template>

<script setup lang="ts">
import IconService from 'icon-sdk-js'
import { storeToRefs } from 'pinia'
import { useLedgerStore } from '@/stores/ledger'
import { useUserStore } from '@/stores/user'

const { IconConverter, IconBuilder, IconAmount } = IconService

type Props = {
  amount: number
  price: number
  referrer?: string
  image: string
}

const props = defineProps<Props>()

const { CallTransactionBuilder } = IconBuilder

const { collection, iconNetwork, scoreAddress } = useRuntimeConfig()

const { emit, bus, events } = useEventsBus()
const { getBlockData, getTxResult } = useScoreService()
const { notify } = useNotificationToast()
const {
  ICONEX_HANDLE_CANCEL,
} = useIconexListener()

const { dipsatchLedger } = useLedgerStore()
const { address, wallet } = storeToRefs(useUserStore())

const nid = iconNetwork === 'testnet' ? '83' : '1'

const isGlobalListening = ref<boolean>(false)
const ACTION_PRESALEMINT = reactive<{
  type: string
  tx: Record<string, unknown>
  query: Record<string, unknown>
  isListening: boolean
  isWaiting: boolean
  isLoading: boolean
  isSuccess: boolean
}>({
  type: 'RPC',
  tx: {},
  query: {},
  isListening: false,
  isWaiting: false,
  isLoading: false,
  isSuccess: false,
})

const getPresaleMintQuery = async (): Promise<{
  jsonrpc: string
  method: string
  params: ReturnType<typeof IconConverter.toRawTransaction>
  id: number
}> => {
  const { amount, price, referrer } = props
  const stepLimit = `0x${(800000 * amount).toString(16)}`
  const tx = new CallTransactionBuilder()
    .from(address.value)
    .to(scoreAddress)
    .stepLimit(stepLimit)
    .nid(IconConverter.toBigNumber(nid))
    .nonce(IconConverter.toBigNumber('1'))
    .version(IconConverter.toBigNumber('3'))
    .timestamp((new Date()).getTime() * 1000)
    .value((IconAmount.of(price * amount, IconAmount.Unit.ICX).toLoop()))
    .method('presaleMint')
    .params({
      _amount: amount.toString(),
      ...referrer && { _referrer: referrer },
    })
    .build()

  return {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(tx),
    id: 1198,
  }
}

const makePresaleMint = async (hash): Promise<{ block: string, tx: { txHash: string } }> => new Promise((resolve, reject) => {
  try {
    const interval = setInterval(async () => {
      const tx = await getTxResult({ hash })
      if (tx.status === 1) {
        clearInterval(interval)

        const block = await getBlockData({ blockHash: tx.blockHash })

        resolve({ block, tx })
      } else {
        reject(tx.failure)
        clearInterval(interval)
      }
    }, 2000)
  } catch (error) {
    reject(error)
  }
})

const RESET_PRESALEMINT = () => {
  ACTION_PRESALEMINT.tx = {}
  ACTION_PRESALEMINT.query = {}
  ACTION_PRESALEMINT.isListening = false
  ACTION_PRESALEMINT.isWaiting = false
  ACTION_PRESALEMINT.isLoading = false
  ACTION_PRESALEMINT.isSuccess = false
}

const RESET_LISTENER = () => {
  isGlobalListening.value = false
  RESET_PRESALEMINT()
}

const CALLBACK_PRESALEMINT = async (hash: string) => {
  try {
    RESET_PRESALEMINT()
    ACTION_PRESALEMINT.tx = { hash }
    ACTION_PRESALEMINT.isSuccess = true
  } catch (error) {
    notify.error({
      title: 'Error',
      message: error,
      timeout: 5000,
    })
  }
}

const COMPLETE_PRESALEMINT = async (hash: string) => {
  try {
    ACTION_PRESALEMINT.isWaiting = false
    ACTION_PRESALEMINT.isLoading = true

    const { tx } = await makePresaleMint(hash)

    CALLBACK_PRESALEMINT(tx.txHash)
  } catch (error) {
    RESET_PRESALEMINT()

    notify.error({
      title: 'Error',
      message: error,
      timeout: 5000,
    })
  }
}

const HANDLE_RPC = async ({ error = '', payload }: { error?: string, payload?: string }) => {
  if (error) {
    RESET_LISTENER()

    notify.error({
      title: 'Error',
      message: error,
      timeout: 5000,
    })
  } else if (payload) {
    isGlobalListening.value = false
    if (ACTION_PRESALEMINT.type === 'RPC' && ACTION_PRESALEMINT.isListening) {
      ACTION_PRESALEMINT.isListening = false
      await COMPLETE_PRESALEMINT(payload)
    }
  }
}

const HANDLE_SIGN = ({ error = '', payload }) => {
  if (error) {
    RESET_LISTENER()

    notify.error({
      title: 'Error',
      message: error,
      timeout: 5000,
    })
  } else if (payload) {
    isGlobalListening.value = false
  }
}

const TX_ROUTER = async ({ type, payload }) => {
  if (!wallet.value || wallet.value === 'iconex') {
    window.dispatchEvent(new CustomEvent('ICONEX_RELAY_REQUEST', {
      detail: { type, payload },
    }))
  } else if (wallet.value === 'ledger') {
    try {
      const result = await dipsatchLedger({ type, payload })
      if (type === 'REQUEST_JSON-RPC') {
        HANDLE_RPC({ payload: result })
      } else {
        HANDLE_SIGN({ payload: result })
      }
    } catch (error) {
      HANDLE_RPC({ error: error.message })

      notify.error({
        title: 'Error',
        message: error.message,
        timeout: 5000,
      })
    }
  }
}

const DISPATCH_PRESALEMINT = async () => {
  const { amount, price, referrer } = props

  ACTION_PRESALEMINT.query = {
    address: address.value,
    score: scoreAddress,
    price,
    params: {
      _amount: amount.toString(),
      ...referrer && { _referrer: referrer },
    },
  }

  const query = await getPresaleMintQuery()

  isGlobalListening.value = true
  ACTION_PRESALEMINT.isWaiting = true
  ACTION_PRESALEMINT.isListening = true

  TX_ROUTER({ type: 'REQUEST_JSON-RPC', payload: query })
}

const closePopup = (): void => {
  RESET_PRESALEMINT()
  emit(events.POPUP_CLOSE)
}

watch(() => bus.value.get(events.ICONEX_CANCEL), () => {
  RESET_LISTENER()
  ICONEX_HANDLE_CANCEL({ error: 'Cancelled' })
})

watch(() => bus.value.get(events.ICONEX_RPC), HANDLE_RPC)

onMounted(async () => {
  await DISPATCH_PRESALEMINT()
})
</script>
