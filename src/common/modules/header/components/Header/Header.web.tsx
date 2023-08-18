import React, { useCallback, useEffect, useState } from 'react'
import { ColorValue, Image, View } from 'react-native'

import avatarFire from '@common/assets/images/avatars/avatar-fire.png'
import avatarSpaceDog from '@common/assets/images/avatars/avatar-space-dog.png'
import avatarSpaceRaccoon from '@common/assets/images/avatars/avatar-space-raccoon.png'
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import BurgerIcon from '@common/assets/svg/BurgerIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import Button from '@common/components/Button'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation, { titleChangeEventStream } from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import routesConfig from '@common/modules/router/config/routesConfig'
import colors from '@common/styles/colors'
import spacings, { SPACING_SM } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

interface Props {
  mode?: 'title' | 'controls'
  withBackButton?: boolean
  backgroundColor?: ColorValue
}

const Header: React.FC<Props> = ({ mode = 'controls', backgroundColor, withBackButton = true }) => {
  const options = [
    {
      label: 'Account name',
      icon: (
        <Image
          style={{ width: 30, height: 30, borderRadius: 10 }}
          source={avatarSpace}
          resizeMode="contain"
        />
      ),
      value: 'Account name'
    },
    {
      label: 'Account name2',
      icon: (
        <Image
          style={{ width: 30, height: 30, borderRadius: 10 }}
          source={avatarSpaceDog}
          resizeMode="contain"
        />
      ),
      value: 'Account name2'
    },
    {
      label: 'Account name3',
      icon: (
        <Image
          style={{ width: 30, height: 30, borderRadius: 10 }}
          source={avatarSpaceRaccoon}
          resizeMode="contain"
        />
      ),
      value: 'Account name3'
    },
    {
      label: 'Account name4',
      icon: (
        <Image
          style={{ width: 30, height: 30, borderRadius: 10 }}
          source={avatarFire}
          resizeMode="contain"
        />
      ),
      value: 'Account name4'
    }
  ]
  const { path, params } = useRoute()
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const [value, setValue] = useState(options[0])

  const [title, setTitle] = useState('')
  const handleGoBack = useCallback(() => navigate(params?.backTo || -1), [navigate, params])

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
        controlStyle={{ width: 220 }}
      />
      <View style={[flexboxStyles.directionRow]}>
        <Button
          textStyle={{ fontSize: 14 }}
          size="small"
          text={t('dApps')}
          hasBottomSpacing={false}
          style={[spacings.mrTy, { width: 85 }]}
        />
        <NavIconWrapper
          onPress={() => null}
          style={{ borderColor: colors.scampi_20, ...spacings.mrTy }}
        >
          <MaximizeIcon width={20} height={20} />
        </NavIconWrapper>
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
    params?.prevRoute?.key !== 'default' && params?.prevRoute?.pathname !== '/' && navigationEnabled

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
    <View style={[styles.container]}>
      {mode === 'controls' && renderHeaderControls}
      {mode === 'title' && (
        <>
          <View style={styles.sideContainer}>
            {!!withBackButton && !!canGoBack && renderBackButton()}
          </View>
          <Text fontSize={18} weight="regular" style={styles.title} numberOfLines={2}>
            {title || ''}
          </Text>
          <View style={styles.sideContainer} />
        </>
      )}
    </View>
  )
}

export default React.memo(Header)
