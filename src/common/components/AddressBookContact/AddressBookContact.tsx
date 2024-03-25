import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import { Avatar } from '@common/components/Avatar'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import shortenAddress from '@web/utils/shortenAddress'

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
  const [bindRemoveBtnAnim, removeBtnAnimStyle] = useCustomHover({
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

  const removeContact = () => {
    dispatch({
      type: 'ADDRESS_BOOK_CONTROLLER_REMOVE_CONTACT',
      params: {
        address
      }
    })
    addToast(t(`Successfully deleted ${name} from your address book.`))
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
            maxLength={32}
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
          // @ts-ignore
          dataSet={{
            tooltipId: `${address}`
          }}
        >
          <KebabMenuIcon color={theme.secondaryText} height={16} />
        </Pressable>
      )}
      <Tooltip
        id={address}
        style={{
          padding: 0,
          overflow: 'hidden'
        }}
        clickable
        noArrow
        place="bottom-end"
      >
        <AnimatedPressable
          style={[text.center, spacings.pvTy, spacings.ph, removeBtnAnimStyle]}
          onPress={removeContact}
          {...bindRemoveBtnAnim}
        >
          <Text fontSize={12}>Delete Address</Text>
        </AnimatedPressable>
      </Tooltip>
    </ContainerElement>
  )
}

export default AddressBookContact
