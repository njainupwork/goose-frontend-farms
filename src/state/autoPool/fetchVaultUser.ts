import compounderAbi from 'config/abi/compounder.json'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

const fetchVaultUser = async (account: string) => {
  try {
    const calls = [
      {
        address: getCakeVaultAddress(),
        name: 'userInfo',
        params: [account],
      },
    ]
    const [userContractResponse] = await multicall(compounderAbi, calls)
    return {
      isLoading: false,
      userShares: userContractResponse[0].toString(),
      lastDepositedTime: userContractResponse[1].toString(),
      lastUserActionTime: userContractResponse[2].toString(),
      cakeAtLastUserAction: userContractResponse[3].toString(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser
