import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import DAppsIcon from '@common/assets/svg/DAppsIcon'
import PowerIcon from '@common/assets/svg/PowerIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

type Props = {
  isHovered?: boolean
  isConnected: boolean
  inModal?: boolean
  hasDapp: boolean
  name?: string
  icon?: string | null
  url?: string
  networkName?: string
  favorite?: boolean
  isCurrentDapp?: boolean
  openBottomSheet: (dest?: 'top' | 'default' | undefined) => void
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}

const DappControl = ({
  hasDapp,
  name,
  icon,
  url,
  networkName,
  favorite,
  inModal,
  isHovered,
  isConnected,
  isCurrentDapp,
  openBottomSheet,
  closeBottomSheet
}: Props) => {
  const { styles, theme } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()

  const showDisconnectButton = !!isConnected && (isHovered || inModal)

  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text weight="medium" fontSize={12} appearance="secondaryText">
          {t(`Manage ${isCurrentDapp ? 'current ' : ''}dApp`)}
        </Text>
      </View>

      <View style={styles.border}>
        {hasDapp ? (
          <View style={styles.currentDApp}>
            <Image source={{ uri: icon || '' }} resizeMode="contain" style={styles.icon} />
            <View style={[spacings.mlMi, flexbox.flex1]}>
              <Text fontSize={12} weight="medium" numberOfLines={1} style={spacings.mrMi}>
                {name}
              </Text>
              <Text
                weight="regular"
                color={isConnected ? theme.successText : theme.errorText}
                fontSize={10}
              >
                {isConnected ? t(`Connected on ${networkName}`) : t('Not connected')}
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
          {!!showDisconnectButton && !!url && (
            <Button
              type="danger"
              size="small"
              hasBottomSpacing={false}
              text={t('Disconnect')}
              style={spacings.mrTy}
              onPress={() => {
                dispatch({
                  type: 'DAPPS_CONTROLLER_REMOVE_CONNECTED_SITE',
                  params: { origin: url }
                })
              }}
            >
              <View style={spacings.plTy}>
                <PowerIcon />
              </View>
            </Button>
          )}
          <Button
            type="secondary"
            size="small"
            hasBottomSpacing={false}
            text={inModal ? t('Close') : t('Manage')}
            disabled={!isConnected}
            onPress={() => {
              !inModal && openBottomSheet()
              inModal && closeBottomSheet()
            }}
          >
            <View style={spacings.plTy}>
              {!inModal && <UpArrowIcon color={theme.primary} />}
              {!!inModal && <CloseIcon color={theme.primary} />}
            </View>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default React.memo(DappControl)
