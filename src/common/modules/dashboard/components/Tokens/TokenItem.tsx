import { networks } from 'ambire-common/src/consts/networks'
import React from 'react'
import { View } from 'react-native'
import { Pressable } from 'react-native-web-hover'

import InformationIcon from '@common/assets/svg/InformationIcon/InformationIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import Button from '@common/components/Button'
import Dropdown from '@common/components/Dropdown'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

type Props = {
  img: any
  symbol: string
  balance: number
  balanceUSD: number
  decimals: number
  address: string
  network: string | undefined
  onPress: (symbol: string) => any
  //   hidePrivateValue: UsePrivateModeReturnType['hidePrivateValue']
}

// TODO: customize token component for gas token, wallet rewards row token.
// TODO: correct props once connected with portfolio controller
const TokenItem = ({
  img,
  symbol,
  balance,
  balanceUSD,
  decimals,
  address,
  network,
  onPress
}: Props) => {
  const { t } = useTranslation()
  const data = [
    { label: 'Swap', value: '1' },
    { label: 'Bridge', value: '2' },
    { label: 'Top Up Gas Tank', value: '3' },
    { label: 'Deposit', value: '4' },
    { label: 'Hide', value: '5' },
    { label: 'Earn', value: '6' },
    { label: 'Withdraw', value: '7' }
  ]

  const networkData = networks.find(({ id }) => network === id)

  return (
    <Pressable>
      {({ hovered }) => (
        <View
          style={[
            styles.container,
            hovered && {
              backgroundColor: colors.melrose_15,
              borderColor: colors.scampi_20
            }
          ]}
        >
          <View style={[flexboxStyles.directionRow]}>
            <View style={[spacings.mrTy, flexboxStyles.justifyCenter]}>
              <TokenIcon withContainer uri={img} address={address} networkId={network} />
            </View>
            <View>
              <View style={[flexboxStyles.directionRow, flexboxStyles.alignEnd]}>
                <Text
                  style={[spacings.mrTy]}
                  fontSize={14}
                  shouldScale={false}
                  weight="semiBold"
                  numberOfLines={1}
                >
                  {Number(balance).toFixed(balance < 1 ? 8 : 4)} {symbol}
                </Text>
                <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
                  <Text shouldScale={false} fontSize={12}>
                    on
                  </Text>
                  <NetworkIcon name="ethereum" style={{ width: 20, height: 20 }} />
                  <Text style={[spacings.mrMi]} shouldScale={false} fontSize={12}>
                    {networkData?.name}
                  </Text>
                  <InformationIcon color={hovered ? colors.melrose : colors.martinique_65} />
                </View>
              </View>
              <Text fontSize={14} shouldScale={false} style={textStyles.highlightPrimary}>
                ${balanceUSD?.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            {hovered && (
              <Button
                type="outline"
                size="small"
                accentColor={colors.violet}
                style={[flexboxStyles.directionRow]}
                text={t('Send')}
                hasBottomSpacing={false}
              >
                <SendIcon width={20} height={20} color={colors.violet} />
              </Button>
            )}
            <View>
              <Dropdown data={data} onSelect={() => null} />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  )
}

export default React.memo(TokenItem)
