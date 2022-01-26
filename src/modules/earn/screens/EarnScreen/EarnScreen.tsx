import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import AAVECard from '@modules/earn/components/AAVECard/AAVECard'

import styles from './styles'

const EarnScreen = () => {
  const { isBalanceLoading } = usePortfolio()

  return (
    <Wrapper>
      {!!isBalanceLoading && <ActivityIndicator />}
      {!isBalanceLoading && (
        <View>
          <AAVECard />
        </View>
      )}
    </Wrapper>
  )
}

export default EarnScreen
