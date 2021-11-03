import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { CakeVaultData, Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { useFarmFromPid, usePriceCakeBusd } from 'state/hooks'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BLOCKS_PER_YEAR } from 'config'
import Balance from 'components/Balance'
import { getCakeVaultEarnings } from 'views/AutoCompound/helpers'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  auto: CakeVaultData
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ auto, ethereum, account }) => {
  const cakePrice = usePriceCakeBusd()
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = 'cake-bnb.svg'

  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    new BigNumber(auto.userData.cakeAtLastUserAction),
    new BigNumber(auto.userData.userShares),
    new BigNumber(auto.pricePerFullShare),
    cakePrice.toNumber(),
  )

  const lastActionInMs = auto.userData.lastUserActionTime && parseInt(auto.userData.lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleDateString()

  const lpLabel = 'EGG'
  const farm = useFarmFromPid(0)
  const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18))
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)
  const apy = cakePrice.times(cakeRewardPerYear)

  return (
    <FCard>
      <StyledCardAccent />
      <CardHeading lpLabel={lpLabel} depositFee={auto.fees.performanceFee} farmImage={farmImage} tokenSymbol="Cake" />
      <Flex justifyContent="space-between" alignItems="center">
        <Text>{TranslateString(352, 'APR')}:</Text>
        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          <>
            <ApyButton cakePrice={cakePrice} apy={apy} />
            {apy.toString()}%
          </>
        </Text>
      </Flex>
      {hasAutoEarnings ? (
        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            <Balance fontSize="16px" value={autoCakeToDisplay} decimals={3} unit="EGG" />
            <Balance fontSize="16px" value={autoUsdToDisplay} decimals={2} unit="$" /> Earned since your last action
            <Text>{dateStringToDisplay}</Text>
          </Text>
        </Flex>
      ) : (
        <></>
      )}
      <CardActionsContainer farm={auto} ethereum={ethereum} account={account} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection totalStaked={auto.totalCakeInVault} lpLabel={lpLabel} />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
