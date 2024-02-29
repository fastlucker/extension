import React, { FC, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'

import getStyles from './styles'

interface Props {
  kindOfMessage?: 'typedMessage' | 'message'
}

const Info: FC<Props> = ({ kindOfMessage }) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { currentNotificationRequest } = useNotificationControllerState()

  const renderMessageTypeBadge = useCallback(
    (isHidden?: boolean) => {
      return (
        <View style={[styles.kindOfMessage, isHidden && { opacity: 0 }]}>
          <Text
            fontSize={12}
            color={theme.infoText}
            style={styles.kindOfMessageText}
            numberOfLines={1}
          >
            {kindOfMessage === 'typedMessage' ? 'EIP-712 ' : 'Standard '}
            {t('Type')}
          </Text>
          <InfoIcon width={18} height={18} color={theme.infoDecorative as string} />
        </View>
      )
    },
    [kindOfMessage, styles, theme, t]
  )

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentNotificationRequest?.params?.session?.icon }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        {renderMessageTypeBadge(true)}
        <View style={[flexbox.flex1, spacings.phLg]}>
          <Trans values={{ name: currentNotificationRequest?.params?.session?.name || 'The dApp' }}>
            <Text style={text.center}>
              <Text fontSize={20} appearance="secondaryText" weight="semiBold">
                {'{{name}} '}
              </Text>
              <Text fontSize={20} appearance="secondaryText">
                {t('is requesting your signature')}.
              </Text>
            </Text>
          </Trans>
        </View>
        {renderMessageTypeBadge()}
      </View>
    </View>
  )
}

export default React.memo(Info)
