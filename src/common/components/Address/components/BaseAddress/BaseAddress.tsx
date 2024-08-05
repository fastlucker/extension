import * as Clipboard from 'expo-clipboard'
import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { NetworkId } from '@ambire-common/interfaces/network'
import shortenAddress from '@ambire-common/utils/shortenAddress'
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
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import { getUiType } from '@web/utils/uiType'

import Option from './BaseAddressOption'

interface Props extends TextProps {
  address: string
  explorerNetworkId?: NetworkId
}

const { isActionWindow } = getUiType()

const BaseAddress: FC<Props> = ({ children, address, explorerNetworkId, ...rest }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  // Standalone Benzin doesn't have access to controllers
  const { networks = constantNetworks } = useNetworksControllerState()
  const network = networks?.find((n) => n.id === explorerNetworkId)

  const handleCopyAddress = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(address)
      addToast(t('Address copied to clipboard'))
    } catch {
      addToast(t('Failed to copy address'), {
        type: 'error'
      })
    }
  }, [addToast, address, t])

  const handleOpenExplorer = useCallback(async () => {
    if (!network) return

    try {
      // openInTab doesn't work in Standalone Benzin
      if (!isExtension) {
        await Linking.openURL(`${network?.explorerUrl}/address/${address}`)
        return
      }
      // Close the action-window if this address is opened in one, otherwise
      // the user will have to minimize it to see the explorer.
      await openInTab(`${network?.explorerUrl}/address/${address}`, isActionWindow)
    } catch {
      addToast(t('Failed to open explorer'), {
        type: 'error'
      })
    }
  }, [addToast, address, network, t])

  return (
    <View style={[flexbox.alignCenter, flexbox.directionRow]}>
      <Text fontSize={14} weight="medium" appearance="primaryText" selectable {...rest}>
        {children}
      </Text>
      <Pressable style={spacings.mlMi}>
        {({ hovered }: any) => (
          <InfoIcon
            data-tooltip-id={`address-${address}`}
            color={hovered ? theme.primaryText : theme.secondaryText}
            width={14}
            height={14}
          />
        )}
      </Pressable>
      <Tooltip
        id={`address-${address}`}
        style={{
          padding: 0,
          overflow: 'hidden'
        }}
        clickable
        noArrow
        place="bottom-end"
      >
        {network?.explorerUrl && (
          <Option
            title={t('View in Explorer')}
            renderIcon={() => <OpenIcon color={theme.secondaryText} width={14} height={14} />}
            onPress={handleOpenExplorer}
          />
        )}
        {/* @TODO: Uncomment when we have the feature
        <Option
          title={t('Add to Address Book')}
          renderIcon={() => <AddressBookIcon color={theme.secondaryText} width={18} height={18} />}
          onPress={() => {}}
        /> */}
        <Option
          title={t('Copy Address')}
          text={shortenAddress(address, 15)}
          renderIcon={() => <CopyIcon color={theme.secondaryText} width={16} height={16} />}
          onPress={handleCopyAddress}
        />
      </Tooltip>
    </View>
  )
}

export default BaseAddress
