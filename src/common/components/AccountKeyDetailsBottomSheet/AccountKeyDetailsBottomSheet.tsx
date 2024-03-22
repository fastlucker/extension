import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { KeyPreferences } from '@ambire-common/interfaces/settings'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

interface Props {
  sheetRef: any
  keyPreferences: KeyPreferences[number]
  closeBottomSheet: () => void
}

const AccountKeyDetailsBottomSheet: FC<Props> = ({
  sheetRef,
  keyPreferences,
  closeBottomSheet
}) => {
  const { t } = useTranslation()

  return (
    <BottomSheet id="account-key-details" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
      <Text fontSize={18} weight="medium" style={spacings.mbSm}>
        {t('Key details')}
      </Text>
      {/* TODO: Fill in details */}
      <Text>Device:</Text>
      <Text>Device ID:</Text>
      <Text>Device Model:</Text>
      <Text>Derivation:</Text>
    </BottomSheet>
  )
}

export default AccountKeyDetailsBottomSheet
