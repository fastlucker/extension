import React, { useContext } from 'react'
import { View } from 'react-native'

import AfterInteractions from '@common/components/AfterInteractions'
import Panel from '@common/components/Panel'
import colors from '@common/styles/colors'
// import { AssetsToggleContext } from '@common/modules/dashboard/contexts/assetsToggleContext'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

// import Collectibles from '../Collectibles'
// import CollectiblesListLoader from '../Loaders/CollectiblesListLoader'
// import TokensListLoader from '../Loaders/TokensListLoader'
import Tokens from '../Tokens'

interface Props {}

const Assets = ({
  tokens,
  extraTokens,
  hiddenTokens,
  selectedAcc,
  isCurrNetworkBalanceLoading,
  isCurrNetworkProtocolsLoading,
  onAddExtraToken,
  onAddHiddenToken,
  onRemoveExtraToken,
  onRemoveHiddenToken
}: any) => {
  const type = 'tokens'
  //   const { type } = useContext(AssetsToggleContext)
  return (
    <View
      style={{
        ...flexbox.flex1,
        ...spacings.ph,
        ...spacings.pv,
        backgroundColor: colors.zircon,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
      }}
    >
      {type === 'tokens' && (
        <AfterInteractions
        //   placeholder={<TokensListLoader />}
        // Enabled only when the list contains multiple items that slow down the rendering/animations
        //   enabled={tokens.length > 20}
        >
          <Tokens
            tokens={tokens}
            extraTokens={extraTokens}
            hiddenTokens={hiddenTokens}
            selectedAcc={selectedAcc}
            isCurrNetworkBalanceLoading={!!isCurrNetworkBalanceLoading}
            isCurrNetworkProtocolsLoading={!!isCurrNetworkProtocolsLoading}
            onAddExtraToken={onAddExtraToken}
            onAddHiddenToken={onAddHiddenToken}
            onRemoveExtraToken={onRemoveExtraToken}
            onRemoveHiddenToken={onRemoveHiddenToken}
          />
        </AfterInteractions>
      )}
      {/* {type === 'collectibles' && (
        <AfterInteractions
        //   placeholder={<CollectiblesListLoader />}
          // Enabled only when the list contains multiple items that slow down the rendering/animations
          enabled={collectibles.length > 5}
        >
          <Collectibles
            collectibles={collectibles}
            isCurrNetworkProtocolsLoading={isCurrNetworkProtocolsLoading}
          />
        </AfterInteractions>
      )} */}
    </View>
  )
}

export default React.memo(Assets)
