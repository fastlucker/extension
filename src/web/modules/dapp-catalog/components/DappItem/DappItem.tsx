import React from 'react'
import { Image, Pressable, View } from 'react-native'

import StarIcon from '@common/assets/svg/StarIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { Dapp } from '@web/extension-services/background/controllers/dapps'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

const DappItem = (dapp: Dapp) => {
  const { name, description, iconUrl, url, favorite } = dapp
  const { styles, theme } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()

  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.secondaryBackground,
      to: theme.tertiaryBackground
    }
  })

  return (
    <View style={styles.dappItemWrapper}>
      <AnimatedPressable
        style={[styles.container, animStyle]}
        onPress={() => openInTab(url)}
        {...bindAnim}
      >
        <View style={[flexbox.directionRow, spacings.mbSm]}>
          <Image source={{ uri: iconUrl }} style={styles.icon} />
          <View style={[flexbox.flex1, flexbox.justifySpaceBetween]}>
            <Pressable
              onPress={() => {
                dispatch({
                  type: 'DAPP_CONTROLLER_UPDATE_DAPP',
                  params: { ...dapp, favorite: !favorite }
                })
              }}
            >
              <StarIcon style={flexbox.alignSelfEnd} isFilled={favorite} />
            </Pressable>
            <Text weight="semiBold" fontSize={14} appearance="primaryText" numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>
        <Text fontSize={12} appearance="secondaryText" numberOfLines={4}>
          {description}
        </Text>
      </AnimatedPressable>
    </View>
  )
}

export default React.memo(DappItem)
