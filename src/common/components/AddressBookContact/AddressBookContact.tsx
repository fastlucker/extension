import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import shortenAddress from '@web/utils/shortenAddress'

import { Avatar } from '../Avatar'
import Editable from '../Editable'
import Text from '../Text'

interface Props {
  address: string
  name: string
  isWalletAccount?: boolean
  onPress?: () => void
}

const AddressBookContact: FC<Props> = ({ address, name, isWalletAccount, onPress }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })
  const { dispatch } = useBackgroundService()
  const ContainerElement = onPress ? AnimatedPressable : View

  const onSave = (newName: string) => {
    dispatch({
      type: 'ADDRESS_BOOK_CONTROLLER_RENAME_CONTACT',
      params: {
        address,
        newName
      }
    })
    addToast(t('Successfully renamed contact'))
  }

  return (
    <ContainerElement
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        spacings.phTy,
        spacings.pvTy,
        common.borderRadiusPrimary,
        onPress && animStyle
      ]}
      onPress={onPress}
      {...(onPress ? bindAnim : {})}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <Avatar pfp={address} size={32} />
        <View>
          <Editable
            fontSize={14}
            textProps={{
              weight: 'medium'
            }}
            height={20}
            minWidth={100}
            value={name}
            onSave={onSave}
          />
          <Text selectable fontSize={12} appearance="secondaryText">
            {shortenAddress(address, 32)}
          </Text>
        </View>
      </View>
      {!isWalletAccount && (
        <Pressable
          style={[
            spacings.mlSm,
            flexbox.center,
            {
              width: 32,
              height: 32
            }
          ]}
        >
          <KebabMenuIcon color={theme.secondaryText} height={16} />
        </Pressable>
      )}
    </ContainerElement>
  )
}

export default AddressBookContact
