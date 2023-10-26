import React, { useState } from 'react'
import { Image, Pressable, View, ViewStyle } from 'react-native'

import DeleteIcon from '@common/assets/svg/DeleteIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'

import styles from './styles'

interface Props {
  style: ViewStyle
}

const TransactionSummary = ({ style }: Props) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={() => setIsExpanded((prevState) => !prevState)}>
        <View style={styles.header}>
          <NavIconWrapper
            hoverBackground={theme.primaryLight}
            style={{ borderColor: 'transparent', borderRadius: 10 }}
            onPress={() => setIsExpanded((prevState) => !prevState)}
          >
            <DownArrowIcon width={36} height={36} isActive={isExpanded} withRect />
          </NavIconWrapper>
          <View style={styles.headerContent}>
            <Text weight="semiBold" style={[styles.action, styles.mr5, styles.text]}>
              {t('Send')}
            </Text>
            <Text style={[styles.mr5, styles.text]} weight="medium">
              10000.0
            </Text>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
              }}
              style={[styles.tokenImg, styles.mr5]}
            />
            <Text weight="medium" style={[styles.text, styles.mr5]}>
              USDC
            </Text>
            <Text weight="regular" style={[styles.to, styles.mr5, styles.text]}>
              {t('to')}
            </Text>
            <Text style={styles.text} weight="medium">
              0x5a2fae94BDaa7B30B6049b1f5c9C86C3E4fd212F
            </Text>
          </View>
          <NavIconWrapper
            hoverBackground={theme.primaryLight}
            hoverBorderColor={theme.primary}
            style={{ borderRadius: 10, backgroundColor: 'transparent', borderColor: 'transparent' }}
            onPress={() => null}
          >
            <DeleteIcon width={18} height={20} />
          </NavIconWrapper>
        </View>
      </Pressable>
      {!!isExpanded && (
        <View style={styles.body}>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Interacting with (to):')} 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 (USDC token)
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Value to be sent (value):')} 0.0 MATIC
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Data')}:
            0xa9059cbb0000000000000000000000009876b9765f7327f323faf7ec9b33760ae9b3910900000000000000000000000000000000000000000000000000000000000f4240
          </Text>
        </View>
      )}
    </View>
  )
}

export default TransactionSummary
