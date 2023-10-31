import React, { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'

import getStyles from './styles'

interface Props {
  kindOfMessage?: 'typedMessage' | 'message'
}

const Info: FC<Props> = ({ kindOfMessage }) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { currentNotificationRequest } = useNotificationControllerState()
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentNotificationRequest?.params?.session?.icon }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Trans values={{ name: currentNotificationRequest?.params?.session?.name || 'The dApp' }}>
          <Text>
            <Text fontSize={20} appearance="secondaryText" weight="semiBold">
              {'{{name}} '}
            </Text>
            <Text fontSize={20} appearance="secondaryText">
              {t('is requesting your signature')}.
            </Text>
          </Text>
        </Trans>
        <View style={styles.kindOfMessage}>
          <Text
            weight="regular"
            fontSize={14}
            color={theme.infoText}
            style={styles.kindOfMessageText}
          >
            {kindOfMessage === 'typedMessage' ? 'EIP-712 ' : 'Standard '}
            {t('Type')}
          </Text>
          <InfoIcon color={theme.infoDecorative as string} />
        </View>
      </View>
    </View>
  )
}

export default Info
