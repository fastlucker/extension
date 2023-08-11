import React from 'react'
import { View } from 'react-native'

import AfterInteractions from '@common/components/AfterInteractions'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Tokens from '../Tokens'

// TODO props
interface Props {
  type: 'tokens' | 'collectibles'
  tokens: []
}

const Assets = ({ type, tokens }: Props) => {
  // eslint-disable-next-line no-lone-blocks
  {
    /* // TODO: Implementation on AfterInteractions when TokensListLoader is created */
  }
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
          <Tokens tokens={tokens} />
        </AfterInteractions>
      )}
      {/* {type === 'collectibles' && (
       TODO: Collectibles
      )} */}
    </View>
  )
}

export default React.memo(Assets)
