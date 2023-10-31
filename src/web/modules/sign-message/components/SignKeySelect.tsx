import React from 'react'
import { Pressable, View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

type Props = {
  selectedAccountKeyStoreKeys: Key[]
  handleChangeSigningKey: (keyAddr: Key['addr'], keyType: Key['type']) => void
}

const SigningKeySelect = ({ selectedAccountKeyStoreKeys, handleChangeSigningKey }: Props) => {
  const { theme, styles } = useTheme(getStyles)
  return (
    <View style={styles.container}>
      <Text style={styles.title} fontSize={16} weight="medium" appearance="secondaryText">
        Select a signing key
      </Text>
      {selectedAccountKeyStoreKeys.map((key) => (
        <Pressable
          onPress={() => handleChangeSigningKey(key.addr, key.type)}
          style={({ hovered }: any) => ({
            ...styles.signer,
            backgroundColor: hovered ? theme.secondaryBackground : 'transparent'
          })}
        >
          <Text weight="medium" fontSize={18}>
            {key.label}
          </Text>
          <Text appearance="secondaryText" weight="regular" fontSize={16}>{`${key.addr.slice(
            0,
            16
          )}...${key.addr.slice(-10)}`}</Text>
        </Pressable>
      ))}
    </View>
  )
}

export default SigningKeySelect
