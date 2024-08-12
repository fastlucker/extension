import React from 'react'
import { useTranslation } from 'react-i18next'
import { ColorValue, View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import TransactionsIcon from '@common/assets/svg/TransactionsIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Text, { Props as TextProps } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const DAppPermissionWrapper = ({ children }: { children: React.ReactNode }) => (
  <View style={[flexbox.directionRow, spacings.mbMd]}>{children}</View>
)

const DAppPermissionIcon = ({
  children,
  backgroundColor
}: {
  children: React.ReactNode
  backgroundColor: ColorValue | string
}) => (
  <View
    style={{
      backgroundColor,
      width: 32,
      height: 32,
      ...flexbox.center,
      ...spacings.mrTy,
      borderRadius: 25
    }}
  >
    {children}
  </View>
)

const DAppPermissionText = ({ children, ...rest }: { children: React.ReactNode } & TextProps) => (
  <Text appearance="secondaryText" fontSize={16} {...rest}>
    {children}
  </Text>
)

const DAppPermissions = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={spacings.mbLg}>
      <DAppPermissionWrapper>
        <DAppPermissionIcon backgroundColor={colors.lightAzureBlue}>
          <VisibilityIcon width={22} height={22} color={colors.azureBlue} />
        </DAppPermissionIcon>
        <DAppPermissionText style={spacings.ptMi}>
          Allow the dApp to{' '}
          <DAppPermissionText weight="medium">{t('see your addresses')}</DAppPermissionText>
        </DAppPermissionText>
      </DAppPermissionWrapper>
      <DAppPermissionWrapper>
        <DAppPermissionIcon backgroundColor={theme.infoBackground}>
          <TransactionsIcon width={16} height={16} color={theme.infoDecorative} />
        </DAppPermissionIcon>
        <DAppPermissionText style={spacings.ptMi}>
          Allow the dApp to{' '}
          <DAppPermissionText weight="medium">{t('propose transactions')}</DAppPermissionText>
        </DAppPermissionText>
      </DAppPermissionWrapper>
      <DAppPermissionWrapper>
        <DAppPermissionIcon backgroundColor={theme.errorBackground}>
          <CloseIcon width={14} height={14} color={theme.errorDecorative} />
        </DAppPermissionIcon>
        <DAppPermissionText style={spacings.ptMi}>
          The dApp <DAppPermissionText weight="medium">{t('cannot move funds')}</DAppPermissionText>{' '}
          without your permission
        </DAppPermissionText>
      </DAppPermissionWrapper>
    </View>
  )
}

export default DAppPermissions
