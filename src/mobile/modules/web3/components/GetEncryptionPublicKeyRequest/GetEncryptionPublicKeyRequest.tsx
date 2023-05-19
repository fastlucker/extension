import React, { useEffect } from 'react'
import { View } from 'react-native'

import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import { Trans, useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import { Web3ContextData } from '@mobile/modules/web3/contexts/web3Context/types'
import ManifestImage from '@web/components/ManifestImage'

type Props = {
  approval: Web3ContextData['approval']

  rejectApproval: Web3ContextData['rejectApproval']
  isInBottomSheet?: boolean
  closeBottomSheet?: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

const GetEncryptionPublicKeyRequest = ({
  isInBottomSheet,
  closeBottomSheet,
  approval,
  rejectApproval
}: Props) => {
  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      rejectApproval(t('User rejected the request.'))
      !!closeBottomSheet && closeBottomSheet()
    }
  }, [rejectApproval, closeBottomSheet, t])

  const GradientWrapper = isInBottomSheet ? React.Fragment : GradientBackgroundWrapper

  return (
    <GradientWrapper>
      <Wrapper
        hasBottomTabNav={false}
        contentContainerStyle={{
          paddingTop: 0
        }}
        style={isInBottomSheet && spacings.ph0}
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
            {approval?.data?.params?.session?.name || 'webpage'}
          </Title>

          <View>
            <Trans>
              <Text style={[textStyles.center, spacings.phSm, spacings.mbLg]}>
                <Text fontSize={14} weight="regular">
                  {'The dApp '}
                </Text>
                <Text fontSize={14} weight="regular" color={colors.heliotrope}>
                  {approval?.data?.params?.session?.name || 'webpage'}
                </Text>
                <Text fontSize={14} weight="regular">
                  {
                    ' wants to get your public encryption key. This method is deprecated and Ambire does not support it.'
                  }
                </Text>
              </Text>
            </Trans>
          </View>
        </Panel>
      </Wrapper>
    </GradientWrapper>
  )
}

export default React.memo(GetEncryptionPublicKeyRequest)
