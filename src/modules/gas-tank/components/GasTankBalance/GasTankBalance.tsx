import { NetworkId } from 'ambire-common/src/constants/networks'
import React, { useMemo } from 'react'
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
  networkId?: NetworkId
}

const GasTankBalance = ({ data, networkId }: Props) => {
  const { t } = useTranslation()

  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()

  const balanceLabel = useMemo(
    () =>
      !data
        ? '0.00'
        : data
            .map(({ balanceInUSD }: any) => balanceInUSD)
            .reduce((a: any, b: any) => a + b, 0)
            .toFixed(2),
    [data]
  )

  return (
    <>
      <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={openBottomSheet}>
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <GasTankIcon width={21} height={21} viewBoxWidth={20} />
          <Text fontSize={10} style={[textStyles.uppercase, spacings.plMi]}>
            {t('Gas Tank Balance')}
          </Text>
        </View>
        <Text fontSize={32} weight="regular" numberOfLines={1}>
          <Text fontSize={20} weight="regular" style={textStyles.highlightSecondary}>
            ${' '}
          </Text>
          {balanceLabel}
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
