/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getFeatures, NetworkFeature } from '@ambire-common/libs/settings/settings'
import CheckIcon from '@common/assets/svg/CheckIcon'
import ErrorFilledIcon from '@common/assets/svg/ErrorFilledIcon'
import WarningFilledIcon from '@common/assets/svg/WarningFilledIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

type Props = {
  rpcUrl: string
  chainId: string
  onDeployContractsPress?: () => void
}

const NetworkAvailableFeatures = ({ chainId, rpcUrl, onDeployContractsPress }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [features, setFeatures] = useState<NetworkFeature[] | undefined>()
  const { pathname } = useRoute()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const res: NetworkFeature[] = await getFeatures(rpcUrl, BigInt(chainId), false)
      setFeatures(res)
    })()
  }, [chainId, rpcUrl])

  return (
    <View style={spacings.pbLg}>
      <Text fontSize={18} weight="medium" style={spacings.mbMd}>
        {t('Available features')}
      </Text>
      {!features && (
        <View style={[common.fullWidth, spacings.pv, flexbox.alignCenter]}>
          <Spinner />
        </View>
      )}
      {!!features && (
        <View>
          {features.map((feature) => (
            <View key={feature.id} style={[flexbox.directionRow, spacings.mb]}>
              <View style={[spacings.mrTy, { marginTop: 3 }]}>
                {feature.level === 'success' && <CheckIcon width={14} height={14} />}
                {feature.level === 'danger' && <ErrorFilledIcon width={14} height={14} />}
                {feature.level === 'warning' && <WarningFilledIcon width={14} height={14} />}
              </View>
              <Text fontSize={14} style={flexbox.flex1}>
                {feature.msg}
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
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default React.memo(NetworkAvailableFeatures)
