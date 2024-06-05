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
import shortenAddress from '@web/utils/shortenAddress'

import Row from './Row'
import getStyles from './styles'

interface Props {
  details: AccountKeyType
  closeDetails: () => void
}

const AccountKeyDetails: FC<Props> = ({ details, closeDetails }) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { type, meta, addr } = details

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
        // TODO: Different note for private key
        tooltip: isDerivedForSmartAccountKeyOnly(meta?.index)
          ? t(
              'Ambire derives a different key on your hardware wallet with an offset of {{offset}}, for security and privacy reasons. You may see {{addr}} when signing on your hardware device.',
              {
                addr: shortenAddress(addr, 13),
                offset: SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET
              }
            )
          : undefined,
        suffix: isDerivedForSmartAccountKeyOnly(meta?.index)
          ? `\n(dedicated key with different derivation)\n${addr}`
          : ''
      }
    ]
  }, [type, t, meta?.deviceModel, meta?.deviceId, meta?.hdPathTemplate, meta?.index, addr])

  return (
    <View>
      <BackButton type="secondary" onPress={closeDetails} style={spacings.mb} />
      <Text fontSize={18} weight="medium" style={spacings.mbSm}>
        {t('Key Details')}
      </Text>
      <View style={styles.container}>
        <AccountKey {...details} />
        <View style={[spacings.phSm, spacings.pvSm, spacings.mtMi]}>
          {metaDetails.map(({ key, value, tooltip, suffix }) => (
            <Row key={key} rowKey={key} value={value} tooltip={tooltip} suffix={suffix} />
          ))}
        </View>
      </View>
    </View>
  )
}

export default AccountKeyDetails
