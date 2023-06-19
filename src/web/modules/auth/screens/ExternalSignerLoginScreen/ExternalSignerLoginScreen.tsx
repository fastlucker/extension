import React from 'react'
import { View, TextInput } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import Button from '@common/components/Button'
import styles from './styles'

const ExternalSignerLoginScreen = () => {
  const { t } = useTranslation()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={styles.container}>
          <Text
            weight="medium"
            fontSize={16}
            style={{ marginBottom: 50, ...spacings.mtXl, ...flexbox.alignSelfCenter }}
          >
            {t('Import Legacy Account')}
          </Text>

          <TextInput
            editable
            multiline
            numberOfLines={8}
            maxLength={40}
            placeholder="Enter a seed phrase or private key"
            onChangeText={(text) => onChangeText(text)}
            style={styles.textarea}
            placeholderTextColor={colors.martinique_65}
          />
          <Text
            style={[spacings.plTy, spacings.mbTy]}
            shouldScale={false}
            fontSize={16}
            weight="medium"
          >
            {t('Key label')}
          </Text>
          <TextInput
            editable
            multiline
            numberOfLines={1}
            maxLength={40}
            placeholder="Imported key on 21 Apr 2023"
            onChangeText={(text) => onChangeText(text)}
            style={styles.textarea}
            placeholderTextColor={colors.martinique_65}
          />
          <Button
            type="primary"
            size="large"
            text="Import Legacy Account"
            style={[flexbox.alignSelfCenter]}
          />
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text
          shouldScale={false}
          weight="medium"
          fontSize={16}
          style={spacings.mb}
          color={colors.zircon}
        >
          {t('Importing legacy accounts')}
        </Text>
        <Text shouldScale={false} fontSize={14} color={colors.zircon} style={spacings.mb}>
          {t(
            'By inserting a private key or a seed phrase, you can import traditional legacy accounts (also known as EOAs - externally owned accounts).\n\nIf you enter a seed phrase, you will be given a list of multiple legacy accounts to choose from.\n\nFor each legacy account you import, you also have the option to import a smart account, powered by the same private key. This smart account will have a different address. Smart accounts have many benefits, including account recovery, transaction batching and much more.'
          )}
        </Text>

        <Text
          shouldScale={false}
          weight="medium"
          fontSize={16}
          style={spacings.mb}
          color={colors.zircon}
        >
          {t('Key Label')}
        </Text>
        <Text fontSize={14} shouldScale={false} color={colors.zircon}>
          {t('The key label is any arbitrary name you choose for this key, entirely up to you.')}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default ExternalSignerLoginScreen
