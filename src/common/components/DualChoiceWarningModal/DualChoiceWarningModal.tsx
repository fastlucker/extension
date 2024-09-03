import React, { FC } from 'react'
import { View, ViewStyle } from 'react-native'

import WarningIcon from '@common/assets/svg/WarningIcon'
import Button from '@common/components/Button'
import { Props as DualChoiceModalProps } from '@common/components/DualChoiceModal/DualChoiceModal'
import CommonText from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

const Wrapper: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const { styles } = useTheme(getStyles)

  return <View style={styles.container}>{children}</View>
}

const TitleAndIcon = ({ title, style }: { title: string; style?: ViewStyle }) => {
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={[styles.titleAndIcon, style]}>
      <View style={spacings.mbTy}>
        <WarningIcon width={32} height={32} color={theme.warningDecorative} />
      </View>
      <CommonText appearance="warningText" weight="medium" fontSize={20}>
        {title}
      </CommonText>
    </View>
  )
}

const Text = ({ text }: { text: string }) => {
  return (
    <CommonText fontSize={16} appearance="secondaryText">
      {text}
    </CommonText>
  )
}

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { styles } = useTheme(getStyles)

  return <View style={styles.content}>{children}</View>
}

const ButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  const { styles } = useTheme(getStyles)

  return <View style={styles.buttons}>{children}</View>
}

const DualChoiceWarningModal = ({
  title,
  description,
  onSecondaryButtonPress,
  onPrimaryButtonPress,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonTestID,
  secondaryButtonTestID
}: Omit<DualChoiceModalProps, 'description'> & { title: string; description?: string }) => {
  const { theme } = useTheme()
  return (
    <Wrapper>
      <ContentWrapper>
        <TitleAndIcon style={spacings.mbXl} title={title} />
        {!!description && <Text text={description} />}
      </ContentWrapper>
      <ButtonWrapper>
        <Button
          text={primaryButtonText}
          onPress={onPrimaryButtonPress}
          type="warning"
          hasBottomSpacing={false}
          testID={primaryButtonTestID}
          style={spacings.ph2Xl}
        />
        {secondaryButtonText && onSecondaryButtonPress && (
          <Button
            text={secondaryButtonText}
            onPress={onSecondaryButtonPress}
            type="outline"
            hasBottomSpacing={false}
            testID={secondaryButtonTestID}
            style={spacings.phXl}
            accentColor={theme.secondaryText}
          />
        )}
      </ButtonWrapper>
    </Wrapper>
  )
}

DualChoiceWarningModal.TitleAndIcon = TitleAndIcon
DualChoiceWarningModal.Text = Text
DualChoiceWarningModal.ContentWrapper = ContentWrapper
DualChoiceWarningModal.ButtonWrapper = ButtonWrapper

export default DualChoiceWarningModal
