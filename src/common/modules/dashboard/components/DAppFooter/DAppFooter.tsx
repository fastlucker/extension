import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import DAppsIcon from '@common/assets/svg/DAppsIcon'
import PowerIcon from '@common/assets/svg/PowerIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import networks from '@common/constants/networks'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useExtension from '@web/hooks/useExtension'

import getStyles from './styles'

const DAppFooter = () => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { site, disconnectDapp } = useExtension()
  const siteNetwork = networks.find((network) => network.chainId === site?.chainId)

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text weight="medium" fontSize={10}>
          {t('Manage current dApp')}
        </Text>
      </View>
      <View style={styles.border}>
        {site ? (
          <View style={styles.currentDApp}>
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
        <View style={flexbox.directionRow}>
          <Button
            type="danger"
            size="small"
            hasBottomSpacing={false}
            text="Disconnect"
            style={spacings.mrSm}
            disabled={!site?.isConnected}
            onPress={() => {
              if (!site?.origin || !site?.isConnected) return

              disconnectDapp(site?.origin)
            }}
          >
            <View style={spacings.plTy}>
              <PowerIcon />
            </View>
          </Button>
          <Button
            type="secondary"
            size="small"
            hasBottomSpacing={false}
            text="Settings"
            disabled={!site?.isConnected}
          >
            <View style={spacings.plTy}>
              <UpArrowIcon color={theme.primary} />
            </View>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default React.memo(DAppFooter)
