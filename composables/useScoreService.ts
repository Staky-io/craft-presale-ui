import axios from 'axios'
import IconService, { HttpProvider, IconBuilder, IconWallet, SignedTransaction } from 'icon-sdk-js'
import type TransactionResult from 'icon-sdk-js/build/data/Formatter/TransactionResult'

export type TxResult = {
  result?: {
    blockHash: string
    blockHeight: string
    eventLogs: unknown[]
    status: string
    to: string
  }
  error?: {
    code:number
    message:string
  }
}

export const useScoreService = () => {
  const { iconNetwork, scoreAddress } = useRuntimeConfig()

  const isTestnet: boolean = iconNetwork === 'testnet'
  const url: string = isTestnet
    ? 'https://sejong.net.solidwallet.io/'
    : 'https://ctz.solidwallet.io/'

  const nid: number = isTestnet ? 83 : 1

  const service = new IconService(new IconService.HttpProvider(`${url}api/v3`))

  const SCORECallReadOnly = async (method: string, params?: unknown): Promise<string> => {
    try {
      const txObj = new IconService.IconBuilder.CallBuilder()
        .to(scoreAddress)
        .method(method)
      const call = params ? txObj.params(params) : txObj

      return await service
        .call(call.build())
        .execute()
    } catch (error) {
      throw new Error(error)
    }
  }

  const getBlockData = async (blockHash: string): Promise<unknown> => {
    try {
      const options = {
        method: 'post',
        url: `${url}api/v3`,
        data: {
          jsonrpc: '2.0',
          method: 'icx_getBlockByHash',
          id: 1234,
          params: {
            hash: blockHash,
          },
        },
      }
      return (await axios(options)).data.result
    } catch (error) {
      throw new Error(error)
    }
  }

  const getTxResult = async (hash: string): Promise<TransactionResult> => {
    try {
      return await service.getTransactionResult(hash).execute()
    } catch (error) {
      throw new Error(error)
    }
  }
  const getStepLimit = async (
    from:string, method:string, score:string, params?: unknown, value?: number,
  ): Promise<string> => {
    const debug = (iconNetwork === 'testnet') ? 'https://sejong.net.solidwallet.io/api/v3d' : 'https://ctz.solidwallet.io/api/debug/v3'
    const stepLimit = (await axios.post(debug, {
      id: 1234,
      jsonrpc: '2.0',
      method: 'debug_estimateStep',
      params: {
        from,
        data: {
          method,
          params: params || null,
        },
        dataType: 'call',
        nid: `0x${parseFloat(nid).toString(16)}`,
        nonce: '0x1',
        timestamp: `0x${((new Date()).getTime() * 1000).toString(16)}`,
        to: score,
        value: value ? `0x${(value * (10 ** 18)).toString(16)}` : null,
        version: '0x3',

      },
    })).data.result
    return (stepLimit.toString())
  }

  return {
    SCORECallReadOnly,
    getBlockData,
    getTxResult,
    getStepLimit,
  }
}
