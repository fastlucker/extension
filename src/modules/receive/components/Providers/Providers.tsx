import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useProviders from '@modules/receive/hooks/useProviders'

import styles from './styles'

const Providers = ({ walletAddress, networkDetails }: any) => {
  const { t } = useTranslation()

  const { providers, isLoading } = useProviders({
    walletAddress,
    networkId: networkDetails.id
  })

  const isDisabled = (networks: any) => !networks?.includes(networkDetails.id)

  return (
    <View>
      {providers.map(({ Icon, name, type, fees, limits, currencies, networks, onClick }: any) => (
        <TouchableOpacity
          key={name}
          onPress={onClick}
          disabled={isDisabled(networks)}
          style={[styles.providerContainer, !!isDisabled(networks) && styles.disabled]}
          activeOpacity={0.6}
        >
          <View style={spacings.mrSm}>{!!Icon && <Icon />}</View>
          <View style={flexboxStyles.flex1}>
            {!!isLoading.includes(name) && (
              <View style={styles.providerLoadingWrapper}>
                <Spinner />
              </View>
            )}
            <Text style={spacings.mbMi} fontSize={10}>
              {type}
            </Text>
            <Text fontSize={10} color={colors.baileyBells} style={styles.descriptiveTextSpacing}>
              {t('Fees: {{fees}}', { fees })}
            </Text>
            <Text fontSize={10} color={colors.baileyBells} style={styles.descriptiveTextSpacing}>
              {t('Limits: {{limits}}', { limits })}
            </Text>
            <Text fontSize={10} color={colors.baileyBells}>
              {t('Currencies: {{currencies}}', { currencies })}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      {networkDetails.id !== 'ethereum' && (
        <View style={[flexboxStyles.directionRow, spacings.phSm]}>
          <InfoIcon />
          <Text fontSize={12} style={[flexboxStyles.flex1, spacings.plTy]}>
            {t(
              'Some deposit methods are unavailable on {{name}}. Switch to Ethereum for the widest support.',
              { name: networkDetails.name }
            )}
          </Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(Providers)
