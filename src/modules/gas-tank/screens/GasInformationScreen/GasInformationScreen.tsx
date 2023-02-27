import { ACTION_GAS_COSTS, AMBIRE_OVERHEAD_COST } from 'ambire-common/src/constants/actionGasCosts'
import { GAS_SPEEDS } from 'ambire-common/src/constants/gasSpeeds'
import useCacheBreak from 'ambire-common/src/hooks/useCacheBreak'
import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import InfoIcon from '@assets/svg/InfoIcon'
import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import { ROTES } from '@config/Router/routesConfig'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useNavigation from '@modules/common/hooks/useNavigation'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const relayerURL = CONFIG.RELAYER_URL

const GasInformationScreen = () => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { navigate } = useNavigation()
  const { cacheBreak } = useCacheBreak()
  const url = relayerURL ? `${relayerURL}/gasPrice/${network?.id}?cacheBreak=${cacheBreak}` : null
  const { data, errMsg, isLoading } = useRelayerData({ url })
  const [loaded, setLoaded] = useState<boolean>(false)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!loaded && !isLoading) {
      setLoaded(true)
    }
  }, [isLoading, loaded])

  const gasData = useMemo(() => (data ? data.data : null), [data])

  const GAS_PRICES: any = useMemo(
    () =>
      !!gasData &&
      GAS_SPEEDS.reduce((acc: any, speed: any) => {
        acc[speed] = gasData?.gasPrice?.maxPriorityFeePerGas
          ? gasData.gasPrice.maxPriorityFeePerGas[speed] + gasData.gasPrice[speed]
          : gasData.gasPrice[speed]
        return acc
      }, {}),
    [gasData]
  )

  const handleDepositButtonPress = () => {
    navigate(ROTES.gasTank)
  }

  const LoadingContent = !!isLoading && !loaded && (
    <View style={[flexboxStyles.alignCenter, flexboxStyles.justifyCenter, flexboxStyles.flex1]}>
      <Spinner />
    </View>
  )

  const ErrorContent = !gasData && !!errMsg && (
    <Text>{t('Gas Information: {{errMsg}}', { errMsg })}</Text>
  )

  const GasFeesContent = !!gasData && !!loaded && !errMsg && (
    <>
      <Text fontSize={12} color={colors.titan_50} style={spacings.mbMi}>
        {`${new Date(gasData.gasPrice.updated).toDateString()} ${new Date(gasData.gasPrice.updated)
          .toTimeString()
          .substr(0, 8)}`}
      </Text>
      <View style={styles.gasSpeedContainer}>
        {GAS_SPEEDS.map((speed) => {
          return (
            <View style={styles.speedItem} key={speed}>
              <Text style={textStyles.capitalize} weight="regular">
                {speed}
              </Text>
              <Text>{Math.round(GAS_PRICES[speed] / 10 ** 9)} Gwei</Text>
            </View>
          )
        })}
      </View>
      <Text style={spacings.mbSm}>{t('Estimated Cost of Transaction Actions')}</Text>
      <View>
        <View style={styles.tableHeadingContainer}>
          <View style={{ width: '45%' }}>
            <Text fontSize={11} weight="medium">
              {t('Actions')}
            </Text>
          </View>
          {GAS_SPEEDS.map((speed) => (
            <View key={speed} style={flexboxStyles.flex1}>
              <Text key={speed} fontSize={11} weight="medium" style={textStyles.capitalize}>
                {speed === 'medium' ? 'med' : speed}
              </Text>
            </View>
          ))}
        </View>

        {ACTION_GAS_COSTS.map((a) => (
          <View key={`${a.name}-${a.gas}`} style={styles.tableRowContainer}>
            <View style={[{ width: '45%' }, spacings.prMi]}>
              <Text fontSize={11} numberOfLines={1}>
                {a.name}
              </Text>
            </View>
            {GAS_SPEEDS.map((speed) => (
              <View key={`${a.name}-${speed}`} style={flexboxStyles.flex1}>
                <Text fontSize={11}>
                  $
                  {(
                    ((GAS_PRICES[speed] * (a.gas + AMBIRE_OVERHEAD_COST)) / 10 ** 18) *
                    gasData.gasFeeAssets.native
                  ).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </>
  )

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false} contentContainerStyle={spacings.pb0}>
        <View
          style={[
            flexboxStyles.directionRow,
            flexboxStyles.alignCenter,
            flexboxStyles.justifyCenter,
            spacings.mb
          ]}
        >
          <InfoIcon width={20} height={20} />
          <Title hasBottomSpacing={false} style={spacings.plTy}>
            {t('Current Network Fees')}
          </Title>
        </View>
        <Text style={[spacings.mb, spacings.mhSm]} fontSize={12}>
          {t(
            'Network fees are determined on a market principle - if more users are trying to use the network, fees are higher. Each network has different fees.'
          )}
        </Text>
        {LoadingContent}
        {ErrorContent}
        {GasFeesContent}
      </Wrapper>

      <View style={[spacings.pt, spacings.ph, { paddingBottom: insets.bottom }]}>
        <Button text={t('Deposit to Gas Tank')} onPress={handleDepositButtonPress} />
      </View>
    </GradientBackgroundWrapper>
  )
}

export default GasInformationScreen
