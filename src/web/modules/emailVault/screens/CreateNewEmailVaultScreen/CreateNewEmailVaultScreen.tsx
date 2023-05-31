import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import useEmailLogin from '@common/modules/auth/hooks/useEmailLogin'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'
import EmailLoginForm from '@common/modules/auth/components/EmailLoginForm'
import flexbox from '@common/styles/utils/flexbox'

const CreateNewEmailVaultScreen = () => {
  const { t } = useTranslation()

  const { requiresEmailConfFor, pendingLoginAccount } = useEmailLogin()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={[styles.mainContentWrapper, flexbox.justifyCenter]}>
          <Text
            weight="medium"
            fontSize={20}
            color={colors.martinique}
            style={{ marginBottom: 55, textAlign: 'center' }}
          >
            {t(
              pendingLoginAccount || requiresEmailConfFor
                ? 'Email Confirmation Required'
                : 'Create Or Enter Email Vault'
            )}
          </Text>
          <EmailLoginForm createEmailVault />
        </View>
      </AuthLayoutWrapperMainContent>
      {!pendingLoginAccount && !requiresEmailConfFor && (
        <AuthLayoutWrapperSideContent backgroundType="beta">
          <Text weight="medium" style={spacings.mb} color={colors.zircon} fontSize={20}>
            {t('Email Vaults')}
          </Text>
          <Text weight="regular" style={spacings.mbTy} color={colors.zircon} fontSize={16}>
            {t(
              "Email vaults are stored in the cloud, on Ambire's infrastructure and they are used for recovery of smart accounts, recovery of your extension passphrase, as well as optionally backing up your keys."
            )}
          </Text>
        </AuthLayoutWrapperSideContent>
      )}
    </>
  )
}

export default CreateNewEmailVaultScreen
