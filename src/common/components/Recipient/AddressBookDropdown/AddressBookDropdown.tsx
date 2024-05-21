import React, { FC, useCallback } from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import AccountsFilledIcon from '@common/assets/svg/AccountsFilledIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import WalletFilledIcon from '@common/assets/svg/WalletFilledIcon'
import Text from '@common/components//Text'
import AddressBookContact from '@common/components/AddressBookContact'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Search from '@common/components/Search'
import { MenuContainer, useSelect } from '@common/components/Select'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  isVisible: boolean
  passRef: React.RefObject<View>
  onContactPress: (address: string) => void
  search: string
  control: Control<
    {
      search: string
    },
    any
  >
  menuProps: ReturnType<typeof useSelect>['menuProps']
}

const TitleRow = ({ title, icon: Icon }: { title: string; icon: FC<SvgProps> }) => (
  <View
    style={[flexbox.directionRow, flexbox.alignCenter, spacings.pt, spacings.phSm, spacings.mbTy]}
  >
    <Icon width={16} height={16} />
    <Text fontSize={14} appearance="secondaryText" weight="medium" style={spacings.mlTy}>
      {title}
    </Text>
  </View>
)

const AddressBookDropdown: FC<Props> = ({
  isVisible,
  passRef: ref,
  onContactPress,
  search,
  control,
  menuProps
}) => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { contacts } = useAddressBookControllerState()
  const [bindManageBtnAnim, manageBtnAnimStyle] = useHover({
    preset: 'opacityInverted'
  })
  const lowercaseSearch = search.toLowerCase()

  const onManagePress = useCallback(() => {
    navigate(ROUTES.addressBook)
  }, [navigate])

  const filteredContacts = contacts.filter((contact) => {
    if (!search) return true

    const lowercaseName = contact.name.toLowerCase()
    const lowercaseAddress = contact.address.toLowerCase()

    return lowercaseAddress.includes(lowercaseSearch) || lowercaseName.includes(lowercaseSearch)
  })

  const walletAccountsSourcedContacts = filteredContacts.filter(
    (contact) => contact.isWalletAccount
  )
  const manuallyAddedContacts = filteredContacts.filter((contact) => !contact.isWalletAccount)

  if (!isVisible) return null

  return (
    <MenuContainer menuRef={ref} menuProps={menuProps}>
      <View style={styles.header}>
        <Search
          placeholder={t('Search...')}
          autoFocus
          control={control}
          leftIconStyle={spacings.pl0}
          containerStyle={spacings.mb0}
          borderless
        />
        <AnimatedPressable
          style={[flexbox.directionRow, flexbox.alignCenter, manageBtnAnimStyle]}
          onPress={onManagePress}
          {...bindManageBtnAnim}
        >
          <SettingsIcon width={18} height={18} color={theme.secondaryText} />
          <Text fontSize={14} style={spacings.mlMi} appearance="secondaryText">
            {t('Manage Contacts')}
          </Text>
        </AnimatedPressable>
      </View>
      <ScrollableWrapper style={{ maxHeight: 300 }}>
        {walletAccountsSourcedContacts.length > 0 ? (
          <>
            <TitleRow title={t('My Wallets')} icon={WalletFilledIcon} />
            {walletAccountsSourcedContacts.map((contact) => (
              <AddressBookContact
                key={contact.address}
                style={{
                  borderRadius: 0
                }}
                address={contact.address}
                name={contact.name}
                onPress={() => onContactPress(contact.address)}
              />
            ))}
          </>
        ) : null}
        {manuallyAddedContacts.length > 0 ? (
          <>
            <TitleRow title={t('Contacts')} icon={AccountsFilledIcon} />
            {manuallyAddedContacts.map((contact) => (
              <AddressBookContact
                key={contact.address}
                style={{
                  borderRadius: 0
                }}
                address={contact.address}
                name={contact.name}
                onPress={() => onContactPress(contact.address)}
              />
            ))}
          </>
        ) : null}
        {manuallyAddedContacts.length === 0 && walletAccountsSourcedContacts.length === 0 ? (
          <Text
            fontSize={16}
            style={[spacings.pv, spacings.ph, text.center]}
            appearance="secondaryText"
          >
            {t('No contacts found')}
          </Text>
        ) : null}
      </ScrollableWrapper>
    </MenuContainer>
  )
}

export default AddressBookDropdown
