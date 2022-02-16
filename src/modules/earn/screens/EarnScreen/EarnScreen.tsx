import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import Wrapper from '@modules/common/components/Wrapper'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import AAVECard from '@modules/earn/components/AAVECard/AAVECard'
import YearnTesseractCard from '@modules/earn/components/YearnTesseractCard'

const EarnScreen = () => {
  const { isBalanceLoading } = usePortfolio()

  return (
    <Wrapper>
      {!!isBalanceLoading && <ActivityIndicator />}
      {!isBalanceLoading && (
        <View>
          <AAVECard />
          <YearnTesseractCard />
        </View>
      )}
    </Wrapper>
  )
}

export default EarnScreen
