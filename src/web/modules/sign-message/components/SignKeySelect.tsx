import React from 'react'
import { Pressable, View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import { Portal } from '@gorhom/portal'
import { getTabLayoutPadding } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

type Props = {
  selectedAccountKeyStoreKeys: Key[]
  handleChangeSigningKey: (keyAddr: Key['addr'], keyType: Key['type']) => void
  isVisible: boolean
  handleClose: () => void
}

const SigningKeySelect = ({
  selectedAccountKeyStoreKeys,
  handleChangeSigningKey,
  isVisible,
  handleClose
}: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const settingsCtrl = useSettingsControllerState()

  if (!isVisible) return null

  return (
    <Portal hostName="global">
      <Pressable onPress={handleClose} style={styles.overlay} />
      <View
        style={[
          styles.container,
          {
            right: getTabLayoutPadding(maxWidthSize).paddingHorizontal
          }
        ]}
      >
        <Text style={styles.title} fontSize={16} weight="medium" appearance="secondaryText">
          Select a signing key
        </Text>
        {selectedAccountKeyStoreKeys.map((key, i) => (
          <Pressable
            onPress={() => handleChangeSigningKey(key.addr, key.type)}
            style={({ hovered }: any) => ({
              ...styles.signer,
              backgroundColor: hovered ? theme.secondaryBackground : 'transparent'
            })}
          >
            <Text weight="medium" fontSize={18}>
              {settingsCtrl.keyPreferences.find((x) => x.addr === key.addr && x.type === key.type)
                ?.label || `Key ${i + 1}`}
            </Text>
            <Text appearance="secondaryText" weight="regular" fontSize={16}>{`${key.addr.slice(
              0,
              16
            )}...${key.addr.slice(-10)}`}</Text>
          </Pressable>
        ))}
      </View>
    </Portal>
  )
}

export default SigningKeySelect
