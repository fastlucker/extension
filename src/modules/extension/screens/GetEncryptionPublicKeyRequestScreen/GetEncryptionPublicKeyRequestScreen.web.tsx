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
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import ManifestImage from '@modules/extension/components/ManifestImage'

import styles from './styles'

const GetEncryptionPublicKeyRequestScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const { approval, resolveApproval, rejectApproval } = useExtensionApproval()

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t('Webpage Wants to Get Encryption Key') })
  }, [t, navigation])

  const handleAuthorize = useCallback(async () => {
    setIsAuthorizing(true)

    // TODO:
    // resolveApproval(true)
  }, [])

  const handleDeny = useCallback(
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
                  {
                    ' wants to get your public encryption key. By authorizing, this webpage will be able to compose encrypted messages to you.'
                  }
                </Text>
              </Text>
            </Trans>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                disabled={isAuthorizing}
                type="danger"
                onPress={handleDeny}
                text={t('Deny')}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                disabled={isAuthorizing}
                type="outline"
                onPress={handleAuthorize}
                text={isAuthorizing ? t('Authorizing...') : t('Authorize')}
              />
            </View>
          </View>
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default React.memo(GetEncryptionPublicKeyRequestScreen)
