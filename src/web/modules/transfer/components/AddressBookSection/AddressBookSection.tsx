import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AddIcon from '@common/assets/svg/AddIcon'
import AddressBookContact from '@common/components/AddressBookContact'
import Button from '@common/components/Button'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

const AddressBookSection = () => {
  const { dispatch } = useBackgroundService()
  const { contacts } = useAddressBookControllerState()
  const { styles, theme } = useTheme(getStyles)
  const { t } = useTranslation()

  const onContactPress = (address: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: {
        addressState: {
          fieldValue: address,
          ensAddress: '',
          udAddress: '',
          isDomainResolving: false
        }
      }
    })
  }

  return (
    <View style={flexbox.flex1}>
      <Text style={spacings.mbSm} fontSize={16} weight="regular">
        {t('Address Book')}
      </Text>
      <ScrollableWrapper style={flexbox.flex1}>
        <View style={spacings.mbLg}>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <AddressBookContact
                key={contact.name}
                name={contact.name}
                address={contact.address}
                onPress={() => onContactPress(contact.address)}
              />
            ))
          ) : (
            <>
              <Text fontSize={14}>{t('Your Address Book is empty.')}</Text>
              <Text fontSize={14} style={spacings.mbXl}>
                {t('Wanna add some?')}
              </Text>
            </>
          )}
        </View>
        <Button
          type="secondary"
          size="large"
          style={flexbox.alignSelfStart}
          hasBottomSpacing={false}
          textStyle={styles.buttonText}
          text="Add Address"
          childrenPosition="left"
        >
          <AddIcon width={16} height={16} style={spacings.mrTy} color={theme.primary} />
        </Button>
      </ScrollableWrapper>
    </View>
  )
}

export default React.memo(AddressBookSection)
