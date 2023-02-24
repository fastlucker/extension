import { Token, UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { View } from 'react-native'

import ManifestFallbackIcon from '@assets/svg/ManifestFallbackIcon'
import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useToken from '@modules/common/hooks/useToken'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { MODES } from '@modules/dashboard/components/AddOrHideToken/constants'
import TokenItem from '@modules/dashboard/components/AddOrHideToken/TokenItem'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [loadingTokenDetails, setLoadingTokenDetails] = useState(true)
  const [error, setError] = useState('')
  const [extraToken, setExtraToken] = useState<Token | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { approval, resolveApproval, rejectApproval } = useExtensionApproval()
  const { onAddExtraToken, checkIsTokenEligibleForAddingAsExtraToken } = usePortfolio()
  const { getTokenDetails } = useToken()
  const [tokenEligibleStatus, setTokenEligibleStatus] = useState<
    ReturnType<UsePortfolioReturnType['checkIsTokenEligibleForAddingAsExtraToken']>
  >({
    isEligible: false
  })

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t('Webpage Wants to Add Token') })
  }, [t, navigation])

  const tokenSymbol = approval?.data?.params?.data?.options?.symbol
  const tokenAddress = approval?.data?.params?.data?.options?.address

  useEffect(() => {
    setLoadingTokenDetails(true)
    setError('')

    if (!tokenAddress) {
      setLoadingTokenDetails(false)
      setError('')
      return
    }

    ;(async () => {
      try {
        const token = await getTokenDetails(tokenAddress, MODES.ADD_TOKEN)
        setExtraToken(token)

        if (!token) throw new Error('Failed to load token details.')

        setTokenEligibleStatus(checkIsTokenEligibleForAddingAsExtraToken(token))
      } catch {
        setLoadingTokenDetails(false)
        setError(t('Failed to load token details.'))
      }

      setLoadingTokenDetails(false)
    })()
    // Do not include the `checkIsTokenEligibleForAddingAsExtraToken`, because
    // its deps (tokens, constants) are not properly memoized which triggers
    // way too many re-renderings than needed (and loading indicator is shown)
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [getTokenDetails, t, tokenAddress])

  const handleAddToken = useCallback(async () => {
    setIsAdding(true)

    if (extraToken) {
      onAddExtraToken(extraToken)
      resolveApproval(true)
    }
  }, [extraToken, onAddExtraToken, resolveApproval])

  // On skip, resolve, since if you have positive balance of this token,
  // you will be able to see it in the Ambire Wallet in all cases.
  const handleSkipButtonPress = useCallback(() => {
    setIsAdding(true)
    resolveApproval(true)
  }, [resolveApproval])

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

          {!loadingTokenDetails && error && (
            <>
              <View>
                <Text
                  fontSize={14}
                  weight="regular"
                  style={[textStyles.center, spacings.phSm, spacings.mbLg]}
                  appearance="danger"
                >
                  {error}
                </Text>
              </View>

              <View style={styles.buttonWrapper}>
                <Button
                  type="outline"
                  accentColor={colors.titan}
                  onPress={handleDenyButtonPress}
                  text={t('Dismiss')}
                />
              </View>
            </>
          )}

          {loadingTokenDetails && !error && (
            <View style={flexboxStyles.center}>
              <Spinner />
            </View>
          )}

          {!loadingTokenDetails && !error && (
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

                {extraToken && <TokenItem {...extraToken} />}
              </View>

              <View style={styles.buttonsContainer}>
                {tokenEligibleStatus.isEligible && (
                  <>
                    <View style={styles.buttonWrapper}>
                      <Button
                        disabled={isAdding}
                        type="danger"
                        onPress={handleDenyButtonPress}
                        text={t('Deny')}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <Button
                        disabled={isAdding || !extraToken}
                        type="outline"
                        onPress={handleAddToken}
                        text={isAdding ? t('Adding...') : t('Add token')}
                      />
                    </View>
                  </>
                )}
                {!tokenEligibleStatus.isEligible && (
                  <View style={styles.buttonWrapper}>
                    <Button
                      disabled={isAdding}
                      type="outline"
                      onPress={handleSkipButtonPress}
                      text={isAdding ? t('Confirming...') : t('Okay')}
                    />
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
