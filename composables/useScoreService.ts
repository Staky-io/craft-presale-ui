import axios from 'axios'
import IconService from 'icon-sdk-js'

export const useScoreService = () => {
  const { iconNetwork, scoreAddress } = useRuntimeConfig()

  const isTestnet: boolean = iconNetwork === 'testnet'
  const url: string = isTestnet
    ? 'https://sejong.net.solidwallet.io/'
    : 'https://ctz.solidwallet.io/'

  const service = new IconService(new IconService.HttpProvider(`${url}api/v3`))

  const SCORECallReadOnly = async (_method: string, _params?: unknown): Promise<string> => {
    try {
      const txObj = new IconService.IconBuilder.CallBuilder()
        .to(scoreAddress)
        .method(_method)
      const call = _params ? txObj.params(_params) : txObj

      return await service
        .call(call.build())
        .execute()
    } catch (error) {
      throw new Error(error)
    }
  }

  const getBlockData = async ({ blockHash }) => {
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

  const getTxResult = async ({ hash }) => {
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
