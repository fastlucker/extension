import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Option from '@common/components/Option'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { useGetAddAccountOptions } from '@web/modules/account-select/components/AddAccount/helpers/useGetAddAccountOptions'

const AddAccount = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [isNavigating, setIsNavigating] = useState(true)
  const keystoreState = useKeystoreControllerState()
  const options = useGetAddAccountOptions({
    navigate,
    t,
    hasKeystoreSavedSeed: keystoreState.hasKeystoreSavedSeed,
    isReadyToStoreKeys: keystoreState.isReadyToStoreKeys
  })
  const mainControllerState = useMainControllerState()
  const accountAdderControllerState = useAccountAdderControllerState()

  // this component rerenders twice when accountAdderControllerState enters
  // the below described options. So, to prevent navigating to account adder
  // twice, we use an isNavigating flag
  useEffect(() => {
    if (
      accountAdderControllerState.isInitialized &&
      // The AccountAdder could have been already initialized with the same or a
      // different type. Navigate immediately only if the types match.
      accountAdderControllerState.type === 'internal' &&
      accountAdderControllerState.subType === 'seed' &&
      !isNavigating
    ) {
      setIsNavigating(true)
      navigate(WEB_ROUTES.accountAdder, { state: { goBack: 'dashboard' } })
    } else setIsNavigating(false)
  }, [
    accountAdderControllerState.isInitialized,
    accountAdderControllerState.subType,
    accountAdderControllerState.type,
    navigate,
    isNavigating
  ])

  return (
    <View style={spacings.ptSm}>
      <Text fontSize={16} weight="medium" style={spacings.mbLg}>
        {t('Select one of the following options')}
      </Text>
      {options.map((option) => (
        <Option
          key={option.text}
          text={option.text}
          icon={option.icon}
          onPress={option.onPress}
          hasLargerBottomSpace={option.hasLargerBottomSpace}
          testID={option.testID}
          disabled={mainControllerState.statuses.onAccountAdderSuccess !== 'INITIAL'}
        />
      ))}
    </View>
  )
}

export default React.memo(AddAccount)
