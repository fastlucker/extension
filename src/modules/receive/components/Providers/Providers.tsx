import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import PayTrieLogo from '@assets/svg/PayTrieLogo'
import RampLogo from '@assets/svg/RampLogo'
import TransakLogo from '@assets/svg/TransakLogo'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { openPayTrie, openRampNetwork, openTransak } from '@modules/receive/services/providers'

import styles from './styles'

const Providers = ({ walletAddress, networkDetails }: any) => {
  const { t } = useTranslation()

  const providers = [
    {
      Icon: RampLogo,
      name: 'Ramp',
      type: 'Bank Transfer, Credit/Debit Card, Apple Pay',
      fees: '0.49%-2.9%',
      limits: '10,000EUR/m',
      currencies: 'USD, EUR, GBP',
      networks: ['ethereum', 'polygon', 'avalanche', 'binance-smart-chain'],
      onClick: () => openRampNetwork({ walletAddress, selectedNetwork: networkDetails.id })
    },
    {
      Icon: PayTrieLogo,
      name: 'PayTrie',
      type: 'Bank Transfer',
      fees: '1% (min. $2 CAD)',
      limits: '$2,000CAD/day',
      currencies: 'CAD',
      networks: ['ethereum', 'polygon', 'binance-smart-chain'],
      onClick: () => openPayTrie({ walletAddress, selectedNetwork: networkDetails.id })
    },
    {
      Icon: TransakLogo,
      name: 'Transak',
      type: 'Credit/Debit card & Bank Transfer (depends on location)',
      fees: 'from 0.5%',
      limits: 'up to 15,000 EUR/day',
      currencies: 'GBP, EUR, USD and many more',
      networks: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'binance-smart-chain'],
      onClick: () => openTransak({ walletAddress, selectedNetwork: networkDetails.id })
    }
  ]

  const shouldBeDisabled: any = (networks: any) => {
    return networks.includes(networkDetails.id) ? null : 'disabled'
  }

  return (
    <View>
      {providers.map(({ Icon, name, type, fees, limits, currencies, networks, onClick }: any) => (
        <TouchableOpacity
          key={name}
          onPress={onClick}
          disabled={shouldBeDisabled(networks)}
          style={styles.providerContainer}
          activeOpacity={0.8}
        >
          <View style={spacings.mrSm}>{!!Icon && <Icon />}</View>
          <View style={flexboxStyles.flex1}>
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

export default Providers
