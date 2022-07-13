import { NetworkId } from 'ambire-common/src/constants/networks'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import GasTankIcon from '@assets/svg/GasTankIcon'
import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

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

  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={balanceByTokensDisabled ? 1 : 0.6}
        onPress={!balanceByTokensDisabled ? openBottomSheet : () => null}
      >
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <GasTankIcon width={21} height={21} />
          <Text fontSize={10} style={[textStyles.uppercase, spacings.plMi]}>
            {t('Gas Tank Balance')}
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
        isOpen={isOpen}
        closeBottomSheet={() => {
          closeBottomSheet()
        }}
      >
        <Title style={textStyles.center}>{t('Gas tank balance by tokens')}</Title>
        {data.map((token: any, i: number) => (
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
