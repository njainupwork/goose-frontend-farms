import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from '@pancakeswap-libs/uikit'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  cakePrice?: BigNumber
  apy?: BigNumber
}

const ApyButton: React.FC<ApyButtonProps> = ({ cakePrice, apy }) => {
  const [onPresentApyModal] = useModal(<ApyCalculatorModal cakePrice={cakePrice} apy={apy} />)

  return (
    <IconButton onClick={onPresentApyModal} variant="text" size="sm" ml="4px">
      <CalculateIcon />
    </IconButton>
  )
}

export default ApyButton
