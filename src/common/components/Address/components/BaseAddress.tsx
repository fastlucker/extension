import * as Clipboard from 'expo-clipboard'
import React, { FC, useCallback } from 'react'
import { Linking, Pressable, View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
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
import { isExtension } from '@web/constants/browserapi'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import Option from './BaseAddressOption'

interface Props extends TextProps {
  rawAddress: string
  explorerNetworkId?: NetworkDescriptor['id']
}

const { isNotification } = getUiType()

const BaseAddress: FC<Props> = ({ children, rawAddress, explorerNetworkId, ...rest }) => {
  const { theme } = useTheme()
  const { addToast } = useToast()
  // benzin.ambire.com doesn't have access to controllers
  const { networks = constantNetworks } = useSettingsControllerState()
  const network = networks?.find((n) => n.id === explorerNetworkId)

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

  const handleOpenExplorer = useCallback(() => {
    if (!network) return

    // openInTab doesn't work in benzin.ambire.com
    if (!isExtension) {
      Linking.openURL(`${network?.explorerUrl}/address/${rawAddress}`)
    }
    // Close the notification window if this address is opened in one, otherwise
    // the user will have to minimize it to see the explorer.
    openInTab(`${network?.explorerUrl}/address/${rawAddress}`, isNotification)
  }, [])

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
            onPress={handleOpenExplorer}
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
