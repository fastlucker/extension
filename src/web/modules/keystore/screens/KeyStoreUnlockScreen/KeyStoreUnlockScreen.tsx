import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import AmbireLogoWithTextMonochrome from '@common/assets/svg/AmbireLogoWithTextMonochrome'
import LockIcon from '@common/assets/svg/LockIcon'
import UnlockScreenBackground from '@common/assets/svg/UnlockScreenBackground'
import Button from '@common/components/Button'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useDisableNavigatingBack from '@common/hooks/useDisableNavigatingBack'
import useElementSize from '@common/hooks/useElementSize'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings, { SPACING } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { POPUP_WIDTH } from '@web/constants/spacings'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const FOOTER_BUTTON_HIT_SLOP = { top: 10, bottom: 15 }
const isPopup = getUiType().isPopup
const KeyStoreUnlockScreen = () => {
  const contentContainerRef = useRef(null)
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { dispatch } = useBackgroundService()
  const keystoreState = useKeystoreControllerState()
  const { height } = useElementSize(contentContainerRef)
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'all',
    defaultValues: {
      password: ''
    }
  })

  useDisableNavigatingBack()

  useEffect(() => {
    if (keystoreState.errorMessage) {
      setError('password', {
        message: keystoreState.errorMessage
      })
    }
  }, [keystoreState.errorMessage, setError])

  useEffect(() => {
    if (keystoreState.errorMessage && !watch('password', '').length) {
      dispatch({ type: 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE' })
    }
  }, [keystoreState.errorMessage, watch, dispatch])

  useEffect(() => {
    if (keystoreState.isUnlocked) {
      navigate('/')
    }
  }, [navigate, keystoreState])

  const handleUnlock = useCallback(
    ({ password }: { password: string }) => {
      dispatch({
        type: 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET',
        params: { secretId: 'password', secret: password }
      })
    },
    [dispatch]
  )

  const panelSize = useMemo(() => {
    const MAX_SIZE = POPUP_WIDTH
    if (isPopup) return POPUP_WIDTH
    if (height > MAX_SIZE) return POPUP_WIDTH

    return height - 2 * SPACING
  }, [height])

  const Container = isPopup ? Fragment : TabLayoutWrapperMainContent

  return (
    <TabLayoutContainer
      withHorizontalPadding={!isPopup}
      backgroundColor={theme.secondaryBackground}
      header={
        !isPopup && (
          <Header withAmbireLogo mode="custom-inner-content">
            <View
              style={[
                flexbox.flex1,
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.justifyCenter
              ]}
            >
              <Text
                fontSize={20}
                weight="medium"
                style={[{ marginLeft: 18 + SPACING }, spacings.mr]}
              >
                {t('Welcome Back')}
              </Text>
              <LockIcon />
            </View>
          </Header>
        )
      }
    >
      <Container
        contentContainerStyle={[flexbox.alignCenter, spacings.pv0]}
        wrapperRef={contentContainerRef}
        withScroll={false}
      >
        <View style={[styles.container, { width: panelSize, height: panelSize }]}>
          <View style={styles.backgroundWrapper}>
            <View style={styles.backgroundSVG}>
              <UnlockScreenBackground />
            </View>
            {!!isPopup && (
              <View style={styles.panelHeader}>
                <View
                  style={[
                    flexbox.flex1,
                    flexbox.directionRow,
                    flexbox.alignCenter,
                    flexbox.justifyCenter
                  ]}
                >
                  <Text
                    fontSize={20}
                    weight="medium"
                    color="white"
                    style={[{ marginLeft: 18 + SPACING }, spacings.mr]}
                  >
                    {t('Welcome Back')}
                  </Text>
                  <LockIcon color="white" />
                </View>
              </View>
            )}
            <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
              <AmbireLogoWithTextMonochrome
                width={122}
                height={height < 530 && !isPopup ? 90 : 128}
              />
            </View>
            <View>
              <Text
                fontSize={14}
                weight="medium"
                color="white"
                style={[text.center, spacings.mbXl]}
              >
                {t('Easy and secure self-custody for the\nEthereum ecosystem')}
              </Text>
            </View>
          </View>
          <View
            style={[flexbox.alignCenter, flexbox.justifyCenter, spacings.pvLg, { minHeight: 240 }]}
          >
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  testID="passphrase-field"
                  onBlur={onBlur}
                  placeholder={t('Enter Your Password')}
                  autoFocus={isWeb}
                  onChangeText={onChange}
                  isValid={isValidPassword(value)}
                  value={value}
                  onSubmitEditing={handleSubmit((data) => handleUnlock(data))}
                  error={
                    errors.password &&
                    (errors.password.message ||
                      t('Please fill in at least 8 characters for password.'))
                  }
                  containerStyle={{ ...spacings.mbLg, width: 342 }}
                />
              )}
              name="password"
            />
            <Button
              testID="button-unlock"
              style={{ width: 342, ...spacings.mbLg }}
              disabled={
                isSubmitting ||
                keystoreState.statuses.unlockWithSecret === 'LOADING' ||
                watch('password', '').length < 8
              }
              text={
                isSubmitting || keystoreState.statuses.unlockWithSecret === 'LOADING'
                  ? t('Unlocking...')
                  : t('Unlock')
              }
              onPress={handleSubmit((data) => handleUnlock(data))}
            />

            <TouchableOpacity
              onPress={() => openInTab(`tab.html#/${ROUTES.keyStoreReset}`)}
              hitSlop={FOOTER_BUTTON_HIT_SLOP}
            >
              <Text weight="medium" appearance="secondaryText" fontSize={14} underline>
                {t('Forgot Device Password?')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </TabLayoutContainer>
  )
}

export default React.memo(KeyStoreUnlockScreen)
