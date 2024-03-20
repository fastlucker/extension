import * as Clipboard from 'expo-clipboard'
import React, { FC, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
// import AddressBookIcon from '@common/assets/svg/AddressBookIcon'
import CopyIcon from '@common/assets/svg/CopyIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text, { Props as TextProps } from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import shortenAddress from '@web/utils/shortenAddress'

import Option from './BaseAddressOption'

interface Props extends TextProps {
  rawAddress: string
  explorerNetworkId?: NetworkDescriptor['id']
}

const BaseAddress: FC<Props> = ({ children, rawAddress, explorerNetworkId, ...rest }) => {
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { networks } = useSettingsControllerState()
  const network = networks.find((n) => n.id === explorerNetworkId)

  const handleCopyAddress = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(rawAddress)
      addToast('Address copied to clipboard')
    } catch {
      addToast('Failed to copy address', {
        type: 'error'
      })
    }
  }, [addToast, rawAddress])

  return (
    <View style={[flexbox.alignCenter, flexbox.directionRow]}>
      <Text fontSize={14} weight="medium" appearance="primaryText" selectable {...rest}>
        {children}
      </Text>
      <Pressable style={spacings.mlMi}>
        <InfoIcon
          data-tooltip-id={`address-${rawAddress}`}
          color={theme.secondaryText}
          width={14}
          height={14}
        />
      </Pressable>
      <Tooltip
        id={`address-${rawAddress}`}
        style={{
          padding: 0
        }}
        clickable
        noArrow
        openOnClick
        place="bottom-end"
      >
        {network?.explorerUrl && (
          <Option
            title="View in Explorer"
            renderIcon={() => <OpenIcon color={theme.secondaryText} width={14} height={14} />}
            onPress={() => openInTab(`${network.explorerUrl}/address/${rawAddress}`)}
          />
        )}
        {/* @TODO: Uncomment when we have the feature
        <Option
          title="Add to Address Book"
          renderIcon={() => <AddressBookIcon color={theme.secondaryText} width={18} height={18} />}
          onPress={() => {}}
        /> */}
        <Option
          title="Copy Address"
          text={shortenAddress(rawAddress, 15)}
          renderIcon={() => <CopyIcon color={theme.secondaryText} width={16} height={16} />}
          onPress={handleCopyAddress}
        />
      </Tooltip>
    </View>
  )
}

export default BaseAddress
