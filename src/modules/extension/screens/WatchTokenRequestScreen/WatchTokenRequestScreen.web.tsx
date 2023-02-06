import React, { useCallback, useLayoutEffect, useState } from 'react'
import { View } from 'react-native'

import ManifestFallbackIcon from '@assets/svg/ManifestFallbackIcon'
import { Trans, useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

const WatchTokenRequestScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { approval, resolveApproval } = useExtensionApproval()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { onAddExtraToken } = usePortfolio()

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t('Webpage Wants to Add Token') })
  }, [t, navigation])

  // On skip, resolve, since if you have positive balance of this token,
  // you will be able to see it in the Ambire Wallet in all cases.
  const handleSkipButtonPress = useCallback(() => resolveApproval(true), [resolveApproval])

  const tokenSymbol = approval?.data?.params?.data?.options?.symbol
  const tokenAddress = approval?.data?.params?.data?.options?.address
  const tokenDecimals = approval?.data?.params?.data?.options?.decimals
  const tokenImageUrl = ''

  const handleAddTokenAnyways = useCallback(() => {
    setLoading(true)

    onAddExtraToken({
      account: selectedAcc,
      address: tokenAddress,
      // TODO: Double check if this is the correct way to handle this
      balance: '0',
      balanceRaw: '0',
      decimals: tokenDecimals,
      name: tokenSymbol,
      network: network.id,
      symbol: tokenSymbol,
      tokenImageUrl
    })
    resolveApproval(true)
  }, [
    network.id,
    onAddExtraToken,
    resolveApproval,
    selectedAcc,
    tokenAddress,
    tokenDecimals,
    tokenSymbol
  ])

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
                <Text
                  fontSize={14}
                  weight="regular"
                  style={[textStyles.center, spacings.phSm, spacings.mbLg]}
                >
                  {t(
                    'That is not explicitly needed, because if you have a positive balance of this token, you will be able to see it in the Ambire Wallet.'
                  )}
                </Text>
              </View>

              <View style={styles.buttonsContainer}>
                <View style={styles.buttonWrapper}>
                  <Button
                    type="outline"
                    accentColor={colors.titan}
                    onPress={handleAddTokenAnyways}
                    text={t('Add token anyways')}
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button type="outline" onPress={handleSkipButtonPress} text={t('Skip')} />
                </View>
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
