import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View } from 'react-native'

import ConnectionStatusIcon from '@common/assets/svg/ConnectionStatusIcon'
import DAppsIcon from '@common/assets/svg/DAppsIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import networks from '@common/constants/networks'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useExtension from '@web/hooks/useExtension'

import getStyles from './styles'

const DAppFooter = () => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { site, disconnectDapp } = useExtension()
  const siteNetwork = networks.find((network) => network.chainId === site?.chainId)

  return (
    <View style={styles.container}>
      {site ? (
        <View style={styles.currentDApp}>
          <Pressable
            onPress={() => {
              if (!site?.origin || !site?.isConnected) return

              disconnectDapp(site?.origin)
            }}
          >
            <ConnectionStatusIcon
              connectedColor={theme.successDecorative}
              disconnectedColor={theme.errorDecorative}
              withRect={false}
              isActive={site?.isConnected}
              width={24}
              height={24}
              style={spacings.mrTy}
            />
          </Pressable>
          <Image source={{ uri: site?.icon }} resizeMode="contain" style={styles.icon} />
          <View style={spacings.mlTy}>
            <Text fontSize={14} weight="regular">
              {site?.origin}
            </Text>
            <Text
              weight="regular"
              color={site?.isConnected ? theme.successText : theme.errorText}
              fontSize={12}
            >
              {site?.isConnected ? `Connected on ${siteNetwork?.name}` : 'Not connected'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.currentDApp}>
          <DAppsIcon width={24} height={24} color={theme.secondaryText} />
          <Text fontSize={14} appearance="secondaryText" weight="regular" style={spacings.mlTy}>
            {t('No DApp found')}
          </Text>
        </View>
      )}
      <View style={styles.buttons}>
        <Button
          type="secondary"
          size="small"
          style={styles.button}
          text="Configure"
          disabled={!site?.isConnected}
        />
        <Button text="All DApps" size="small" style={styles.button} />
      </View>
    </View>
  )
}

export default DAppFooter
