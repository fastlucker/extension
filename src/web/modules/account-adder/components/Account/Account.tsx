import * as Clipboard from 'expo-clipboard'
import React, { useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'

import { Account as AccountInterface, ImportStatus } from '@ambire-common/interfaces/account'
import { Network } from '@ambire-common/interfaces/network'
import { isAmbireV1LinkedAccount } from '@ambire-common/libs/account/account'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import Avatar from '@common/components/Avatar'
import Badge from '@common/components/Badge'
import Checkbox from '@common/components/Checkbox'
import Label from '@common/components/Label'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
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
  isDisabled,
  importStatus
}: {
  account: AccountInterface & { usedOnNetworks: Network[] }
  type: 'basic' | 'smart' | 'linked'
  unused: boolean
  isSelected: boolean
  withBottomSpacing: boolean
  shouldAddIntroStepsIds?: boolean
  onSelect: (account: AccountInterface) => void
  onDeselect: (account: AccountInterface) => void
  isDisabled?: boolean
  importStatus: ImportStatus
}) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { setShowIntroSteps } = useContext(AccountAdderIntroStepsContext)
  const { minWidthSize, maxWidthSize } = useWindowSize()
  const { addToast } = useToast()
  if (!account.addr) return null
  const isAccountImported = importStatus !== ImportStatus.NotImported

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
        flexbox.alignCenter,
        withBottomSpacing ? spacings.mbTy : spacings.mb0,
        common.borderRadiusPrimary,
        { borderWidth: 1, borderColor: theme.secondaryBackground },
        ((hovered && !isDisabled) || importStatus === ImportStatus.ImportedWithTheSameKeys) && {
          borderColor: theme.secondaryBorder
        }
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
              {isAccountImported ? (
                <>
                  <Avatar pfp={account.preferences.pfp} size={24} />
                  <Text
                    fontSize={16}
                    weight="medium"
                    appearance="primaryText"
                    style={spacings.mrTy}
                  >
                    {account.preferences.label}
                  </Text>
                  <Text
                    testID="add-account"
                    fontSize={14}
                    appearance="secondaryText"
                    style={spacings.mrMi}
                    // @ts-ignore
                    dataSet={{ tooltipId: account.addr }}
                  >
                    ({shortenAddress(account.addr, 16)})
                  </Text>
                  <Tooltip content={account.addr} id={account.addr} />
                </>
              ) : (
                <Text
                  testID="add-account"
                  fontSize={16}
                  appearance="primaryText"
                  style={spacings.mrMi}
                >
                  {minWidthSize('m') && shortenAddress(account.addr, 16)}
                  {maxWidthSize('m') && minWidthSize('l') && shortenAddress(account.addr, 26)}
                  {maxWidthSize('l') && account.addr}
                </Text>
              )}

              {(minWidthSize('l') || isAccountImported) && (
                <Pressable onPress={handleCopyAddress}>
                  <CopyIcon width={14} height={14} />
                </Pressable>
              )}
            </View>
            {type === 'basic' ? (
              <Badge
                withRightSpacing
                withIcon
                text={t('Basic Account')}
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
              <Badge withRightSpacing withIcon text={t('Ambire v1')} type="info" />
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
                      <NetworkIcon
                        style={{ backgroundColor: theme.primaryBackground }}
                        id={n.id}
                        size={18}
                      />
                    </View>
                  )
                })}
              </View>
            )}
            {!!unused && <Badge withIcon text={t('unused')} />}
          </View>
        </View>
      </View>
      {[
        ImportStatus.ImportedWithSomeOfTheKeys,
        ImportStatus.ImportedWithTheSameKeys,
        ImportStatus.ImportedWithDifferentKeys,
        ImportStatus.ImportedWithoutKey
      ].includes(importStatus) && (
        <View style={[spacings.mh, spacings.mvTy, flexbox.alignSelfStart]}>
          {importStatus === ImportStatus.ImportedWithSomeOfTheKeys && (
            <Label
              isTypeLabelHidden
              customTextStyle={styles.label}
              hasBottomSpacing={false}
              text={t(
                'Already imported with some of the keys found on this page but not all. Re-import now to use this account with multiple keys.'
              )}
              type="success"
            />
          )}
          {importStatus === ImportStatus.ImportedWithTheSameKeys && (
            <Label
              isTypeLabelHidden
              customTextStyle={styles.label}
              hasBottomSpacing={false}
              text={t('Already imported with the same key.')}
              type="success"
            />
          )}
          {importStatus === ImportStatus.ImportedWithDifferentKeys && (
            <Label
              isTypeLabelHidden
              customTextStyle={styles.label}
              hasBottomSpacing={false}
              text={t(
                'Already imported, associated with a different key. Re-import now to use this account with multiple keys.'
              )}
              type="info"
            />
          )}
          {importStatus === ImportStatus.ImportedWithoutKey && (
            <Label
              isTypeLabelHidden
              customTextStyle={styles.label}
              hasBottomSpacing={false}
              text={t(
                'Already imported as a view only account. Import now to be able to manage this account.'
              )}
              type="info"
            />
          )}
        </View>
      )}
    </Pressable>
  )
}

export default React.memo(Account)
