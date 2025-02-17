import compounderAbi from 'config/abi/compounder.json'
import cakeAbi from 'config/abi/cake.json'
import { getCakeAddress, getCakeVaultAddress } from 'utils/addressHelpers'
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

    const balanceCalls = [
      {
        address: getCakeAddress(),
        name: 'balanceOf',
        params: [account],
      },
    ]
    const [balance] = await multicall(cakeAbi, balanceCalls)

    return {
      isLoading: false,
      userShares: userContractResponse[0].toString(),
      lastDepositedTime: userContractResponse[1].toString(),
      cakeAtLastUserAction: userContractResponse[2].toString(),
      lastUserActionTime: userContractResponse[3].toString(),
      cakeBalance: balance.toString(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
      cakeBalance: '0',
    }
  }
}

export default fetchVaultUser
