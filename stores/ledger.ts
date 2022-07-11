import { defineStore } from 'pinia'

import axios from 'axios'
import TransportWebHID from '@/assets/scripts/libs/@ledgerhq/hw-transport-webhid/TransportWebHID'
import IconService from 'icon-sdk-js'
import Icx from '@/assets/scripts/libs/hw-app-icx/Icx'

import { useUserStore } from '@/stores/user'

const { iconNetwork } = useRuntimeConfig()
const isTestnet = iconNetwork === 'testnet'
const url = isTestnet ? 'https://sejong.net.solidwallet.io/' : 'https://ctz.solidwallet.io/'
const nid = isTestnet ? '53' : '1'
const provider = new IconService.HttpProvider(`${url}api/v3`)
const iconService = new IconService(provider)

type SignatureKey = string | SignatureKey[]

type LedgerStatus = {
  isFetching: boolean
  currentPage: number
  error: string | null
}

type LedgerAddressData = {
  id: number
  address: string
  balance: number
  path: string
  isLoading: boolean
}

type LedgerAddressesList = LedgerAddressData[]

const serialize = (array: SignatureKey[]): string => array
  .filter((item) => !Array.isArray(item) || item.length)
  .map((item) => (Array.isArray(item) ? `{${serialize(item)}}` : item))
  .join('.')

export const useLedgerStore = defineStore('ledger-store', () => {
  const { emit, events } = useEventsBus()
  const { notify } = useNotificationToast()
  const { loginUser } = useUserStore()
  const ITEMS_PER_PAGE = 5 as const

  // States
  const addressPath = ref<string>('')
  const ledgerAddresses = ref<LedgerAddressesList>([])
  const ledgerStatus = reactive<LedgerStatus>({
    isFetching: true,
    currentPage: 0,
    error: '',
  })

  // Actions
  const BROADCAST_LEDGER_TX = async (txObj): Promise<string> => new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      data: txObj,
      url: `${url}api/v3`,
    }
    axios(options)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data.result)
        } else {
          reject(new Error('A JSONRPC error occured. It may be related to your balance or network condition.'))
        }
      })
      .catch(() => {
        reject(new Error('A JSONRPC error occured. It may be related to your balance or network condition.'))
      })
  })
  const HANDLE_LEDGER_RPC = async (payload) => {
    try {
      const {
        value,
        from,
        to,
        data,
        stepLimit,
        timestamp,
      } = payload.params
      const transport = await TransportWebHID.create()
      const icx = new Icx(transport)
      const storePath = addressPath.value
      const serialized = serialize([
        'icx_sendTransaction',
        ...[
          'data',
          [
            'method',
            data.method,
            Object.entries(data.params)
              .sort(([a], [b]) => Number(a > b) - 0.5)
              .reduce((accu, curr) => [...accu, ...curr], []),
          ],
        ],
        ...['dataType', 'call'],
        ...['from', from],
        ...['nid', `0x${nid}`],
        ...['nonce', '0x1'],
        ...['stepLimit', stepLimit],
        ...['timestamp', timestamp],
        ...['to', to],
        ...value ? ['value', value] : [],
        ...['version', '0x3'],
      ])

      const signature = await icx.signTransaction(storePath, serialized)
      const txObj = { ...payload }
      txObj.params.signature = signature.signedRawTxBase64
      return await BROADCAST_LEDGER_TX(txObj)
    } catch (error) {
      throw new Error(error)
    }
  }
  const HANDLE_LEDGER_SIGN = async (payload: { hash: string, from: string }) => {
    try {
      const transport = await TransportWebHID.create()
      const icx = new Icx(transport)
      const storePath = addressPath.value
      const serialized = serialize([
        'icx_sendTransaction',
        ...[
          'data',
          [
            'method',
            'ledgerSign',
            'params',
            [
              'hash',
              payload.hash,
            ],
          ],
        ],
        ...['dataType', 'call'],
        ...['from', payload.from],
        ...['nid', '0x1'],
        ...['nonce', '0x1'],
        ...['stepLimit', '0x0'],
        ...['timestamp', '0x0'],
        ...['to', 'cx0000000000000000000000000000000000000000'],
        ...['version', '0x3'],
      ])
      const signature = await icx.signTransaction(storePath, serialized)

      return signature.signedRawTxBase64
    } catch (error) {
      throw new Error(error)
    }
  }
  const dipsatchLedger = async ({ type, payload }) => {
    try {
      if (addressPath.value) {
        return await (
          type === 'REQUEST_JSON-RPC'
            ? HANDLE_LEDGER_RPC(payload)
            : HANDLE_LEDGER_SIGN(payload)
        )
      }
      throw new Error('Ledger Path error. Please log out and log in again')
    } catch (error) {
      throw new Error(error.statusCode === 27013 ? 'The transaction has been denied by the user' : error.message)
    }
  }
  const getLedgerAddresses = async (page: number): Promise<LedgerAddressesList> => {
    try {
      const transport = await TransportWebHID.create()
      const icx = new Icx(transport)

      const ledgerBook: LedgerAddressesList = await Promise.all([...new Array(ITEMS_PER_PAGE)].map(async (_, index) => {
        const id = ITEMS_PER_PAGE * page + index
        const { address } = await icx.getAddress(`44'/4801368'/0'/0'/${id}'`)
        const result = await iconService.getBalance(String(address)).execute()
        const balance = IconService.IconConverter.toNumber(result) / 10 ** 18
        return {
          id,
          address: String(address),
          path: `44'/4801368'/0'/0'/${id}'`,
          balance,
          isLoading: false,
        } as LedgerAddressData
      }))

      return ledgerBook
    } catch (error) {
      throw new Error(error)
    }
  }
  const selectLedgerAddress = async <A extends LedgerAddressData>(address: A['address'], path: A['path']): Promise<void> => {
    const currentLedgerAddress = ledgerAddresses.value.find((ledgerAddress) => ledgerAddress.address === address)
    currentLedgerAddress.isLoading = true

    try {
      addressPath.value = path
      loginUser({ address, wallet: 'ledger' })
      emit(events.POPUP_CLOSE, { handlePending: true })
      notify.success({
        title: 'Log in successful',
        timeout: 5000,
      })
    } catch (error) {
      notify.error({
        title: 'Error',
        message: error,
        timeout: 5000,
      })
    } finally {
      currentLedgerAddress.isLoading = false
    }
  }
  const setLedgerPage = async (page: number): Promise<void> => {
    ledgerStatus.isFetching = true
    ledgerStatus.error = ''

    getLedgerAddresses(page)
      .then((result) => {
        ledgerAddresses.value = result
        ledgerStatus.currentPage = page
      })
      .catch((error) => {
        ledgerStatus.error = error
        notify.error({
          title: 'Error',
          message: error,
          timeout: 5000,
        })
      })
      .finally(() => {
        ledgerStatus.isFetching = false
      })
  }

  return {
    // States
    ledgerAddresses,
    ledgerStatus,

    // Actions
    dipsatchLedger,
    selectLedgerAddress,
    setLedgerPage,
  }
})
