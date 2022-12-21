import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@modules/common/components/Button'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useNetwork from '@modules/common/hooks/useNetwork'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

export type ExternalSignerBottomSheetType = {
  sheetRef: any
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

export type QuickAccBottomSheetType = {
  sheetRef: any
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

export type HardwareWalletBottomSheetType = {
  sheetRef: any
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

interface Props {
  isLoading: boolean
  approve: any
  resolve: any
  isDeployed: boolean | null
  hasPrivileges: boolean | null
}

const SignActions = ({ isLoading, approve, resolve, isDeployed, hasPrivileges }: Props) => {
  const { t } = useTranslation()
  const { network } = useNetwork()

  return (
    <View>
      {isDeployed === null && (
        <View style={[spacings.mbMd, flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}>
          <Spinner />
        </View>
      )}
      {isDeployed === false && (
        <View style={[spacings.mbMd, spacings.phSm]}>
          <Text appearance="danger" fontSize={12}>
            {t("You can't sign this message yet.")}
          </Text>
          <Text appearance="danger" fontSize={12}>
            {t(
              `You need to complete your first transaction on ${network?.name} to be able to sign messages.`
            )}
          </Text>
        </View>
      )}
      {!hasPrivileges && (
        <View style={[spacings.mbMd, spacings.phSm]}>
          <Text appearance="danger" fontSize={12}>
            {t('You do not have the privileges to sign this message.')}
          </Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            type="danger"
            text={t('Reject')}
            onPress={() => resolve({ message: t('signature denied') })}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            text={isLoading ? t('Signing...') : t('Sign')}
            onPress={approve}
            disabled={isLoading || !isDeployed || !hasPrivileges}
          />
        </View>
      </View>
    </View>
  )
}

export default SignActions
