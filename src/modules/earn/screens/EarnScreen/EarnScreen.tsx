import React from 'react'
import { ActivityIndicator } from 'react-native'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import AAVECard from '@modules/earn/components/AAVECard'
import AmbireCard from '@modules/earn/components/AmbireCard'
import YearnTesseractCard from '@modules/earn/components/YearnTesseractCard'
import { CardsVisibilityProvider } from '@modules/earn/contexts/cardsVisibilityContext'

const EarnScreen = () => {
  const { isCurrNetworkBalanceLoading } = usePortfolio()

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav>
        {!!isCurrNetworkBalanceLoading && <ActivityIndicator />}
        {!isCurrNetworkBalanceLoading && (
          <CardsVisibilityProvider>
            <>
              <AmbireCard />
              <AAVECard />
              <YearnTesseractCard />
            </>
          </CardsVisibilityProvider>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default EarnScreen
