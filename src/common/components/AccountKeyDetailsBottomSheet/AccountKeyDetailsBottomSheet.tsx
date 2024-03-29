import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Props {
  sheetRef: any
  type?: KeyPreferences[number]['type']
  meta?: Key['meta']
  closeBottomSheet: () => void
  children: ReactNode | ReactNode[]
}

const AccountKeyDetailsBottomSheet: FC<Props> = ({
  sheetRef,
  type,
  meta,
  closeBottomSheet,
  children
}) => {
  const { t } = useTranslation()

  if (!meta) return null

  // TODO: Implement internal key details
  if (type === 'internal') return null

  return (
    <BottomSheet
      adjustToContentHeight={false}
      id="account-key-details"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
    >
      <Text fontSize={18} weight="medium" style={spacings.mbSm}>
        {t('Key Details')}
      </Text>
      <View
        style={{
          // TODO: Move to styles.
          backgroundColor: colors.white,
          borderRadius: BORDER_RADIUS_PRIMARY,
          borderWidth: 1,
          borderColor: '#CACDE6'
        }}
      >
        {children}
        <View>
          {/* TODO: Fill in details */}
          <Text>Device: {type}</Text>
          <Text>Device ID: {meta?.deviceId}</Text>
          <Text>Device Model: {meta?.deviceModel}</Text>
          <Text>Derivation: {getHdPathFromTemplate(meta?.hdPathTemplate, meta?.index)}</Text>
        </View>
      </View>
    </BottomSheet>
  )
}

export default AccountKeyDetailsBottomSheet
