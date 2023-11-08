import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import InfoIcon from '@common/assets/svg/InfoIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useAccountAdder from '@web/modules/account-adder/hooks/useAccountAdder/useAccountAdder'
import Stepper from '@web/modules/router/components/Stepper'

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

// TODO:
const showEmailVaultRecoveryToggle = true

const AccountAdderScreen = () => {
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const accountAdderState = useAccountAdderControllerState()
  const [enableEmailVaultRecovery, setEnableEmailVaultRecovery] = useState(false)
  const { keyType, privKeyOrSeed, label } = params as {
    keyType: Key['type']
    privKeyOrSeed?: string
    label?: string
  }

  const { onImportReady, setPage } = useAccountAdder({
    keyType,
    privKeyOrSeed,
    keyLabel: label
  })

  useEffect(() => {
    if (!keyType) goBack()
  }, [keyType, goBack])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper containerStyle={{ maxWidth: tabLayoutWidths.lg }} />
        </Header>
      }
      footer={
        <>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <TouchableOpacity
              style={[flexbox.directionRow, flexbox.alignCenter, spacings.mr2Xl]}
              onPress={goBack}
            >
              <LeftArrowIcon />
              <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
                {t('Back')}
              </Text>
            </TouchableOpacity>
            {!!showEmailVaultRecoveryToggle && (
              <Toggle
                isOn={enableEmailVaultRecovery}
                onToggle={() => setEnableEmailVaultRecovery((p) => !p)}
                label={t('Enable email recovery for new Smart Accounts')}
              />
            )}
          </View>
          <View
            style={[
              flexbox.alignCenter,
              spacings.ptSm,
              { opacity: accountAdderState.linkedAccountsLoading ? 1 : 0 }
            ]}
          >
            <View style={[spacings.mbTy, flexbox.alignCenter, flexbox.directionRow]}>
              <Spinner style={{ width: 16, height: 16 }} />
              <Text appearance="primary" style={[spacings.mlSm]} fontSize={12}>
                {t('Looking for linked smart accounts')}
              </Text>
            </View>
          </View>
          <Button
            hasBottomSpacing={false}
            textStyle={{ fontSize: 14 }}
            onPress={onImportReady}
            disabled={
              accountAdderState.accountsLoading ||
              accountAdderState.addAccountsStatus === 'LOADING' ||
              (!accountAdderState.selectedAccounts.length &&
                !accountAdderState.preselectedAccounts.length)
            }
            text={
              accountAdderState.addAccountsStatus === 'LOADING'
                ? t('Importing...')
                : accountAdderState.preselectedAccounts.length &&
                  !accountAdderState.selectedAccounts.length
                ? t('Continue')
                : t('Import Accounts')
            }
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel style={{ maxHeight: '100%' }}>
          <AccountsOnPageList state={accountAdderState} setPage={setPage} keyType={keyType} />
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
            <InfoIcon color={theme.infoText} style={spacings.mrTy} />
            <Text fontSize={20} appearance="infoText" weight="medium">
              {t('Importing accounts')}
            </Text>
          </View>
          <Text fontSize={16} style={[spacings.mbXl]} appearance="infoText">
            {t(
              'Here you can choose which accounts to import. For every individual key, there exists both a legacy account and a smart account that you can individually choose to import.'
            )}
          </Text>
          <Text fontSize={20} style={spacings.mbSm} appearance="infoText" weight="medium">
            {t('Linked Smart Accounts')}
          </Text>
          <Text fontSize={16} style={[spacings.mbXl]} appearance="infoText">
            {t(
              'Linked smart accounts are accounts that were not created with a given key originally, but this key was authorized for that given account on any supported network.'
            )}
          </Text>

          {keyType === 'internal' && (
            <>
              <Text fontSize={20} style={spacings.mbSm} appearance="infoText" weight="medium">
                {t('Email Recovery')}
              </Text>
              <Text fontSize={16} appearance="infoText">
                {t(
                  "Email recovery can be enabled for Smart Accounts, and it allows you to use your email vault to trigger a timelocked recovery procedure that enables you to regain access to an account if you've lost it's keys."
                )}
              </Text>
            </>
          )}
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default AccountAdderScreen
