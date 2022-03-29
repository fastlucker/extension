import * as Clipboard from 'expo-clipboard'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import { MaterialIcons } from '@expo/vector-icons'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import networks from '@modules/common/constants/networks'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings, { DEVICE_WIDTH } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const DepositTokens = () => {
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
  const { network }: any = useNetwork()
  const qrCodeRef: any = useRef(null)
  const { addToast } = useToast()
  const networkDetails = networks.find(({ id }) => id === network.id)
  const [qrCodeError, setQrCodeError] = useState<string | boolean | null>(null)

  const handleCopyAddress = () => {
    Clipboard.setString(selectedAcc)
    addToast(t('Address copied to clipboard!') as string, { timeout: 2000 })
  }

  return (
    <Panel>
      <View style={[flexboxStyles.alignCenter, spacings.mb]}>
        <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mbMi]}>
          <MaterialIcons
            style={spacings.mrTy}
            name="account-balance-wallet"
            size={25}
            color={colors.primaryAccentColor}
          />
          <Title hasBottomSpacing={false} color={colors.primaryAccentColor}>
            {t('Deposit Tokens')}
          </Title>
        </View>
        <Text fontSize={20} color={colors.ambirePurple}>
          {t('Direct Deposit')}
        </Text>
      </View>
      <Text style={spacings.mbTy}>
        {t('Send {{symbol}}, tokens or collectibles (NFTs) to this address:', {
          symbol: networkDetails?.nativeAssetSymbol
        })}
      </Text>
      <TouchableOpacity
        style={styles.addressCopyContainer}
        activeOpacity={0.7}
        onPress={handleCopyAddress}
      >
        <Text numberOfLines={1} ellipsizeMode="middle" style={[spacings.prTy, flexboxStyles.flex1]}>
          {selectedAcc}
        </Text>
        <MaterialIcons name="content-copy" size={22} color={colors.primaryIconColor} />
      </TouchableOpacity>
      <View style={[flexboxStyles.alignCenter, spacings.ptSm, spacings.pbLg]}>
        {!!selectedAcc && !qrCodeError && (
          <QRCode
            value={selectedAcc}
            size={DEVICE_WIDTH / 3}
            quietZone={4}
            getRef={qrCodeRef}
            onError={() => setQrCodeError(t('Failed to load QR code!') as string)}
          />
        )}
        {!!qrCodeError && <Text appearance="danger">{qrCodeError}</Text>}
      </View>
      <View style={[flexboxStyles.alignCenter, spacings.ptTy]}>
        <Text color={colors.secondaryTextColor} style={[spacings.mbMi, textStyles.center]}>
          {t('Following networks supported on this address:')}
        </Text>
        <View style={[flexboxStyles.directionRow, flexboxStyles.wrap, flexboxStyles.justifyCenter]}>
          {networks.map(({ id, Icon, name }: any) => (
            <View key={id} style={[flexboxStyles.directionRow, spacings.pvMi, spacings.phTy]}>
              <Icon width={24} />
              <Text style={spacings.plMi}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
    </Panel>
  )
}

export default DepositTokens
