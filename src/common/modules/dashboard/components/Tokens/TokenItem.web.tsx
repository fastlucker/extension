import './styles.css'

import { networks } from 'ambire-common/src/consts/networks'
import React from 'react'
import { View } from 'react-native'

import InformationIcon from '@common/assets/svg/InformationIcon/InformationIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import Button from '@common/components/Button'
import Dropdown from '@common/components/Dropdown'
import NetworkIcon, { NetworkIconNameType } from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

type Props = {
  symbol: string
  balance: number
  balanceUSD: number
  address: string
  network: NetworkIconNameType
}

// TODO: customize token component for gas token, wallet rewards token. Each of them has different button and styling
// TODO: correct props once connected with portfolio controller
const TokenItem = ({ symbol, balance, balanceUSD, address, network }: Props) => {
  const { t } = useTranslation()
  // TODO: navigate to the routes onPress once they are ready or hide the ones we wont need for epic 1
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

  /**
   * Explanation why we converted to html element
   *
   * Unfortunatly in the case we have Pressable (our Button component)
   * inside Pressable, like we need here in order to have hover effect on the token,
   * once we are on the Button component (aka the child Pressable) the hover on the parent disappears
   * */
  return (
    <div className="token-container" style={styles.container}>
      <View style={[flexboxStyles.directionRow]}>
        <View style={[spacings.mrTy, flexboxStyles.justifyCenter]}>
          <TokenIcon withContainer address={address} networkId={network} />
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
              <NetworkIcon name={network} style={{ width: 25, height: 25 }} />
              <Text style={[spacings.mrMi]} shouldScale={false} fontSize={12}>
                {networkData?.name}
              </Text>
              <InformationIcon color={colors.martinique_65} />
            </View>
          </View>
          <Text fontSize={14} shouldScale={false} style={textStyles.highlightPrimary}>
            ${balanceUSD?.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <div className="button-pressable">
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
        </div>
        <View>
          <Dropdown data={data} onSelect={() => null} />
        </View>
      </View>
    </div>
  )
}

export default React.memo(TokenItem)
