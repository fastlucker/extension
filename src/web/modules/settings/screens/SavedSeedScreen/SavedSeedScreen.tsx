import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import CopyIcon from '@common/assets/svg/CopyIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import PasswordConfirmation from '@web/modules/settings/components/PasswordConfirmation'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

import getStyles from './styles'

const SavedSeedScreen = () => {
  const { dispatch } = useBackgroundService()
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false)
  const keystoreState = useKeystoreControllerState()
  const [seed, setSeed] = useState<string | null>(null)
  const [blurred, setBlurred] = useState<boolean>(true)
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()

  const onPasswordConfirmed = () => {
    setPasswordConfirmed(true)
    dispatch({
      type: 'KEYSTORE_CONTROLLER_SEND_SEED_OVER_CHANNEL'
    })
  }

  useEffect(() => {
    const onReceiveOneTimeData = (data: any) => {
      if (!data.seed) return

      setSeed(data.seed)
    }

    eventBus.addEventListener('receiveOneTimeData', onReceiveOneTimeData)

    return () => eventBus.removeEventListener('addToast', onReceiveOneTimeData)
  }, [])

  const toggleKeyVisibility = useCallback(async () => {
    setBlurred((prev) => !prev)
  }, [])

  const handleCopyText = useCallback(async () => {
    if (!seed) return
    try {
      await setStringAsync(seed)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, seed])

  const returnToSecuritySettings = () => {
    navigate(ROUTES.securityAndPrivacy)
  }

  if (!keystoreState.hasKeystoreSavedSeed) {
    return (
      <Alert
        type="warning"
        style={spacings.mtTy}
        text={t("Currently, you don't have a saved seed in the extension")}
      />
    )
  }

  return (
    <View style={{ maxWidth: 440 }}>
      {!passwordConfirmed && (
        <PasswordConfirmation
          onPasswordConfirmed={onPasswordConfirmed}
          text="Please enter your device password to see your seed"
        />
      )}
      {passwordConfirmed && (
        <>
          <SettingsPageHeader title="Saved seed phrase" />
          <View
            style={[
              blurred ? styles.blurred : styles.notBlurred,
              spacings.pvMd,
              spacings.phMd,
              { backgroundColor: theme.secondaryBackground }
            ]}
          >
            <Text fontSize={14} color={theme.secondaryText}>
              {seed}
            </Text>
          </View>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter, spacings.mtSm]}>
            <Pressable
              onPress={handleCopyText}
              style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}
            >
              <Text fontSize={14} color={theme.secondaryText}>
                {t('Copy your seed')}
              </Text>
              <CopyIcon color={theme.secondaryText} style={spacings.mlTy} />
            </Pressable>
            <Pressable
              onPress={toggleKeyVisibility}
              style={[flexbox.flex1, flexbox.directionRowReverse, flexbox.alignCenter]}
            >
              {blurred ? (
                <VisibilityIcon color={theme.secondaryText} style={spacings.mlTy} />
              ) : (
                <InvisibilityIcon color={theme.secondaryText} style={spacings.mlTy} />
              )}
              <Text fontSize={14} color={theme.secondaryText}>
                {blurred ? t('Reveal seed') : t('Hide seed')}
              </Text>
            </Pressable>
          </View>
          <View style={spacings.mtXl}>
            <Alert
              size="sm"
              type="warning"
              title={t(
                'Warning: Never reveal your seed. Anyone with access to it can steal any assets held in any accounts derived from it'
              )}
            />
          </View>
          <Button
            type="secondary"
            style={spacings.mtTy}
            onPress={returnToSecuritySettings}
            text="Back"
          />
        </>
      )}
    </View>
  )
}

export default React.memo(SavedSeedScreen)
