import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

interface Props {
  sheetRef: any
  address: KeyPreferences[number]['addr']
  label: KeyPreferences[number]['label']
  type: KeyPreferences[number]['type']
  meta: Key['meta']
  closeBottomSheet: () => void
}

const AccountKeyDetailsBottomSheet: FC<Props> = ({ sheetRef, type, meta, closeBottomSheet }) => {
  const { t } = useTranslation()

  return (
    <BottomSheet id="account-key-details" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
      <Text fontSize={18} weight="medium" style={spacings.mbSm}>
        {t('Key details')}
      </Text>
      {/* TODO: Fill in details */}
      <Text>Device: {type}</Text>
      <Text>Device ID: {meta?.deviceId}</Text>
      <Text>Device Model: {meta?.deviceModel}</Text>
      <Text>Derivation: {getHdPathFromTemplate(meta?.hdPathTemplate, meta?.index)}</Text>
    </BottomSheet>
  )
}

export default AccountKeyDetailsBottomSheet
