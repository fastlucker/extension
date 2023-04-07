import React from 'react'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'

import styles from './styles'

const Web3Screen = () => {
  const navigation = useNavigation()

  // Define a function to open the dapp in the web view
  const handleOpenDapp = (dappUrl) => {
    navigation.navigate(`${ROUTES.web3}-browser`, {
      state: {
        selectedDappUrl: dappUrl
      }
    })
  }

  return (
    <>
      <GradientBackgroundWrapper>
        <Wrapper hasBottomTabNav>
          <Button
            text={'UniSwap'}
            onPress={() => handleOpenDapp('https://app.uniswap.org/#/swap')}
          />
          <Button
            text={'PoolTogether'}
            onPress={() => handleOpenDapp('https://app.pooltogether.com/')}
          />
        </Wrapper>
      </GradientBackgroundWrapper>
    </>
  )
}

export default Web3Screen
