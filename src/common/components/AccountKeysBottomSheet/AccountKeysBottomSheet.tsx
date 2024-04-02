import React, { FC, useState } from 'react'
import { Modalize } from 'react-native-modalize'

import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import { AccountKeyType } from '@common/components/AccountKey/AccountKey'
import BottomSheet from '@common/components/BottomSheet'

import AccountKeyDetails from './AccountKeyDetails'
import AccountKeys from './AccountKeys'
import AddAccountKeys from './AddAccountKeys'

interface Props {
  sheetRef: React.RefObject<Modalize>
  associatedKeys: string[]
  keyPreferences: KeyPreferences
  importedAccountKeys: Key[]
  closeBottomSheet: () => void
  isSmartAccount: boolean
}

const AccountKeysBottomSheet: FC<Props> = ({
  sheetRef,
  associatedKeys,
  keyPreferences,
  importedAccountKeys,
  closeBottomSheet,
  isSmartAccount
}) => {
  const [currentKeyDetails, setCurrentKeyDetails] = useState<AccountKeyType | null>(null)

  const closeCurrentKeyDetails = () => setCurrentKeyDetails(null)

  const closeBottomSheetWrapped = () => {
    closeCurrentKeyDetails()
    closeBottomSheet()
  }

  return (
    <BottomSheet id="account-keys" sheetRef={sheetRef} closeBottomSheet={closeBottomSheetWrapped}>
      {!currentKeyDetails ? (
        <>
          <AccountKeys
            associatedKeys={associatedKeys}
            keyPreferences={keyPreferences}
            importedAccountKeys={importedAccountKeys}
            setCurrentKeyDetails={setCurrentKeyDetails}
          />
          <AddAccountKeys
            isSmartAccount={isSmartAccount}
            importedAccountKeys={importedAccountKeys}
          />
        </>
      ) : (
        <AccountKeyDetails details={currentKeyDetails} closeDetails={closeCurrentKeyDetails} />
      )}
    </BottomSheet>
  )
}

export default AccountKeysBottomSheet
