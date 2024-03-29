import React, { FC, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Tooltip } from 'react-tooltip'

import { SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET } from '@ambire-common/consts/derivation'
import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import { isDerivedForSmartAccountKeyOnly } from '@ambire-common/libs/account/account'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import InformationIcon from '@common/assets/svg/InformationIcon'
import BottomSheet from '@common/components/BottomSheet'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

import getStyles from './styles'

interface Props {
  sheetRef: React.RefObject<Modalize>
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
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()

  // TODO: Implement internal key details. Could also be in a separate component?
  if (type === 'internal') return null

  // Ideally, the meta should be all in there for external keys,
  // but just in case, add fallbacks (that should never happen)
  const metaDetails = useMemo(
    () => [
      {
        key: t('Device'),
        value: type ? HARDWARE_WALLET_DEVICE_NAMES[type] || type : '-'
      },
      {
        key: t('Device Model'),
        value: meta?.deviceModel || '-'
      },
      {
        key: t('Device ID'),
        value: meta?.deviceId || '-'
      },
      {
        key: t('Derivation'),
        value: meta?.hdPathTemplate
          ? getHdPathFromTemplate(meta?.hdPathTemplate, meta?.index)
          : '-',
        tooltip:
          typeof meta?.index === 'number' && isDerivedForSmartAccountKeyOnly(meta?.index)
            ? t(
                `Ambire smart account keys use a derived address by an offset of ${SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET}.`
              )
            : undefined
      }
    ],
    [t, type, meta?.deviceId, meta?.deviceModel, meta?.hdPathTemplate, meta?.index]
  )

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
      <View style={styles.container}>
        {children}
        <View style={[spacings.phSm, spacings.pvSm, spacings.mtMi]}>
          {metaDetails.map(({ key, value, tooltip }) => (
            <View
              key={key}
              style={[flexbox.directionRow, flexbox.justifySpaceBetween, spacings.mbMi]}
            >
              <Text fontSize={14}>{key}: </Text>
              <Text
                fontSize={14}
                weight="semiBold"
                style={{
                  // @ts-ignore missing in the types, but React Native Web supports it
                  wordBreak: 'break-all'
                }}
              >
                {value}
                {tooltip && (
                  <>
                    {' '}
                    <InformationIcon
                      color={theme.infoDecorative}
                      width={14}
                      height={14}
                      dataSet={{ tooltipId: `tooltip-for-${key}`, tooltipContent: tooltip }}
                    />
                    <Tooltip id={`tooltip-for-${key}`} />
                  </>
                )}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </BottomSheet>
  )
}

export default AccountKeyDetailsBottomSheet
