import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal } from '@pancakeswap-libs/uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address } from 'config/constants/types'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

export interface ExpandableSectionProps {
  totalStaked: string
  lpLabel?: string
  performanceFee: number
  tokenAddress: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({ totalStaked, lpLabel, performanceFee, tokenAddress }) => {
  const explorerLink = `https://mumbai.polygonscan.com/token/${tokenAddress}`
  const swapLink = `https://exchange.goosedefi.com/#/swap/${tokenAddress}`
  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>Total Staked :</Text>
        <Text>
          {getFullDisplayBalance(new BigNumber(totalStaked), 18, 2)} {lpLabel}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Performance Fees :</Text>
        <Text>{performanceFee / 100} %</Text>
      </Flex>
      <Flex justifyContent="flex-start">
        <Link external href={explorerLink} bold={false}>
          View on Polygon
        </Link>
      </Flex>
      <Flex justifyContent="flex-start">
        <Link external href={swapLink} bold={false}>
          Get tokens
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
