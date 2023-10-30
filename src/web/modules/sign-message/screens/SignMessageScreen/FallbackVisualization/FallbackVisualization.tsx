import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import ErrorOutlineIcon from '@common/assets/svg/ErrorOutlineIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { getMessageAsText } from '@web/modules/sign-message/utils'

import getStyles from './styles'

const FallbackVisualization: FC<{
  messageToSign: SignMessageController['messageToSign']
}> = ({ messageToSign }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  if (!messageToSign) return null

  const { content } = messageToSign

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ErrorOutlineIcon width={24} height={24} />
        <Text style={styles.headerText}>
          <Text fontSize={16} appearance="warningText" weight="semiBold">
            Warning:{' '}
          </Text>
          <Text fontSize={16} appearance="warningText">
            failed to decode the intention of the message.
          </Text>
        </Text>
      </View>
      <Text weight="regular" fontSize={14} appearance="secondaryText" style={spacings.mb}>
        Raw Message:
      </Text>
      <Text weight="regular" fontSize={14} appearance="secondaryText" style={spacings.mb}>
        {content.kind === 'typedMessage'
          ? JSON.stringify(content.message, null, 4)
          : getMessageAsText(content.message) || t('(Empty message)')}
      </Text>
    </View>
  )
}

export default FallbackVisualization
