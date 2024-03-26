import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

interface Props {
  address: string
  name: string
}

const ManageContact: FC<Props> = ({ address, name }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()
  const [bindRemoveBtnAnim, removeBtnAnimStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })

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
    <>
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
    </>
  )
}

export default ManageContact
