import React from 'react'
import { View } from 'react-native'

import AfterInteractions from '@common/components/AfterInteractions'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Tokens from '../Tokens'

// TODO props
interface Props {}

const Assets = ({
  type,
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
