import { TokenResult as TokenResultInterface } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { useContext } from 'react'
import { View } from 'react-native'

import AfterInteractions from '@common/components/AfterInteractions'
import { AssetsToggleContext } from '@common/modules/dashboard/contexts/assetsToggleContext'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Tokens from '../Tokens'

// TODO props
interface Props {
  tokens: any[] | TokenResultInterface[]
}

const Assets = ({ tokens }: Props) => {
  const { type } = useContext(AssetsToggleContext)

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
        /**
         * TODO: Implementation on AfterInteractions
         * when TokensListLoader is created
         */
        //   placeholder={<TokensListLoader />}
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
