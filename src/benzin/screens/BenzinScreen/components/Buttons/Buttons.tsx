import { setStringAsync } from 'expo-clipboard'
import React, { FC } from 'react'
import { Pressable, View } from 'react-native'

import CopyIcon from '@common/assets/svg/CopyIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '../../styles'
import getStyles from './styles'

interface Props {
  handleOpenExplorer: () => void
}

const Buttons: FC<Props> = ({ handleOpenExplorer }) => {
  const { addToast } = useToast()
  const { styles, theme } = useTheme(getStyles)

  const handleCopyText = async () => {
    try {
      await setStringAsync(window.location.href)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }

  return (
    <View style={styles.buttons}>
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
      <Button
        style={{
          width: IS_MOBILE_UP_BENZIN_BREAKPOINT ? 200 : '100%',
          ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mlLg : {}),
          ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb0 : spacings.mbMd)
        }}
        onPress={handleCopyText}
      >
        <CopyIcon color="#fff" />
        <Text style={{ color: '#fff', ...spacings.mlSm }} fontSize={16} weight="medium">
          Copy link
        </Text>
      </Button>
    </View>
  )
}

export default Buttons
