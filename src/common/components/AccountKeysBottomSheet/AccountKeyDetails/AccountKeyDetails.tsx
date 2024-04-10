import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET } from '@ambire-common/consts/derivation'
import { isDerivedForSmartAccountKeyOnly } from '@ambire-common/libs/account/account'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import AccountKey, { AccountKeyType } from '@common/components/AccountKey/AccountKey'
import BackButton from '@common/components/BackButton'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

import Row from './Row'
import getStyles from './styles'

interface Props {
  details: AccountKeyType
  closeDetails: () => void
}

const AccountKeyDetails: FC<Props> = ({ details, closeDetails }) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { type, meta } = details

  // Ideally, the meta should be all in there for external keys,
  // but just in case, add fallbacks (that should never happen)
  const metaDetails = useMemo(() => {
    // TODO: Implement internal key details. Could also be in a separate component?
    if (type === 'internal') return []

    return [
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
    ]
  }, [t, type, meta?.deviceId, meta?.deviceModel, meta?.hdPathTemplate, meta?.index])

  return (
    <View>
      <BackButton type="secondary" onPress={closeDetails} style={spacings.mb} />
      <Text fontSize={18} weight="medium" style={spacings.mbSm}>
        {t('Key Details')}
      </Text>
      <View style={styles.container}>
        <AccountKey {...details} />
        <View style={[spacings.phSm, spacings.pvSm, spacings.mtMi]}>
          {metaDetails.map(({ key, value, tooltip }) => (
            <Row key={key} rowKey={key} value={value} tooltip={tooltip} />
          ))}
        </View>
      </View>
    </View>
  )
}

export default AccountKeyDetails
