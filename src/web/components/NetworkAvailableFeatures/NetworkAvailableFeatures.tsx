/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { NetworkFeature } from '@ambire-common/interfaces/networkDescriptor'
import CheckIcon from '@common/assets/svg/CheckIcon'
import ErrorFilledIcon from '@common/assets/svg/ErrorFilledIcon'
import InformationIcon from '@common/assets/svg/InformationIcon'
import WarningFilledIcon from '@common/assets/svg/WarningFilledIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

type Props = {
  features: NetworkFeature[] | undefined
  onDeployContractsPress?: () => void
}

const NetworkAvailableFeatures = ({ features, onDeployContractsPress }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { pathname } = useRoute()

  return (
    <View style={[spacings.pbLg, spacings.pr]}>
      <Text fontSize={18} weight="medium" style={spacings.mbMd}>
        {t('Available features')}
      </Text>
      <View>
        {!!features &&
          features.map((feature) => {
            return (
              <View key={feature.id} style={[flexbox.directionRow, spacings.mb]}>
                <View style={[spacings.mrTy, { marginTop: 3 }]}>
                  {feature.level === 'loading' && <Spinner style={{ width: 14, height: 14 }} />}
                  {feature.level === 'success' && <CheckIcon width={14} height={14} />}
                  {feature.level === 'warning' && <WarningFilledIcon width={14} height={14} />}
                  {feature.level === 'danger' && <ErrorFilledIcon width={14} height={14} />}
                </View>
                <View style={[flexbox.directionRow, flexbox.flex1, flexbox.alignCenter]}>
                  <Text
                    fontSize={14}
                    weight="medium"
                    appearance="secondaryText"
                    style={{ ...spacings.mrTy, overflow: 'visible' }}
                    numberOfLines={2}
                  >
                    {feature.title}
                    {pathname?.includes(ROUTES.networksSettings) &&
                      feature.id === 'saSupport' &&
                      feature.level === 'warning' && (
                        <>
                          {'  '}
                          <Text
                            weight="medium"
                            underline
                            fontSize={14}
                            color={theme.primary}
                            onPress={() => {
                              !!onDeployContractsPress && onDeployContractsPress()
                            }}
                          >
                            {t('Deploy Contracts')}
                          </Text>
                        </>
                      )}
                    {!!feature.msg && (
                      <View style={{ width: 1 }}>
                        <View style={{ position: 'absolute', top: -11.5, left: 8 }}>
                          <InformationIcon
                            width={14}
                            height={14}
                            data-tooltip-id="feature-message-tooltip"
                            data-tooltip-content={feature.msg}
                          />
                        </View>
                      </View>
                    )}
                  </Text>
                </View>
              </View>
            )
          })}
        <Tooltip id="feature-message-tooltip" />
      </View>
    </View>
  )
}

export default React.memo(NetworkAvailableFeatures)
