import React, { useCallback, useEffect, useState } from 'react'
import { ColorValue, Image, View } from 'react-native'

import avatarFire from '@common/assets/images/avatars/avatar-fire.png'
import avatarSpaceDog from '@common/assets/images/avatars/avatar-space-dog.png'
import avatarSpaceRaccoon from '@common/assets/images/avatars/avatar-space-raccoon.png'
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import BurgerIcon from '@common/assets/svg/BurgerIcon'
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
  mode?: 'title' | 'bottom-sheet'
  backgroundColor?: ColorValue
}

const Header: React.FC<Props> = ({ mode = 'bottom-sheet', backgroundColor }) => {
  const options = [
    {
      label: (
        <View style={[flexboxStyles.alignCenter, flexboxStyles.directionRow]}>
          <Image
            style={{ width: 34, height: 34, borderRadius: 12, ...spacings.mrTy }}
            source={avatarSpace}
            resizeMode="contain"
          />
          <Text weight="medium" shouldScale={false} fontSize={16}>
            Account name
          </Text>
        </View>
      ),
      value: 'Account name'
    },
    {
      label: (
        <View style={[flexboxStyles.alignCenter, flexboxStyles.directionRow]}>
          <Image
            style={{ width: 34, height: 34, borderRadius: 12, ...spacings.mrTy }}
            source={avatarSpaceDog}
            resizeMode="contain"
          />
          <Text weight="medium" shouldScale={false} fontSize={16}>
            Account name 2
          </Text>
        </View>
      ),
      value: 'Account name2'
    },
    {
      label: (
        <View style={[flexboxStyles.alignCenter, flexboxStyles.directionRow]}>
          <Image
            style={{ width: 34, height: 34, borderRadius: 12, ...spacings.mrTy }}
            source={avatarSpaceRaccoon}
            resizeMode="contain"
          />
          <Text weight="medium" shouldScale={false} fontSize={16}>
            Account name 3
          </Text>
        </View>
      ),
      value: 'Account name3'
    },
    {
      label: (
        <View style={[flexboxStyles.alignCenter, flexboxStyles.directionRow]}>
          <Image
            style={{ width: 34, height: 34, borderRadius: 12, ...spacings.mrTy }}
            source={avatarFire}
            resizeMode="contain"
          />
          <Text weight="medium" shouldScale={false} fontSize={16}>
            Account name 4
          </Text>
        </View>
      ),
      value: 'Account name4'
    }
  ]
  const { path, params } = useRoute()
  const { t } = useTranslation()
  const [value, setValue] = useState(options[0])

  const { navigate } = useNavigation()

  const [title, setTitle] = useState('')

  const handleGoBack = useCallback(() => navigate(-1), [navigate])

  const renderBottomSheetSwitcher = (
    <View
      style={[flexboxStyles.directionRow, flexboxStyles.flex1, flexboxStyles.justifySpaceBetween]}
    >
      <Select
        hasArrow
        value={value}
        style={[spacings.mrTy]}
        setValue={(_value) => setValue(_value)}
        options={options}
        menuPlacement="bottom"
        label="Select Account"
      />
      <View style={[flexboxStyles.directionRow]}>
        <Button
          type="primary"
          textStyle={{ fontSize: 14 }}
          size="large"
          text={t('dApps')}
          hasBottomSpacing={false}
          style={[spacings.mrTy]}
        />
        <NavIconWrapper
          style={{ borderColor: colors.scampi_20, ...spacings.mrTy }}
          onPress={handleGoBack}
        >
          <MaximizeIcon />
        </NavIconWrapper>
        <NavIconWrapper style={{ borderColor: colors.scampi_20 }} onPress={handleGoBack}>
          <BurgerIcon />
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

  // Using the `<Header />` from the '@react-navigation/elements' created
  // many complications in terms of styling the UI, calculating the header
  // height and the spacings between the `headerLeftContainerStyle` and the
  // `headerRightContainerStyle`. The calculations never match.
  // Probably due to the fact the box model of the `<Header />` behaves
  // in different manner. And styling it was hell. So instead - implement
  // custom components that fully match the design we follow.
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: SPACING_SM,
          backgroundColor: backgroundColor || colors.wooed
        }
      ]}
    >
      {mode === 'bottom-sheet' && renderBottomSheetSwitcher}

      {mode === 'title' && (
        <Text fontSize={18} weight="regular" style={styles.title} numberOfLines={2}>
          {title || ''}
        </Text>
      )}
    </View>
  )
}

export default React.memo(Header)
