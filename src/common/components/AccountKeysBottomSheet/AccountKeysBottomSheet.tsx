import React, { FC, useState } from 'react'
import { Modalize } from 'react-native-modalize'

import { Account } from '@ambire-common/interfaces/account'
import { AccountKeyType } from '@common/components/AccountKey/AccountKey'
import BottomSheet from '@common/components/BottomSheet'

import AccountKeyDetails from './AccountKeyDetails'
import AccountKeys from './AccountKeys'

interface Props {
  sheetRef: React.RefObject<Modalize>
  closeBottomSheet: () => void
  account: Account
  openAddAccountBottomSheet?: () => void
  isSettings?: boolean
}

const AccountKeysBottomSheet: FC<Props> = ({
  sheetRef,
  closeBottomSheet,
  account,
  openAddAccountBottomSheet,
  isSettings = false
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
        <AccountKeys
          setCurrentKeyDetails={setCurrentKeyDetails}
          account={account}
          openAddAccountBottomSheet={openAddAccountBottomSheet}
          keyIconColor="#000"
          isSettings={isSettings}
        />
      ) : (
        <AccountKeyDetails
          details={currentKeyDetails}
          closeDetails={closeCurrentKeyDetails}
          account={account}
          keyIconColor="#000"
          isSettings={isSettings}
        />
      )}
    </BottomSheet>
  )
}

export default React.memo(AccountKeysBottomSheet)
