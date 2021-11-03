import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { CakeVaultData, Farm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { convertSharesToCake } from 'views/AutoCompound/helpers'
import { useApprove, useCheckVaultApprovalStatus, useCompounderApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import address from '../../../../config/constants/contracts'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: CakeVaultData
  ethereum?: provider
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const lpAddress = address.cake[process.env.REACT_APP_CHAIN_ID]
  const lpName = 'Auto Compound'
  const { cakeAsBigNumber } = convertSharesToCake(
    new BigNumber(farm.userData.userShares),
    new BigNumber(farm.pricePerFullShare),
  )

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()

  const { onApprove } = useCompounderApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setLastUpdated()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setLastUpdated])

  const renderApprovalOrStakeButton = () => {
    return isVaultApproved ? (
      <StakeAction
        stakedBalance={cakeAsBigNumber}
        tokenBalance={new BigNumber(farm.userData.cakeBalance)}
        tokenName={lpName}
        pricePerFullShare={farm.pricePerFullShare}
      />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          EGG
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(999, 'Earned')}
        </Text>
      </Flex>
      {/* <HarvestAction earnings={earnings} pid={pid} /> */}
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(999, 'Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
