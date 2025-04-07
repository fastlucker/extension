import React, { FC } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import CopyIcon from '@common/assets/svg/CopyIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { isExtension } from '@web/constants/browserapi'

import getStyles from './styles'

interface Props {
  handleCopyText: () => void
  handleOpenExplorer: () => void
  style?: ViewStyle
  showCopyBtn: boolean
  showOpenExplorerBtn: boolean
}

const Buttons: FC<Props> = ({
  handleCopyText,
  handleOpenExplorer,
  style = {},
  showCopyBtn,
  showOpenExplorerBtn
}) => {
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={[styles.buttons, style]}>
      {showOpenExplorerBtn && (
        <Pressable style={styles.openExplorer}>
          <OpenIcon
            width={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 16}
            height={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 16}
            color={theme.primary}
          />
          <Text
            fontSize={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 16 : 14}
            appearance="primary"
            weight="medium"
            style={styles.openExplorerText}
            onPress={handleOpenExplorer}
          >
            Open explorer
          </Text>
        </Pressable>
      )}
      {showCopyBtn && (
        <Button
          style={{
            width: IS_MOBILE_UP_BENZIN_BREAKPOINT || isExtension ? 200 : '100%',
            ...(IS_MOBILE_UP_BENZIN_BREAKPOINT || isExtension ? spacings.mlLg : {}),
            ...(IS_MOBILE_UP_BENZIN_BREAKPOINT || isExtension ? spacings.mb0 : spacings.mbMd)
          }}
          onPress={handleCopyText}
        >
          <CopyIcon color="#fff" />
          <Text style={{ color: '#fff', ...spacings.mlSm }} fontSize={16} weight="medium">
            Copy link
          </Text>
        </Button>
      )}
    </View>
  )
}

export default Buttons
