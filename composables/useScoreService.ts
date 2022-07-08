import axios from 'axios'
import IconService from 'icon-sdk-js'
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

  return {
    SCORECallReadOnly,
    getBlockData,
    getTxResult,
  }
}
