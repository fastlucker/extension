import React, { createContext, FC, useContext, useMemo } from 'react'
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

const dAppPermissionWrapperContext = createContext({
  isSmall: false
})

const DAppPermissionWrapper = ({
  children,
  isSmall
}: {
  children: React.ReactNode
  isSmall: boolean
}) => {
  const contextValue = useMemo(() => ({ isSmall }), [isSmall])
  return (
    <dAppPermissionWrapperContext.Provider value={contextValue}>
      <View style={[flexbox.directionRow, spacings.mbMd]}>{children}</View>
    </dAppPermissionWrapperContext.Provider>
  )
}

const DAppPermissionIcon = ({
  children,
  backgroundColor
}: {
  children: React.ReactNode
  backgroundColor: ColorValue | string
}) => {
  const { isSmall } = useContext(dAppPermissionWrapperContext)
  return (
    <View
      style={{
        backgroundColor,
        width: isSmall ? 24 : 32,
        height: isSmall ? 24 : 32,
        ...flexbox.center,
        ...spacings.mrTy,
        borderRadius: 25
      }}
    >
      {children}
    </View>
  )
}

const DAppPermissionText = ({ children, ...rest }: { children: React.ReactNode } & TextProps) => {
  const { isSmall } = useContext(dAppPermissionWrapperContext)

  return (
    <Text appearance="secondaryText" fontSize={isSmall ? 14 : 16} {...rest}>
      {children}
    </Text>
  )
}

const DAppPermissions: FC<{ isSmall: boolean }> = ({ isSmall }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={isSmall ? spacings.mb : spacings.mbLg}>
      <DAppPermissionWrapper isSmall={isSmall}>
        <DAppPermissionIcon backgroundColor={colors.lightAzureBlue}>
          <VisibilityIcon
            width={isSmall ? 20 : 24}
            height={isSmall ? 20 : 24}
            color={colors.azureBlue}
          />
        </DAppPermissionIcon>
        <DAppPermissionText style={spacings.ptMi}>
          Allow the dApp to{' '}
          <DAppPermissionText weight="medium">{t('see your addresses')}</DAppPermissionText>
        </DAppPermissionText>
      </DAppPermissionWrapper>
      <DAppPermissionWrapper isSmall={isSmall}>
        <DAppPermissionIcon backgroundColor={theme.infoBackground}>
          <TransactionsIcon
            width={isSmall ? 14 : 18}
            height={isSmall ? 14 : 18}
            color={theme.infoDecorative}
          />
        </DAppPermissionIcon>
        <DAppPermissionText style={spacings.ptMi}>
          Allow the dApp to{' '}
          <DAppPermissionText weight="medium">{t('propose transactions')}</DAppPermissionText>
        </DAppPermissionText>
      </DAppPermissionWrapper>
      <DAppPermissionWrapper isSmall={isSmall}>
        <DAppPermissionIcon backgroundColor={theme.errorBackground}>
          <CloseIcon
            width={isSmall ? 10 : 14}
            height={isSmall ? 10 : 14}
            color={theme.errorDecorative}
          />
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
