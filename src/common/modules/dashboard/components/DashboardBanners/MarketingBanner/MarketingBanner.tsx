import React from 'react'
import { Pressable, View } from 'react-native'

import { MarketingBanner as MarketingBannerType } from '@ambire-common/interfaces/banner'
import AmbireBackgroundLogo from '@common/assets/svg/AmbireBackgroundLogo'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import ThemeColors, { THEME_TYPES, ThemeProps, ThemeType } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useBannersControllerState from '@web/hooks/useBannersControllerState'
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
interface BannerColors {
  background: string
  border: string
  logoColor: string
}

const typeBannerColorsMap: Record<string, BannerColors> = {
  updates: {
    background: '#9D7AFF',
    border: '#7B59E7',
    logoColor: '#7443F8'
  },
  rewards: {
    background: '#191B1F',
    border: '#323D73',
    logoColor: '#2D2467'
  },
  new: {
    background: '#B14904',
    border: '#CD6020',
    logoColor: '#E29101'
  },
  vote: {
    background: '#6C38F7',
    border: '#946EFD',
    logoColor: '#946EFD'
  },
  tips: {
    background: '#003A3C',
    border: '#3A6762',
    logoColor: '#188B89'
  }
}

const MarketingBanner: React.FC<Props> = ({ banner }) => {
  const { isTab } = getUiType()
  const { styles } = useTheme(getStyles)
  const { dismissBanner } = useBannersControllerState()
  const { text, type = 'updates', url } = banner
  const colors = typeBannerColorsMap[type]

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border
        }
      ]}
    >
      <View style={styles.backgroundLogo}>
        <AmbireBackgroundLogo color={typeBannerColorsMap[type]?.logoColor} />
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.plSm]}>
        <View
          style={{
            width: 32,
            height: 33,
            ...flexbox.directionRow,
            ...flexbox.alignCenter,
            ...flexbox.justifyCenter,
            ...spacings.mrSm
          }}
        >
          <Text fontSize={24}>{typeEmojiMap[type] || ''}</Text>
        </View>
        <Text
          weight="medium"
          fontSize={isTab ? 16 : 14}
          color={ThemeColors.primaryText[THEME_TYPES.DARK]}
        >
          {text}
        </Text>
      </View>

      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <View
          style={[
            common.borderRadiusPrimary,
            { minWidth: 80, backgroundColor: ThemeColors.primaryBackground[THEME_TYPES.DARK] }
          ]}
        >
          <Button
            testID="marketing-banner-button"
            size="small"
            type="secondary"
            hasBottomSpacing={false}
            submitOnEnter={false}
            style={{
              minWidth: 80,
              borderColor: ThemeColors.primary[THEME_TYPES.DARK]
            }}
            textStyle={{ color: ThemeColors.primary[THEME_TYPES.DARK] }}
            text="Open"
            onPress={() => {
              if (url) {
                window.open(url, '_blank', 'noopener,noreferrer')
              }
            }}
          />
        </View>

        <View>
          <Pressable
            onPress={() => {
              dismissBanner(banner.id)
            }}
            hitSlop={8}
            style={[
              spacings.mhSm,
              spacings.mvSm,
              spacings.pvTy,
              spacings.phTy,
              {
                borderRadius: 50,
                backgroundColor: ThemeColors.primaryBackground[THEME_TYPES.DARK]
              }
            ]}
          >
            <CloseIcon
              strokeWidth="2"
              width={10}
              height={10}
              color={ThemeColors.primary[THEME_TYPES.DARK]}
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default MarketingBanner
