import { computeAddress, getAddress, isAddress, isHexString } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { AMBIRE_ACCOUNT_FACTORY } from '@ambire-common/consts/deploy'
import { Account, AccountCreation } from '@ambire-common/interfaces/account'
import { ReadyToAddKeys } from '@ambire-common/interfaces/keystore'
import { getDefaultAccountPreferences } from '@ambire-common/libs/account/account'
import { isValidPrivateKey } from '@ambire-common/libs/keyIterator/keyIterator'
import BackButton from '@common/components/BackButton'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAccounts from '@common/hooks/useAccounts'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Stepper from '@web/modules/router/components/Stepper'

type ImportedJson = Account & { privateKey: string; creation: AccountCreation }

const SmartAccountImportScreen = () => {
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useBackgroundService()
  const { accounts } = useAccounts()
  const { statuses } = useKeystoreControllerState()
  const { navigate } = useNavigation()
  const accountsState = useAccountsControllerState()
  const newAccounts: Account[] = useMemo(
    () => accountsState.accounts.filter((a) => a.newlyAdded),
    [accountsState.accounts]
  )

  useEffect(() => {
    if (statuses.addKeys === 'SUCCESS') {
      if (newAccounts.length) navigate(WEB_ROUTES.accountPersonalize)
      else navigate(WEB_ROUTES.dashboard)
    }
  }, [statuses.addKeys, newAccounts, navigate])

  useEffect(() => {
    updateStepperState(WEB_ROUTES.importSmartAccountJson, 'import-json')
  }, [updateStepperState])

  const isValidJson = (json: ImportedJson) => {
    if (!('addr' in json) || !isAddress(json.addr)) {
      setError(
        'Invalid address in json. Please check if it is present. If it is, make sure it is checksummed.'
      )
      return false
    }

    if (
      !('associatedKeys' in json) ||
      !Array.isArray(json.associatedKeys) ||
      json.associatedKeys.length !== 1
    ) {
      setError('Invalid associatedKeys in json. Please contact support.')
      return false
    }

    if (!('creation' in json)) {
      setError('Creation data missing in provided json.')
      return false
    }

    const creation = json.creation
    if (!('bytecode' in creation) || !isHexString(creation.bytecode)) {
      setError('Invalid bytecode in provided json.')
      return false
    }

    if (!('bytecode' in creation) || !isHexString(creation.bytecode)) {
      setError('Invalid bytecode in provided json.')
      return false
    }

    if (
      !('factoryAddr' in creation) ||
      !isHexString(creation.factoryAddr) ||
      !isAddress(creation.factoryAddr)
    ) {
      setError('Invalid factoryAddr in provided json.')
      return false
    }

    if (creation.factoryAddr !== AMBIRE_ACCOUNT_FACTORY) {
      setError(
        'factoryAddr in json different than the factory for Ambire accounts. Are you importing an Ambire v1 account? Importing V1 accounts is not supported.'
      )
      return false
    }

    if (!('salt' in creation) || !isHexString(creation.salt)) {
      setError('Invalid salt in provided json.')
      return false
    }

    if (
      !('initialPrivileges' in json) ||
      !Array.isArray(json.initialPrivileges) ||
      json.initialPrivileges.length !== 1 ||
      !Array.isArray(json.initialPrivileges[0]) ||
      json.initialPrivileges[0].length !== 2
    ) {
      setError('Invalid initialPrivileges in provided json.')
      return false
    }

    if (!('privateKey' in json) || !isValidPrivateKey(json.privateKey)) {
      setError('Invalid privateKey in provided json.')
      return false
    }

    if (computeAddress(json.privateKey) !== getAddress(json.associatedKeys[0])) {
      setError(
        'PrivateKey and associatedKey address mismatch. Are you providing the correct private key?'
      )
      return false
    }

    return true
  }

  const handleFileUpload = (event: any) => {
    setError('')
    setIsLoading(true)

    // TODO: handle bad case + validation
    const file = event.target.files[0]
    if (file.type !== 'application/json') {
      setError('Please upload a valid json file')
      setIsLoading(false)
      return
    }

    file.text().then((contents: string) => {
      try {
        const accountData: ImportedJson = JSON.parse(contents)
        if (!isValidJson(accountData)) {
          setIsLoading(false)
          return
        }

        const readyToAddAccount: Account = {
          addr: accountData.addr,
          associatedKeys: accountData.associatedKeys,
          initialPrivileges: accountData.initialPrivileges,
          creation: accountData.creation,
          newlyAdded: true,
          preferences:
            accountData.preferences ?? getDefaultAccountPreferences(accountData.addr, accounts, 0)
        }
        const keys: ReadyToAddKeys['internal'] = [
          {
            addr: computeAddress(accountData.privateKey),
            label: 'alabala',
            type: 'internal',
            privateKey: accountData.privateKey,
            // TODO: maybe query the blockchain for this data
            dedicatedToOneSA: true,
            meta: { createdAt: Date.now() }
          }
        ]

        dispatch({
          type: 'IMPORT_SMART_ACCOUNT_JSON',
          params: { readyToAddAccount, keys }
        })
      } catch (e) {
        setError('Could not parse file. Please upload a valid json file')
        setIsLoading(false)
      }
    })
  }

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="md"
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={<BackButton fallbackBackRoute={ROUTES.dashboard} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Import existing smart account json')}>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <input type="file" name="smartAccountJson" onChange={handleFileUpload} />
            {!!error && (
              <Text weight="regular" fontSize={10} appearance="errorText">
                {error}
              </Text>
            )}
            {isLoading && (
              <View style={spacings.mlTy}>
                <Spinner />
              </View>
            )}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default SmartAccountImportScreen
