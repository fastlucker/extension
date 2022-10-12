import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import CloseIcon from '@assets/svg/CloseIcon'
import ManifestFallbackIcon from '@assets/svg/ManifestFallbackIcon'
import { Trans, useTranslation } from '@config/localization'
import useAuth from '@modules/auth/hooks/useAuth'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useAmbireExtension from '@modules/common/hooks/useAmbireExtension'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ManifestImage from '@modules/extension/components/ManifestImage'
import { browserAPI } from '@web/constants/browserAPI'
import { BACKGROUND } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

import styles from './styles'

const PermissionRequestScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { selectedAcc: selectedAccount } = useAccounts()
  const { network } = useNetwork()
  const { params } = useAmbireExtension()
  const { authStatus } = useAuth()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Permission Requested')
    })
  }, [t, navigation])

  const targetHost = params.host

  const queue = useMemo(() => (params.queue ? JSON.parse(atob(params.queue)) : []), [params.queue])

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    success: boolean
    permitted: boolean
  } | null>(null)
  // const [feedbackCloseAnimated, setFeedbackCloseAnimated] = useState(false)
  // const [isCodeTooltipShown, setIsCodeTooltipShown] = useState(false)
  const [isQueueDisplayed, setIsQueueDisplayed] = useState(false)

  const handlePermission = (permitted: boolean) => {
    if (browserAPI && sendMessage) {
      browserAPI?.storage?.local?.set({ SELECTED_ACCOUNT: selectedAccount, NETWORK: network }, () => {
        sendMessage({
          type: 'grantPermission',
          to: BACKGROUND,
          data: {
            permitted,
            targetHost
          }
        })
          .then(() => {
            setFeedback({ success: true, permitted })
          })
          .catch(() => {
            // TODO: should not happen but in case, implement something nicer for the user?
            setFeedback({ success: false, permitted })
          })
      })
    }
  }

  useEffect(() => {
    if (feedback) {
      setLoading(false)
      // setTimeout(() => setFeedbackCloseAnimated(true), 100)
      setTimeout(() => {
        window.close()
      }, 1200)
    }
  }, [feedback, authStatus, navigation])

  const handleDenyButtonPress = () => {
    setLoading(true)
    handlePermission(false)
  }

  const handleAuthorizeButtonPress = () => {
    setLoading(true)
    handlePermission(true)
  }

  const renderFeedback = () => {
    if (feedback?.success) {
      return feedback?.permitted ? (
        <Text weight="medium" color={colors.turquoise}>
          {t('Permission Granted!')}
        </Text>
      ) : (
        <Text weight="medium" color={colors.pink}>
          {t('Permission Denied!')}
        </Text>
      )
    }

    return (
      <View style={spacings.pv}>
        <Text style={[textStyles.center, spacings.phSm]} fontSize={14}>
          {t(
            "Could not communicate with extension's background service. Please close the window and try again"
          )}
        </Text>
      </View>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        hasBottomTabNav={false}
        contentContainerStyle={{
          paddingTop: 0
        }}
      >
        <Panel type="filled">
          <View style={[spacings.pvSm, flexboxStyles.alignCenter]}>
            <ManifestImage host={targetHost} size={64} fallback={() => <ManifestFallbackIcon />} />
          </View>

          <Title style={[textStyles.center, spacings.phSm, spacings.pbLg]}>{targetHost}</Title>

          <View style={flexboxStyles.alignCenter}>
            {!!loading && <Spinner />}
            {!loading && !!feedback && renderFeedback()}
          </View>
          {!loading && !feedback && (
            <>
              {!!queue.length && (
                <TouchableOpacity
                  style={styles.showQueueButton}
                  onPress={() => setIsQueueDisplayed((prev) => !prev)}
                >
                  <Text>{'</>'}</Text>
                </TouchableOpacity>
              )}
              <View>
                {isQueueDisplayed ? (
                  <View style={styles.textarea}>
                    <View
                      style={[flexboxStyles.directionRow, spacings.pbSm, flexboxStyles.alignCenter]}
                    >
                      <View style={flexboxStyles.flex1} />
                      <Text weight="regular" fontSize={16}>
                        {t('Requested payload details')}
                      </Text>
                      <View style={[flexboxStyles.flex1, flexboxStyles.alignEnd]}>
                        <TouchableOpacity onPress={() => setIsQueueDisplayed(false)}>
                          <CloseIcon />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                      <Text fontSize={12}>
                        <Text>{queue.map((q: any) => JSON.stringify(q, null, ' '))}</Text>
                      </Text>
                    </ScrollView>
                  </View>
                ) : (
                  <Trans>
                    <Text style={[textStyles.center, spacings.phSm, spacings.mbLg]}>
                      <Text fontSize={14} weight="regular">
                        {'The dapp '}
                      </Text>
                      <Text fontSize={14} weight="regular" color={colors.heliotrope}>
                        {targetHost}
                      </Text>
                      <Text fontSize={14} weight="regular">
                        {' is requesting an authorization to communicate with Ambire Wallet'}
                      </Text>
                    </Text>
                  </Trans>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <View style={styles.buttonWrapper}>
                  <Button type="danger" onPress={handleDenyButtonPress} text={t('Deny')} />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    type="outline"
                    onPress={handleAuthorizeButtonPress}
                    text={t('Authorize')}
                  />
                </View>
              </View>

              <Text fontSize={14} style={textStyles.center}>
                {t('Dapps authorizations can be removed at any time in the extension settings')}
              </Text>
            </>
          )}
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default PermissionRequestScreen
