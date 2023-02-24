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
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

const PermissionRequestScreen = () => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const { approval, rejectApproval, resolveApproval } = useExtensionApproval()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t('Webpage Wants to Connect') })
  }, [t, navigation])

  const handleDenyButtonPress = useCallback(
    () => rejectApproval(t('User rejected the request.')),
    [t, rejectApproval]
  )

  const handleAuthorizeButtonPress = useCallback(() => {
    setIsAuthorizing(true)
    resolveApproval({
      defaultChain: network?.nativeAssetSymbol
    })
  }, [network?.nativeAssetSymbol, resolveApproval])

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
              uri={approval?.data?.params?.icon}
              size={64}
              fallback={() => <ManifestFallbackIcon />}
            />
          </View>

          <Title style={[textStyles.center, spacings.phSm, spacings.pbLg]}>
            {approval?.data?.params?.origin ? new URL(approval?.data?.params?.origin).hostname : ''}
          </Title>

          <View>
            <Trans>
              <Text style={[textStyles.center, spacings.phSm, spacings.mbLg]}>
                <Text fontSize={14} weight="regular">
                  {'The dApp '}
                </Text>
                <Text fontSize={14} weight="regular" color={colors.heliotrope}>
                  {approval?.data?.params?.name || ''}
                </Text>
                <Text fontSize={14} weight="regular">
                  {' is requesting an authorization to communicate with Ambire Wallet'}
                </Text>
              </Text>
            </Trans>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                disabled={isAuthorizing}
                type="danger"
                onPress={handleDenyButtonPress}
                text={t('Deny')}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                type="outline"
                onPress={handleAuthorizeButtonPress}
                disabled={isAuthorizing}
                text={isAuthorizing ? t('Authorizing...') : t('Authorize')}
              />
            </View>
          </View>

          <Text fontSize={14} style={textStyles.center}>
            {t('Webpage can be disconnected any time from the Ambire extension settings.')}
          </Text>
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default React.memo(PermissionRequestScreen)
