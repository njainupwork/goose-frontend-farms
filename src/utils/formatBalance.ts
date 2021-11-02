import BigNumber from 'bignumber.js'
import { BIG_TEN } from './bigNumber'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals))
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals))
}

export const convertSharesToCake = (
  shares: BigNumber,
  cakePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(cakePerFullShare, decimals)
  const amountInCake = new BigNumber(shares.multipliedBy(sharePriceNumber))
  const cakeAsNumberBalance = getBalanceNumber(amountInCake, decimals)
  const cakeAsBigNumber = getDecimalAmount(new BigNumber(cakeAsNumberBalance), decimals)
  const cakeAsDisplayBalance = getFullDisplayBalance(amountInCake, decimals, decimalsToRound)
  return { cakeAsNumberBalance, cakeAsBigNumber, cakeAsDisplayBalance }
}
