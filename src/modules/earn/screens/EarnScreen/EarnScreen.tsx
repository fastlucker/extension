import React from 'react'
import { View } from 'react-native'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Spinner from '@modules/common/components/Spinner'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import AAVECard from '@modules/earn/components/AAVECard'
import AmbireCard from '@modules/earn/components/AmbireCard'
import YearnTesseractCard from '@modules/earn/components/YearnTesseractCard'
import { CardsVisibilityProvider } from '@modules/earn/contexts/cardsVisibilityContext'

const EarnScreen = () => {
  const { isCurrNetworkBalanceLoading, tokens, protocols, dataLoaded } = usePortfolio()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { addToast } = useToast()
  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav>
        {!!isCurrNetworkBalanceLoading && !dataLoaded && (
          <View
            style={[flexboxStyles.flex1, flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}
          >
            <Spinner />
          </View>
        )}
        {!(!!isCurrNetworkBalanceLoading && !dataLoaded) && (
          <CardsVisibilityProvider>
            <>
              <AmbireCard
                tokens={tokens}
                networkId={network?.id}
                selectedAcc={selectedAcc}
                addRequest={addRequest}
              />
              <AAVECard
                tokens={tokens}
                protocols={protocols}
                networkId={network?.id}
                selectedAcc={selectedAcc}
                addRequest={addRequest}
                addToast={addToast}
              />
              <YearnTesseractCard
                tokens={tokens}
                networkId={network?.id}
                selectedAcc={selectedAcc}
                addRequest={addRequest}
                addToast={addToast}
              />
            </>
          </CardsVisibilityProvider>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default EarnScreen
