import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AddIcon from '@common/assets/svg/AddIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

// @TODO: implement address book
const AddressBookSection = () => {
  const { styles, theme } = useTheme(getStyles)
  const { t } = useTranslation()
  return (
    <>
      <View style={flexbox.flex1}>
        <Text style={spacings.mbSm} fontSize={16} weight="regular">
          {t('Address Book')}
        </Text>
        <Text fontSize={14}>Your Address Book is empty.</Text>
        <Text fontSize={14} style={spacings.mbXl}>
          {t('Wanna add some?')}
        </Text>
      </View>
      <Button
        type="secondary"
        size="large"
        style={flexbox.alignSelfStart}
        hasBottomSpacing={false}
        disabled
        textStyle={styles.buttonText}
        text="Add Address"
        childrenPosition="left"
      >
        <AddIcon width={16} height={16} style={spacings.mrTy} color={theme.primary} />
      </Button>
    </>
  )
}

export default React.memo(AddressBookSection)
