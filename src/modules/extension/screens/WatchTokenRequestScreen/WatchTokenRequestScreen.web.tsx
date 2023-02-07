import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { View } from 'react-native'

import ManifestFallbackIcon from '@assets/svg/ManifestFallbackIcon'
import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useToken from '@modules/common/hooks/useToken'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { MODES } from '@modules/dashboard/components/AddOrHideToken/constants'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

const WatchTokenRequestScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { approval, resolveApproval, rejectApproval } = useExtensionApproval()
  const { onAddExtraToken, checkIsTokenEligibleForAddingAsExtraToken } = usePortfolio()
  const { getTokenDetails } = useToken()
  const [tokenEligibleStatus, setTokenEligibleStatus] = useState({
    isEligible: false,
    reason: ''
  })

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t('Webpage Wants to Add Token') })
  }, [t, navigation])

  // On skip, resolve, since if you have positive balance of this token,
  // you will be able to see it in the Ambire Wallet in all cases.
  const handleSkipButtonPress = useCallback(() => resolveApproval(true), [resolveApproval])

  const tokenSymbol = approval?.data?.params?.data?.options?.symbol
  const tokenAddress = approval?.data?.params?.data?.options?.address

  useEffect(() => {
    if (!tokenAddress) return

    setTokenEligibleStatus(checkIsTokenEligibleForAddingAsExtraToken(tokenAddress))
  }, [checkIsTokenEligibleForAddingAsExtraToken, tokenAddress])

  const handleAddToken = useCallback(async () => {
    setLoading(true)

    const token = await getTokenDetails(tokenAddress, MODES.ADD_TOKEN)
    onAddExtraToken(token)

    // resolveApproval(true)
  }, [getTokenDetails, onAddExtraToken, resolveApproval, tokenAddress])

  const handleDenyButtonPress = useCallback(
    () => rejectApproval(t('User rejected the request.')),
    [t, rejectApproval]
  )

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
            <ManifestImage
              uri={approval?.data?.params?.session?.icon}
              size={64}
              fallback={() => <ManifestFallbackIcon />}
            />
          </View>

          <Title style={[textStyles.center, spacings.phSm, spacings.pbLg]}>
            {approval?.data?.origin ? new URL(approval?.data?.origin)?.hostname : ''}
          </Title>

          {!loading && (
            <>
              <View>
                <Trans values={{ tokenSymbol, tokenAddress }}>
                  <Text style={[textStyles.center, spacings.phSm, spacings.mbLg]}>
                    <Text fontSize={14} weight="regular">
                      {'The dApp '}
                    </Text>
                    <Text fontSize={14} weight="regular" color={colors.heliotrope}>
                      {approval?.data?.params?.name || ''}
                    </Text>
                    <Text fontSize={14} weight="regular">
                      {
                        ' is requesting to add the {{tokenSymbol}} token {{tokenAddress}} to the Ambire Wallet tokens list.'
                      }
                    </Text>
                  </Text>
                </Trans>

                {!tokenEligibleStatus.isEligible && !!tokenEligibleStatus.reason && (
                  <Text
                    fontSize={14}
                    weight="regular"
                    style={[textStyles.center, spacings.phSm, spacings.mbLg]}
                  >
                    {tokenEligibleStatus.reason}
                  </Text>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                {tokenEligibleStatus.isEligible && (
                  <>
                    <View style={styles.buttonWrapper}>
                      <Button type="danger" onPress={handleDenyButtonPress} text={t('Deny')} />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <Button
                        type="outline"
                        accentColor={colors.titan}
                        onPress={handleAddToken}
                        text={t('Add token')}
                      />
                    </View>
                  </>
                )}
                {!tokenEligibleStatus.isEligible && (
                  <View style={styles.buttonWrapper}>
                    <Button type="outline" onPress={handleSkipButtonPress} text={t('Okay')} />
                  </View>
                )}
              </View>

              <Text fontSize={14} style={textStyles.center}>
                {t('Token can be hidden any time from the Ambire extension settings.')}
              </Text>
            </>
          )}
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default React.memo(WatchTokenRequestScreen)
