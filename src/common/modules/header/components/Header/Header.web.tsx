import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, View } from 'react-native'

import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import BurgerIcon from '@common/assets/svg/BurgerIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Button from '@common/components/Button'
import CopyText from '@common/components/CopyText'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation, { titleChangeEventStream } from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import routesConfig from '@common/modules/router/config/routesConfig'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useMainControllerState from '@web/hooks/useMainControllerState'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

interface Props {
  mode?: 'title' | 'controls'
  withBackButton?: boolean
  withAmbireLogo?: boolean
}

const Header: React.FC<Props> = ({ mode = 'controls', withBackButton = true, withAmbireLogo }) => {
  const mainCtrl = useMainControllerState()

  const options = useMemo(
    () =>
      mainCtrl.selectedAccount
        ? [
            {
              label: (
                <View
                  style={[
                    flexboxStyles.directionRow,
                    flexboxStyles.justifySpaceBetween,
                    flexboxStyles.alignCenter,
                    { width: '100%' }
                  ]}
                >
                  <Text fontSize={14}>{shortenAddress(mainCtrl.selectedAccount, 14)}</Text>
                  <CopyText
                    text={mainCtrl.selectedAccount}
                    style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                  />
                </View>
              ),
              icon: (
                <Image
                  style={{ width: 30, height: 30, borderRadius: 10 }}
                  source={avatarSpace}
                  resizeMode="contain"
                />
              ),
              value: mainCtrl.selectedAccount
            }
          ]
        : [],
    [mainCtrl.selectedAccount]
  )

  const { path, params } = useRoute()
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const [value, setValue] = useState(options[0])

  useEffect(() => {
    if (value !== options[0]) {
      setValue(options[0])
    }
  }, [mainCtrl.selectedAccount, value, options])

  const [title, setTitle] = useState('')
  const handleGoBack = useCallback(() => navigate(params?.backTo || -1), [navigate, params])

  const uiType = getUiType()
  const renderHeaderControls = (
    <View
      style={[flexboxStyles.directionRow, flexboxStyles.flex1, flexboxStyles.justifySpaceBetween]}
    >
      <Select
        hasArrow
        value={value}
        style={{ ...spacings.mrTy }}
        setValue={(_value) => setValue(_value)}
        options={options}
        menuPlacement="bottom"
        iconWidth={25}
        iconHeight={25}
        controlStyle={{ width: 235 }}
        openMenuOnClick={false}
        onDropdownOpen={() => navigate('account-select')}
      />
      <View style={[flexboxStyles.directionRow]}>
        <Button
          textStyle={{ fontSize: 14 }}
          size="small"
          text={t('dApps')}
          hasBottomSpacing={false}
          style={[spacings.mrTy, { width: 85 }]}
        />

        {uiType.isPopup && (
          <NavIconWrapper
            onPress={() => openInTab('tab.html#/dashboard')}
            style={{ borderColor: colors.scampi_20, ...spacings.mrTy }}
          >
            <MaximizeIcon width={20} height={20} />
          </NavIconWrapper>
        )}
        <NavIconWrapper onPress={() => navigate('menu')} style={{ borderColor: colors.scampi_20 }}>
          <BurgerIcon width={20} height={20} />
        </NavIconWrapper>
      </View>
    </View>
  )

  const navigationEnabled = !getUiType().isNotification
  let canGoBack =
    // If you have a location key that means you routed in-app. But if you
    // don't that means you come from outside of the app or you just open it.
    (params?.prevRoute?.key !== 'default' ||
      /* Because of window.history.pushState, used in the Tabs component, the
       prevRoute.key gets set to 'default' when you navigate to another route from the dashboard,
       which hides the back button in the header. */
      params?.prevRoute?.pathname === `/${ROUTES.dashboard}`) &&
    params?.prevRoute?.pathname !== '/' &&
    navigationEnabled

  if (isExtension && getUiType().isTab) {
    canGoBack = true
  }

  useEffect(() => {
    if (!path) return

    const nextRoute = path?.substring(1)
    setTitle(routesConfig[nextRoute]?.title || '')
  }, [path])

  useEffect(() => {
    const subscription = titleChangeEventStream!.subscribe({
      next: (v) => setTitle(v)
    })

    return () => subscription.unsubscribe()
  }, [])

  const renderBackButton = () => {
    if (canGoBack) {
      return (
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <NavIconWrapper onPress={handleGoBack} style={styles.navIconContainerRegular}>
            <LeftArrowIcon width={36} height={36} />
          </NavIconWrapper>
          <Text style={spacings.plTy} fontSize={16} weight="medium">
            {t('Back')}
          </Text>
        </View>
      )
    }

    return null
  }

  // Using the `<Header />` from the '@react-navigation/elements' created
  // many complications in terms of styling the UI, calculating the header
  // height and the spacings between the `headerLeftContainerStyle` and the
  // `headerRightContainerStyle`. The calculations never match.
  // Probably due to the fact the box model of the `<Header />` behaves
  // in different manner. And styling it was hell. So instead - implement
  // custom components that fully match the design we follow.
  return (
    <View style={styles.container}>
      {mode === 'controls' && <View style={styles.containerInner}>{renderHeaderControls}</View>}
      {mode === 'title' && (
        <>
          {!withAmbireLogo && (
            <View style={styles.sideContainer}>
              {!!withBackButton && !!canGoBack && renderBackButton()}
            </View>
          )}
          <View style={styles.containerInner}>
            {!!withAmbireLogo && (
              <View style={styles.sideContainer}>
                <AmbireLogoHorizontal />
              </View>
            )}

            <Text fontSize={18} weight="medium" style={styles.title} numberOfLines={2}>
              {title || ''}
            </Text>
            {!!withAmbireLogo && <View style={styles.sideContainer} />}
          </View>
          {!withAmbireLogo && <View style={styles.sideContainer} />}
        </>
      )}
    </View>
  )
}

export default React.memo(Header)
