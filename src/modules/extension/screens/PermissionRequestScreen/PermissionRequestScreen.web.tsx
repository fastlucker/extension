import React, { useLayoutEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import CloseIcon from '@assets/svg/CloseIcon'
import ManifestFallbackIcon from '@assets/svg/ManifestFallbackIcon'
import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useAmbireExtension from '@modules/common/hooks/useAmbireExtension'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

const PermissionRequestScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { params } = useAmbireExtension()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Permission Requested')
    })
  }, [t, navigation])

  const targetHost = params.host

  const queue = useMemo(() => (params.queue ? JSON.parse(atob(params.queue)) : []), [params.queue])

  const [loading, setLoading] = useState(false)
  const { rejectApproval, resolveApproval } = useExtensionApproval()

  // const [feedbackCloseAnimated, setFeedbackCloseAnimated] = useState(false)
  // const [isCodeTooltipShown, setIsCodeTooltipShown] = useState(false)
  const [isQueueDisplayed, setIsQueueDisplayed] = useState(false)

  const handleDenyButtonPress = () => {
    rejectApproval('User rejected the request.')
  }

  const handleAuthorizeButtonPress = () => {
    setLoading(true)
    resolveApproval({
      defaultChain: network?.nativeAssetSymbol
    })
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

          {!loading && (
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
