import React from 'react'
import { Pressable, View } from 'react-native'

import { MarketingBanner as MarketingBannerType } from '@ambire-common/interfaces/banner'
import CloseIcon from '@common/assets/svg/CloseIcon'
import CommonButton, { Props as CommonButtonProps } from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

interface Props {
  banner: MarketingBannerType
}

const typeEmojiMap: Record<string, string> = {
  updates: '💜',
  rewards: '💎',
  new: '📢',
  vote: '✋',
  tips: '💡'
}

const MarketingBanner: React.FC<Props> = ({ banner }) => {
  const { isTab } = getUiType()
  const { styles, theme, themeType } = useTheme(getStyles)

  const { text, type = 'updates', url, startTime, endTime } = banner

  return (
    <View style={[styles.container]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{typeEmojiMap[type] || ''}</span>
        <span style={{ fontWeight: 500 }}>{text}</span>
      </div>

      <CommonButton
        testID="relayer-banner-button"
        size="small"
        style={[spacings.mlTy, spacings.ph, { minWidth: 80 }]}
        hasBottomSpacing={false}
        type="info"
        submitOnEnter={false}
        innerContainerStyle={(hovered: boolean) =>
          hovered ? { backgroundColor: theme.errorBackground } : { backgroundColor: 'transparent' }
        }
        text="Open"
        onPress={() => {
          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
          }
        }}
      />
    </View>
  )
}

export default MarketingBanner
