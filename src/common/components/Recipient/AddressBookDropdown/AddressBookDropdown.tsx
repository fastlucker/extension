import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { Contact } from '@ambire-common/controllers/addressBook/addressBook'
import { isValidAddress } from '@ambire-common/services/address'
import AccountsFilledIcon from '@common/assets/svg/AccountsFilledIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import WalletFilledIcon from '@common/assets/svg/WalletFilledIcon'
import Text from '@common/components//Text'
import AddressBookContact from '@common/components/AddressBookContact'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import { MenuContainer } from '@common/components/Select'
import useNavigation from '@common/hooks/useNavigation'
import useSelect from '@common/hooks/useSelect'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  filteredContacts: Contact[]
  passRef: React.RefObject<View>
  onContactPress: (address: string) => void
  menuProps: ReturnType<typeof useSelect>['menuProps']
  actualAddress: string
  isRecipientDomainResolving: boolean
}

const TitleRow = ({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon: FC<SvgProps>
  children?: ReactNode
}) => (
  <View
    style={[
      flexbox.directionRow,
      flexbox.alignCenter,
      flexbox.justifySpaceBetween,
      spacings.pt,
      spacings.phSm,
      spacings.mbTy
    ]}
  >
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Icon width={16} height={16} />
      <Text fontSize={14} appearance="secondaryText" weight="medium" style={spacings.mlTy}>
        {title}
      </Text>
    </View>
    {children}
  </View>
)

const AddressBookDropdown: FC<Props> = ({
  isVisible,
  setIsVisible,
  filteredContacts,
  passRef: ref,
  onContactPress,
  menuProps,
  actualAddress,
  isRecipientDomainResolving
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const [bindManageBtnAnim, manageBtnAnimStyle] = useHover({
    preset: 'opacityInverted'
  })

  const onManagePress = useCallback(() => {
    navigate(ROUTES.addressBook)
  }, [navigate])

  const walletAccountsSourcedContacts = filteredContacts.filter(
    (contact) => contact.isWalletAccount
  )
  const manuallyAddedContacts = filteredContacts.filter((contact) => !contact.isWalletAccount)

  useEffect(() => {
    // Hide the dropdown if the address is valid or if the domain is resolving
    if (!actualAddress) return
    if (isRecipientDomainResolving) return setIsVisible(false)

    setIsVisible(!isValidAddress(actualAddress))
  }, [actualAddress, filteredContacts.length, isRecipientDomainResolving, setIsVisible])

  if (!isVisible) return null

  return (
    <MenuContainer menuRef={ref} menuProps={menuProps}>
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
            <TitleRow title={t('Contacts')} icon={AccountsFilledIcon}>
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
            </TitleRow>
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
