import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import CloseIcon from '@assets/svg/CloseIcon'
import { useTranslation } from '@config/localization'
import useAuth from '@modules/auth/hooks/useAuth'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ManifestImage from '@modules/extension/components/ManifestImage'
import { browserAPI } from '@web/constants/browserAPI'
import { sendMessage, setupAmbexMessenger } from '@web/services/ambexMessanger'

import styles from './styles'

// TODO: should be called only for extension. Skip for web only
setupAmbexMessenger('contentScript', browserAPI)

const PermissionRequestScreen = ({ navigation }: any) => {
  const { t } = useTranslation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Permission Requested')
    })
  }, [t, navigation])

  const urlSearchParams = new URLSearchParams(window?.location?.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  const targetHost = params.host

  let queue: any = []
  try {
    queue = JSON.parse(atob(params.queue))
  } catch {
    //
    console.warn('Ambire extension could not get request queue')
  }

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    success: boolean
    permitted: boolean
  } | null>(null)
  const [feedbackCloseAnimated, setFeedbackCloseAnimated] = useState(false)

  const [isQueueDisplayed, setIsQueueDisplayed] = useState(false)
  const [isCodeTooltipShown, setIsCodeTooltipShown] = useState(false)
  const { authStatus } = useAuth()

  const handlePermission = (permitted: boolean) => {
    setLoading(true)
    sendMessage({
      type: 'grantPermission',
      to: 'background',
      data: {
        permitted,
        targetHost
      }
    })
      .then((message) => {
        console.log('MESSAGE', message)
        setFeedback({ success: true, permitted })
      })
      .catch((err) => {
        // TODO should not happen but in case, implement something nicer for the user?
        console.log('ERR', err)
        setFeedback({ success: false, permitted })
      })
  }

  useEffect(() => {
    if (feedback) {
      setLoading(false)
      setTimeout(() => setFeedbackCloseAnimated(true), 100)
      setTimeout(() => {
        // window.close()
      }, 1200)
    }
  }, [feedback, authStatus, navigation])

  const renderFeedback = () => {
    if (feedback?.success) {
      return feedback?.permitted ? (
        <View style={styles.permissionLabelWrapper}>
          <Text weight="medium">Permission Granted</Text>
        </View>
      ) : (
        <View style={styles.permissionLabelWrapper}>
          <Text weight="medium">Permission Denied</Text>
        </View>
      )
    }

    return (
      <View style={spacings.pv}>
        <Text style={[textStyles.center, spacings.phSm]} fontSize={16}>
          Could not communicate with Ambire Wallet. Please close the window and try again
        </Text>
      </View>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <Panel type="filled">
          <View style={[spacings.pvSm, flexboxStyles.alignCenter]}>
            <ManifestImage host={targetHost} size={64} />
          </View>

          <Title style={[textStyles.center, spacings.phSm]}>{targetHost}</Title>

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
                  <View style={spacings.phSm}>
                    <View style={styles.textarea}>
                      <View
                        style={[
                          flexboxStyles.directionRow,
                          spacings.pbSm,
                          flexboxStyles.alignCenter
                        ]}
                      >
                        <View style={flexboxStyles.flex1} />
                        <Title type="small" hasBottomSpacing={false}>
                          Requested payload details
                        </Title>
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
                  </View>
                ) : (
                  <Text style={[textStyles.center, spacings.phSm, spacings.mbMd]}>
                    <Text fontSize={16} weight="regular">
                      {'The dapp '}
                    </Text>
                    <Text fontSize={16} weight="regular" color={colors.heliotrope}>
                      {targetHost}
                    </Text>
                    <Text fontSize={16} weight="regular">
                      {' is requesting an authorization to communicate with Ambire Wallet'}
                    </Text>
                  </Text>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <View style={styles.buttonWrapper}>
                  <Button type="danger" onPress={() => handlePermission(false)} text="Deny" />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button type="outline" onPress={() => handlePermission(true)} text="Authorize" />
                </View>
              </View>

              <Text fontSize={16} style={textStyles.center}>
                Dapps authorizations can be removed at any time in the extension settings
              </Text>
            </>
          )}
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default PermissionRequestScreen
