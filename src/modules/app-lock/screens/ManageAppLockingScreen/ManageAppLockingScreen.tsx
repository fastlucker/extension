import React from 'react'

import { useTranslation } from '@config/localization'
import { APP_LOCK_STATES } from '@modules/app-lock/contexts/appLockContext/constants'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Toggle from '@modules/common/components/Toggle'
import Wrapper from '@modules/common/components/Wrapper'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import alert from '@modules/common/services/alert'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const ManageAppLockingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const {
    state,
    removeAppLock,
    lockOnStartup,
    lockWhenInactive,
    enableLockOnStartup,
    disableLockOnStartup,
    enableLockWhenInactive,
    disableLockWhenInactive
  } = useAppLock()
  const { hasBiometricsHardware } = useBiometrics()

  const handleOnRemoveAppLock = () =>
    alert(
      t('Remove app lock?'),
      t(
        'By removing the app lock you can open the Ambire app without PIN or biometrics unlock needed'
      ),
      [
        {
          text: t('Yes, remove'),
          onPress: async () => {
            await removeAppLock()

            addToast(t('App lock removed!') as string, { timeout: 5000 })
            navigation.navigate('dashboard')
          },
          style: 'destructive'
        },
        {
          text: t('Cancel'),
          style: 'cancel'
        }
      ]
    )

  const renderContent = () => {
    if (state === APP_LOCK_STATES.UNLOCKED) {
      return (
        <>
          <TextWarning>{t('In order to manage it, first you need to set app lock.')}</TextWarning>
          <Button text={t('Set app lock')} onPress={() => navigation.navigate('set-app-lock')} />
        </>
      )
    }

    return (
      <>
        <Panel
          type="filled"
          contentContainerStyle={styles.appLockingItemContainer}
          style={spacings.mbTy}
        >
          <Text fontSize={16} weight="regular" numberOfLines={1} style={flexboxStyles.flex1}>
            {t('Lock on startup')}
          </Text>
          <Toggle
            isOn={lockOnStartup}
            label={lockOnStartup ? t('Enabled') : t('Disabled')}
            onToggle={lockOnStartup ? disableLockOnStartup : enableLockOnStartup}
          />
        </Panel>
        <Panel
          type="filled"
          contentContainerStyle={styles.appLockingItemContainer}
          style={spacings.mb}
        >
          <Text fontSize={16} weight="regular" numberOfLines={1} style={flexboxStyles.flex1}>
            {t('Lock when inactive')}
          </Text>
          <Toggle
            isOn={lockWhenInactive}
            label={lockWhenInactive ? t('Enabled') : t('Disabled')}
            onToggle={lockWhenInactive ? disableLockWhenInactive : enableLockWhenInactive}
          />
        </Panel>
        <Button
          type="secondary"
          text={hasBiometricsHardware ? t('Change PIN or biometrics') : t('Change PIN')}
          onPress={() => navigation.navigate('set-app-lock')}
        />
        <Button type="secondary" text={t('Remove app lock')} onPress={handleOnRemoveAppLock} />
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>{renderContent()}</Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ManageAppLockingScreen
