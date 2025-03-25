import React, { FC } from 'react'
import { View, ViewStyle } from 'react-native'

import WarningIcon from '@common/assets/svg/WarningIcon'
import Button, { Props as ButtonProps } from '@common/components/Button'
import { Props as DualChoiceModalProps } from '@common/components/DualChoiceModal/DualChoiceModal'
import CommonText, { Props } from '@common/components/Text'
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

const Text = ({ text, ...rest }: { text: string } & Props) => {
  return (
    <CommonText fontSize={16} appearance="secondaryText" {...rest}>
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
  children,
  secondaryButtonText,
  primaryButtonProps,
  secondaryButtonProps
}: Omit<DualChoiceModalProps, 'description' | 'primaryButtonTestID' | 'secondaryButtonTestID'> & {
  title: string
  description?: string
  children?: React.ReactNode | React.ReactNode[]
  primaryButtonProps?: ButtonProps
  secondaryButtonProps?: ButtonProps
}) => {
  const { theme } = useTheme()
  return (
    <Wrapper>
      <ContentWrapper>
        <TitleAndIcon title={title} />
        {!!description && <Text text={description} />}
        {children}
      </ContentWrapper>
      <ButtonWrapper>
        <Button
          text={primaryButtonText}
          onPress={onPrimaryButtonPress}
          type="warning"
          hasBottomSpacing={false}
          style={spacings.ph2Xl}
          {...primaryButtonProps}
        />
        {secondaryButtonText && onSecondaryButtonPress && (
          <Button
            text={secondaryButtonText}
            onPress={onSecondaryButtonPress}
            type="outline"
            hasBottomSpacing={false}
            style={spacings.phXl}
            accentColor={theme.secondaryText}
            {...secondaryButtonProps}
          />
        )}
      </ButtonWrapper>
    </Wrapper>
  )
}

DualChoiceWarningModal.Wrapper = Wrapper
DualChoiceWarningModal.TitleAndIcon = TitleAndIcon
DualChoiceWarningModal.Text = Text
DualChoiceWarningModal.ContentWrapper = ContentWrapper
DualChoiceWarningModal.ButtonWrapper = ButtonWrapper

export default DualChoiceWarningModal
