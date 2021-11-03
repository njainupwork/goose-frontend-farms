import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { fetchCakeVaultUserData } from 'state/autoPool'
import { unstake, sousUnstake, sousEmegencyUnstake, autoUnstake, autoUnstakeMax } from 'utils/callHelpers'
import { useCompounder, useMasterchef, useSousChef } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

const SYRUPIDS = [5, 6, 3, 1, 22, 23]

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, isOldSyrup, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export const useAutoUnstake = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const compounder = useCompounder()

  const handleUnstake = useCallback(
    async (amount: string, isMax: boolean) => {
      if (!isMax) {
        const txHash = await autoUnstake(compounder, amount, account)
        dispatch(fetchCakeVaultUserData({ account }))
        console.info(txHash)
      } else {
        const txHash = await autoUnstakeMax(compounder, account)
        dispatch(fetchCakeVaultUserData({ account }))
        console.info(txHash)
      }
    },
    [account, dispatch, compounder],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
