import { Call } from 'ambire-common/src/libs/accountOp/accountOp'
import React, { useCallback, useState } from 'react'
import { Image, Pressable, View, ViewStyle } from 'react-native'

import DeleteIcon from '@common/assets/svg/DeleteIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import useBackgroundService from '@web/hooks/useBackgroundService'

import styles from './styles'

interface Props {
  style: ViewStyle
  call: Call
}

const TransactionSummary = ({ style, call }: Props) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const { dispatch } = useBackgroundService()

  const handleRemoveCall = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: 'User rejected the transaction request', id: call.fromUserRequestId }
    })
  }, [call.fromUserRequestId, dispatch])

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={() => setIsExpanded((prevState) => !prevState)}>
        <View style={styles.header}>
          <NavIconWrapper
            hoverBackground={colors.lightViolet}
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
              {call.to}
            </Text>
          </View>
          {!!call.fromUserRequestId && (
            <NavIconWrapper
              hoverBackground={colors.lightViolet}
              hoverBorderColor={colors.violet}
              style={{
                borderRadius: 10,
                backgroundColor: 'transparent',
                borderColor: 'transparent'
              }}
              onPress={handleRemoveCall}
            >
              <DeleteIcon width={18} height={20} />
            </NavIconWrapper>
          )}
        </View>
      </Pressable>
      {!!isExpanded && (
        <View style={styles.body}>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Interacting with (to):')} {call.to}
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Value to be sent (value):')} 0.0 MATIC
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Data')}:{call.data}
          </Text>
        </View>
      )}
    </View>
  )
}

export default TransactionSummary
