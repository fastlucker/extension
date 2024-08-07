import React, { FC, ReactNode } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'

import getStyles from './styles'

interface Props {
  title: string | ReactNode
  description: string | ReactNode
  Icon?: React.FC<SvgProps>
  onPrimaryButtonPress: () => void
  onSecondaryButtonPress?: () => void
  primaryButtonText: string
  secondaryButtonText?: string
  primaryButtonTestID?: string
  secondaryButtonTestID?: string
}

const DualChoiceModal: FC<Props> = ({
  title,
  description,
  Icon,
  onSecondaryButtonPress,
  onPrimaryButtonPress,
  primaryButtonText,
  secondaryButtonText,
  secondaryButtonTestID,
  primaryButtonTestID
}) => {
  const { styles } = useTheme(getStyles)

  return (
    <View>
      <View style={styles.modalHeader}>
        <Text weight="medium" fontSize={20}>
          {title}
        </Text>
      </View>
      <View style={styles.modalInnerContainer}>
        {!!Icon && (
          <View>
            <Icon style={spacings.mrLg} color={iconColors.primary} />
          </View>
        )}
        <Text appearance="secondaryText">{description}</Text>
      </View>
      <View style={styles.modalButtonsContainer}>
        {!!secondaryButtonText && !!onSecondaryButtonPress && (
          <Button
            text={secondaryButtonText}
            onPress={onSecondaryButtonPress}
            type="secondary"
            hasBottomSpacing={false}
            size="large"
            style={[styles.button, spacings.mr]}
            testID={secondaryButtonTestID}
          />
        )}
        <Button
          text={primaryButtonText}
          onPress={onPrimaryButtonPress}
          hasBottomSpacing={false}
          size="large"
          style={styles.button}
          testID={primaryButtonTestID}
        />
      </View>
    </View>
  )
}

export default React.memo(DualChoiceModal)
