import * as Clipboard from 'expo-clipboard'
import React, { useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { isAmbireV1LinkedAccount } from '@ambire-common/libs/account/account'
import Badge from '@common/components/Badge'
import Checkbox from '@common/components/Checkbox'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import CopyIcon from '@web/assets/svg/CopyIcon'
import {
  AccountAdderIntroStepsContext,
  BasicAccountIntroId,
  SmartAccountIntroId
} from '@web/modules/account-adder/contexts/accountAdderIntroStepsContext'
import shortenAddress from '@web/utils/shortenAddress'

import getStyles from './styles'

const Account = ({
  account,
  type,
  unused,
  withBottomSpacing = true,
  shouldAddIntroStepsIds,
  isSelected,
  onSelect,
  onDeselect,
  isDisabled
}: {
  account: AccountInterface & { usedOnNetworks: NetworkDescriptor[] }
  type: 'legacy' | 'smart' | 'linked'
  unused: boolean
  isSelected: boolean
  withBottomSpacing: boolean
  shouldAddIntroStepsIds?: boolean
  onSelect: (account: AccountInterface) => void
  onDeselect: (account: AccountInterface) => void
  isDisabled?: boolean
}) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { setShowIntroSteps } = useContext(AccountAdderIntroStepsContext)
  const { minWidthSize, maxWidthSize } = useWindowSize()
  const { addToast } = useToast()
  if (!account.addr) return null

  const toggleSelectedState = () => {
    if (isSelected) {
      !!onDeselect && onDeselect(account)
    } else {
      !!onSelect && onSelect(account)
    }
  }

  useEffect(() => {
    if (shouldAddIntroStepsIds) setShowIntroSteps(true)
  }, [shouldAddIntroStepsIds, setShowIntroSteps])

  const handleCopyAddress = () => {
    Clipboard.setStringAsync(account.addr)
    addToast(t('Address copied to clipboard!') as string, { timeout: 2500 })
  }

  return (
    <Pressable
      key={account.addr}
      style={({ hovered }: any) => [
        flexbox.directionRow,
        flexbox.alignCenter,
        withBottomSpacing ? spacings.mbTy : spacings.mb0,
        common.borderRadiusPrimary,
        { borderWidth: 1, borderColor: theme.secondaryBackground },
        hovered && { borderColor: theme.secondaryBorder }
      ]}
      onPress={isDisabled ? undefined : toggleSelectedState}
    >
      <View style={styles.container}>
        <Checkbox
          style={{ marginBottom: 0 }}
          value={isSelected}
          onValueChange={toggleSelectedState}
          uncheckedBorderColor={theme.primaryText}
          isDisabled={isDisabled}
        />

        <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
            <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mrMd]}>
              <Text  testID='add-account' fontSize={16} appearance="primaryText" style={spacings.mrMi}>
                {minWidthSize('m') && shortenAddress(account.addr, 16)}
                {maxWidthSize('m') && minWidthSize('l') && shortenAddress(account.addr, 26)}
                {maxWidthSize('l') && account.addr}
              </Text>
              {minWidthSize('l') && (
                <Pressable onPress={handleCopyAddress}>
                  <CopyIcon width={14} height={14} />
                </Pressable>
              )}
            </View>
            {type === 'legacy' ? (
              <Badge
                withRightSpacing
                withIcon
                text={t('Legacy Account')}
                type="warning"
                {...(shouldAddIntroStepsIds
                  ? {
                      nativeID: BasicAccountIntroId
                    }
                  : {})}
              />
            ) : (
              <Badge
                withRightSpacing
                withIcon
                text={t('Smart Account')}
                type="success"
                {...(shouldAddIntroStepsIds
                  ? {
                      nativeID: SmartAccountIntroId
                    }
                  : {})}
              />
            )}
            {type === 'linked' && (
              <Badge withRightSpacing withIcon text={t('linked')} type="info" />
            )}
            {type === 'linked' && isAmbireV1LinkedAccount(account.creation?.factoryAddr) && (
              <Badge withRightSpacing withIcon text={t('v.1')} type="info" />
            )}
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            {!!account.usedOnNetworks.length && (
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <Text fontSize={12} weight="regular">
                  {t('used on ')}
                </Text>
                {account.usedOnNetworks.slice(0, 7).map((n, index: number, arr: string | any[]) => {
                  return (
                    <View
                      style={[
                        styles.networkIcon,
                        { marginLeft: index ? -5 : 0, zIndex: arr.length - index }
                      ]}
                      key={n.id}
                    >
                      <NetworkIcon name={n.id as any} width={18} height={18} />
                    </View>
                  )
                })}
              </View>
            )}
            {!!unused && <Badge withIcon text={t('unused')} />}
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default React.memo(Account)
