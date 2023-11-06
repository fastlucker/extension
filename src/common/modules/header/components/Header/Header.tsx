import React, { useCallback, useEffect, useState } from 'react'
import { ColorValue, Image, Pressable, TouchableOpacity, View } from 'react-native'

// @ts-ignore
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import BurgerIcon from '@common/assets/svg/BurgerIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Button from '@common/components/Button'
import CopyText from '@common/components/CopyText'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation, { titleChangeEventStream } from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import routesConfig from '@common/modules/router/config/routesConfig'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useMainControllerState from '@web/hooks/useMainControllerState'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

interface Props {
  mode?: 'title' | 'controls' | 'custom' | 'custom-inner-content'
  withBackButton?: boolean
  withAmbireLogo?: boolean
  children?: any
  backgroundColor?: ColorValue
  forceBack?: boolean
  onGoBackPress?: () => void
}

const Header: React.FC<Props> = ({
  mode = 'controls',
  withBackButton = true,
  withAmbireLogo,
  children,
  backgroundColor,
  forceBack,
  onGoBackPress
}) => {
  const { theme, styles } = useTheme(getStyles)
  const mainCtrl = useMainControllerState()

  const { path, params } = useRoute()
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountInfo = mainCtrl.accounts.find((acc) => acc.addr === selectedAccount)

  const [title, setTitle] = useState('')
  const handleGoBack = useCallback(() => navigate(params?.backTo || -1), [navigate, params])

  const uiType = getUiType()
  const renderHeaderControls = (
    <View
      style={[flexboxStyles.directionRow, flexboxStyles.flex1, flexboxStyles.justifySpaceBetween]}
    >
      <View style={styles.account}>
        <Pressable style={styles.accountButton} onPress={() => navigate('account-select')}>
          <View style={styles.accountButtonInfo}>
            <Image style={styles.accountButtonInfoIcon} source={avatarSpace} resizeMode="contain" />
            <View style={styles.accountAddressAndLabel}>
              {/* TODO: Hide this text element if the account doesn't have a label when labels are properly implemented */}
              <Text weight="medium" fontSize={14}>
                {selectedAccountInfo?.label ? selectedAccountInfo?.label : 'Account Label'}
              </Text>
              <Text weight="regular" style={styles.accountButtonInfoText} fontSize={13}>
                ({shortenAddress(selectedAccount, 14)})
              </Text>
            </View>
          </View>
          <NavIconWrapper
            onPress={() => navigate('account-select')}
            width={25}
            height={25}
            hoverBackground={theme.primaryLight}
            style={styles.accountButtonRightIcon}
          >
            <RightArrowIcon />
          </NavIconWrapper>
        </Pressable>
        <CopyText text={selectedAccount} style={styles.accountCopyIcon} />
      </View>
      <View style={[flexboxStyles.directionRow]}>
        <Button
          textStyle={{ fontSize: 14 }}
          size="small"
          text={t('dApps')}
          hasBottomSpacing={false}
          style={[spacings.mrTy, { width: 85, height: 40 }]}
        />

        {uiType.isPopup && (
          <NavIconWrapper
            width={40}
            height={40}
            onPress={() => openInTab('tab.html#/dashboard')}
            style={{ borderColor: colors.scampi_20, ...spacings.mrTy }}
          >
            <MaximizeIcon width={20} height={20} />
          </NavIconWrapper>
        )}
        <NavIconWrapper
          width={40}
          height={40}
          onPress={() => navigate('menu')}
          style={{ borderColor: colors.scampi_20 }}
        >
          <BurgerIcon width={20} height={20} />
        </NavIconWrapper>
      </View>
    </View>
  )

  const navigationEnabled = !getUiType().isNotification

  const canGoBack =
    !!params?.prevRoute?.key &&
    params?.prevRoute?.pathname !== '/' &&
    path !== '/get-started' &&
    navigationEnabled

  useEffect(() => {
    if (!path) return

    const nextRoute = path?.substring(1)
    setTitle((routesConfig as any)?.[nextRoute]?.title || '')
  }, [path])

  useEffect(() => {
    const subscription = titleChangeEventStream!.subscribe({ next: (v) => setTitle(v) })
    return () => subscription.unsubscribe()
  }, [])

  const renderBackButton = () => {
    return (
      <TouchableOpacity
        style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}
        onPress={onGoBackPress || handleGoBack}
      >
        <LeftArrowIcon />
        <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
          {t('Back')}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, !!backgroundColor && { backgroundColor }]}>
      {mode === 'controls' && <View style={styles.containerInner}>{renderHeaderControls}</View>}
      {mode === 'title' && (
        <>
          <View style={styles.sideContainer}>
            {!!withBackButton && (!!canGoBack || !!forceBack) && renderBackButton()}
          </View>
          <View style={styles.containerInner}>
            <Text fontSize={30} style={styles.title} numberOfLines={2}>
              {title || ''}
            </Text>
          </View>
          <View style={[styles.sideContainer, flexboxStyles.alignEnd]}>
            {!!withAmbireLogo && <AmbireLogoHorizontal width={72} />}
          </View>
        </>
      )}
      {mode === 'custom-inner-content' && (
        <>
          <View style={styles.sideContainer}>
            {!!withBackButton && !!canGoBack && renderBackButton()}
          </View>
          <View style={styles.containerInner}>{children}</View>
          <View style={[styles.sideContainer, flexboxStyles.alignEnd]}>
            {!!withAmbireLogo && <AmbireLogoHorizontal width={72} />}
          </View>
        </>
      )}
      {mode === 'custom' && children}
    </View>
  )
}

export default React.memo(Header)
