import IconService from 'icon-sdk-js'

export const useScoreService = () => {
  const { iconNetwork, scoreAddress: _adr } = useRuntimeConfig()

  const isTestnet: boolean = iconNetwork === 'testnet'
  const url: string = isTestnet
    ? 'https://sejong.net.solidwallet.io/'
    : 'https://ctz.solidwallet.io/'

  const service = new IconService(new IconService.HttpProvider(`${url}api/v3`))

  const SCORECallReadOnly = async (_method: string, _params?: unknown): Promise<string> => {
    try {
      const txObj = new IconService.IconBuilder.CallBuilder()
        .to(_adr)
        .method(_method)
      const call = _params ? txObj.params(_params) : txObj

      return await service
        .call(call.build())
        .execute()
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    SCORECallReadOnly,
  }
}
