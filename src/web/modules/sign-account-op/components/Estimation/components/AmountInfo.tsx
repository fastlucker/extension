import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { Props as TextProps } from '@common/components/Text/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const AmountInfoWrapper = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => (
  <View style={[flexbox.directionRow, flexbox.alignCenter]}>{children}</View>
)

const AmountInfoText = ({
  children,
  ...props
}: TextProps & { children: React.ReactNode | React.ReactNode[] }) => (
  <Text fontSize={14} weight="medium" style={spacings.mlMi} {...props}>
    {children}
  </Text>
)

const AmountInfoLabel = ({
  children,
  ...props
}: TextProps & { children: React.ReactNode | React.ReactNode[] }) => (
  <Text fontSize={14} weight="medium" {...props}>
    {children}:
  </Text>
)

const AmountInfo = ({
  label,
  amountFormatted,
  symbol
}: {
  label: string
  amountFormatted: string
  symbol: string | undefined
}) => {
  const { t } = useTranslation()

  return (
    <AmountInfoWrapper>
      <AmountInfoLabel>{t(label)}</AmountInfoLabel>
      <AmountInfoText selectable>
        {amountFormatted} {symbol}
      </AmountInfoText>
    </AmountInfoWrapper>
  )
}

AmountInfo.Wrapper = AmountInfoWrapper
AmountInfo.Label = AmountInfoLabel
AmountInfo.Text = AmountInfoText

export default AmountInfo
