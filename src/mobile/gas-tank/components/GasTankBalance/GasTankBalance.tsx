import { NetworkId } from 'ambire-common/src/constants/networks'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import GasTankIcon from '@assets/svg/GasTankIcon'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import { useTranslation } from '@config/localization'

import TokensListItem from '../TokensList/TokensListItem'
import styles from './styles'

interface Props {
  data: any
  totalBalance: string
  balanceByTokensDisabled: boolean
  networkId?: NetworkId
}

const GasTankBalance = ({ data, totalBalance, balanceByTokensDisabled, networkId }: Props) => {
  const { t } = useTranslation()

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={balanceByTokensDisabled ? 1 : 0.6}
        onPress={!balanceByTokensDisabled ? openBottomSheet : () => null}
      >
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <GasTankIcon width={21} height={21} />
          <Text fontSize={10} style={[spacings.plMi]}>
            {t('Balance on All Networks')}
          </Text>
        </View>
        <Text fontSize={32} weight="regular" numberOfLines={1}>
          <Text fontSize={20} weight="regular" style={textStyles.highlightPrimary}>
            ${' '}
          </Text>
          {totalBalance}
        </Text>
      </TouchableOpacity>
      <BottomSheet
        id="balance-by-tokens-bottom-sheet"
        sheetRef={sheetRef}
        closeBottomSheet={() => {
          closeBottomSheet()
        }}
      >
        <Title style={textStyles.center}>{t('Gas tank balance by tokens')}</Title>
        {data
          ?.sort((a: any, b: any) => b.balance - a.balance)
          ?.map((token: any, i: number) => (
            <TokensListItem
              // eslint-disable-next-line react/no-array-index-key
              key={`token-${token.address}-${i}`}
              type="balance"
              token={token}
              networkId={networkId}
            />
          ))}
      </BottomSheet>
    </>
  )
}

export default React.memo(GasTankBalance)
