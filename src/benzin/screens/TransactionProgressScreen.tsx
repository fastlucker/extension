import React from 'react'
import { Pressable, View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import ConfirmedIcon from '@common/assets/svg/ConfirmedIcon'
import CopyIcon from '@common/assets/svg/CopyIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import styles from './styles'

const TransactionProgressScreen = () => {
  const { theme } = useTheme()
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <AmbireLogo width={148} height={69} />
        </View>
        <Text fontSize={20} weight="medium" style={[spacings.mb3Xl, { textAlign: 'center' }]}>
          Transaction Progress
        </Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <ConfirmedIcon color={theme.successDecorative} style={styles.confirmedIcon} />
            <Text fontSize={16} weight="medium" style={styles.title}>
              Signed
            </Text>
            <View style={styles.row}>
              <Text appearance="secondaryText" fontSize={14}>
                Timestamp
              </Text>
              <Text appearance="secondaryText" fontSize={14}>
                04 APR 2023, 1:45 PM
              </Text>
            </View>
            <View style={styles.row}>
              <Text appearance="secondaryText" fontSize={14}>
                Transaction fee
              </Text>
              <Text appearance="secondaryText" fontSize={14}>
                0.001487535107372448 ETH ($2.78)
              </Text>
            </View>
            <View style={styles.row}>
              <Text appearance="secondaryText" fontSize={14}>
                Transaction ID
              </Text>
              <Text appearance="secondaryText" fontSize={12}>
                0xb31f8cb1e84c59d449748242a3093ad8720c3cb01fa6a8f340f44713f95394d2
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <ConfirmedIcon color={theme.successDecorative} style={styles.confirmedIcon} />
            <Text fontSize={16} weight="medium" style={styles.title}>
              Transaction details
            </Text>
          </View>
          <View style={[styles.step, spacings.pb0]}>
            <ConfirmedIcon color={theme.successDecorative} style={styles.confirmedIcon} />
            <Text
              fontSize={16}
              weight="medium"
              appearance="successText"
              style={[styles.title, spacings.mb0]}
            >
              Confirmed
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text appearance="secondaryText" fontSize={14}>
            Timestamp
          </Text>
          <Text appearance="secondaryText" fontSize={14}>
            04 APR 2023, 1:47 PM
          </Text>
        </View>
        <View style={[styles.row, spacings.mbXl]}>
          <Text appearance="secondaryText" fontSize={14}>
            Block number
          </Text>
          <Text appearance="secondaryText" fontSize={14}>
            17087709
          </Text>
        </View>
        <View style={styles.buttons}>
          <Pressable style={styles.openExplorer}>
            <OpenIcon color={theme.primary} />
            <Text
              fontSize={16}
              appearance="primary"
              weight="medium"
              style={styles.openExplorerText}
            >
              Open explorer
            </Text>
          </Pressable>
          <Button style={{ width: 200, ...spacings.mlLg, ...spacings.mb0 }}>
            <CopyIcon color="#fff" />
            <Text style={{ color: '#fff', ...spacings.mlSm }} fontSize={16} weight="medium">
              Copy link
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default TransactionProgressScreen
