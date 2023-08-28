import { TokenResult } from 'ambire-common/src/libs/portfolio/interfaces'
import React from 'react'
import { View, ViewStyle } from 'react-native'

import AfterInteractions from '@common/components/AfterInteractions'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Collectibles from '../Collectibles'
import Tokens from '../Tokens'

interface Props {
  openTab: 'tokens' | 'collectibles'
  tokens: TokenResult[]
}

// We do this instead of unmounting the component to prevent
// component rerendering when switching tabs.
const HIDDEN_STYLE: ViewStyle = { position: 'absolute', opacity: 0 }

const Assets = ({ tokens, openTab }: Props) => {
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
      <View
        pointerEvents={openTab !== 'tokens' ? 'none' : 'auto'}
        style={openTab !== 'tokens' ? HIDDEN_STYLE : {}}
      >
        <AfterInteractions
        /**
         * TODO: Implementation on AfterInteractions
         * when TokensListLoader is created
         */
        //   placeholder={<TokensListLoader />}
        >
          <Tokens tokens={tokens} />
        </AfterInteractions>
      </View>
      <View
        pointerEvents={openTab !== 'collectibles' ? 'none' : 'auto'}
        style={openTab !== 'collectibles' ? HIDDEN_STYLE : {}}
      >
        <Collectibles />
      </View>
    </View>
  )
}

export default React.memo(Assets)
