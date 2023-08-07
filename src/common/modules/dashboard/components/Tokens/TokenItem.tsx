// import { UsePrivateModeReturnType } from 'ambire-common/src/hooks/usePrivateMode'
import { networks } from 'ambire-common/src/consts/networks'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Pressable } from 'react-native-web-hover'

import EthereumIcon from '@common/assets/svg/EthereumIcon'
import InformationIcon from '@common/assets/svg/InformationIcon/InformationIcon'
import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

// import styles from './styles'

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

// TODO: customize token for gas token, wallet rewards row token.
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

  const networkData = networks.find(({ id }) => network === id)

  return (
    <Pressable>
      {({ hovered }) => (
        <View
          style={[
            flexboxStyles.directionRow,
            flexboxStyles.justifySpaceBetween,
            spacings.pvTy,
            spacings.phTy,
            { borderWidth: 1, borderColor: colors.zircon },
            hovered && {
              backgroundColor: colors.melrose_15,
              borderColor: colors.scampi_20,
              borderRadius: 12
            }
          ]}
        >
          <View style={[flexboxStyles.directionRow]}>
            <View style={[spacings.prSm, flexboxStyles.justifyCenter]}>
              <TokenIcon withContainer uri={img} address={address} />
            </View>
            <View>
              <View style={[flexboxStyles.directionRow, flexboxStyles.alignEnd]}>
                <Text
                  style={[spacings.mrTy]}
                  fontSize={16}
                  shouldScale={false}
                  weight="semiBold"
                  numberOfLines={1}
                >
                  {Number(balance).toFixed(balance < 1 ? 8 : 4)} {symbol}
                  {/* {formatFloatTokenAmount(Number(balance).toFixed(balance < 1 ? 8 : 4), true, decimals)} */}
                </Text>
                <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
                  <Text style={[spacings.mrMi]} shouldScale={false} fontSize={14}>
                    on
                  </Text>
                  <EthereumIcon style={[spacings.mrMi]} />
                  <Text style={[spacings.mrMi]} shouldScale={false} fontSize={14}>
                    {networkData?.name}
                  </Text>
                  <InformationIcon color={hovered ? colors.melrose : colors.martinique_65} />
                </View>
              </View>
              <Text fontSize={12} style={textStyles.highlightPrimary}>
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
                <SendIcon width={25} height={25} color={colors.violet} />
              </Button>
            )}
            <View style={[spacings.ph, spacings.pvTy]}>
              {/* TODO: add the menu */}
              <KebabMenuIcon />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  )
}

export default React.memo(TokenItem)
