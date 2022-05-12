import * as Clipboard from 'expo-clipboard'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import CopyIcon from '@assets/svg/CopyIcon'
import NetworkIcon from '@modules/common/components/NetworkIcon'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import networks from '@modules/common/constants/networks'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import { colorPalette as colors } from '@modules/common/styles/colors'
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
    <>
      <Title hasBottomSpacing={false} style={[textStyles.center, spacings.mbSm]}>
        {t('Deposit Tokens')}
      </Title>
      <Panel style={spacings.mb0}>
        <Text style={spacings.mb} fontSize={16} weight="medium" color={colors.turquoise}>
          {t('Direct Deposit')}
        </Text>
        <Text style={[spacings.mbTy, spacings.ph]} fontSize={12}>
          {t('Send {{symbol}}, tokens or collectibles (NFTs) to this address:', {
            symbol: networkDetails?.nativeAssetSymbol
          })}
        </Text>
        <TouchableOpacity
          style={styles.addressCopyContainer}
          activeOpacity={0.7}
          onPress={handleCopyAddress}
        >
          <Text
            numberOfLines={1}
            fontSize={14}
            ellipsizeMode="middle"
            style={[spacings.prSm, flexboxStyles.flex1]}
          >
            {selectedAcc}
          </Text>
          <CopyIcon />
        </TouchableOpacity>
        <View style={[flexboxStyles.alignCenter, spacings.pt, spacings.pbMd]}>
          {!!selectedAcc && !qrCodeError && (
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={selectedAcc}
                size={DEVICE_WIDTH / 3.3}
                quietZone={10}
                getRef={qrCodeRef}
                onError={() => setQrCodeError(t('Failed to load QR code!') as string)}
              />
            </View>
          )}
          {!!qrCodeError && <Text appearance="danger">{qrCodeError}</Text>}
        </View>
      </Panel>
      <View style={[flexboxStyles.alignCenter, spacings.mb]}>
        <Text fontSize={12} style={[spacings.mbMi, textStyles.center]}>
          {t('Following networks supported on this address:')}
        </Text>
        <View style={[flexboxStyles.directionRow, flexboxStyles.wrap, flexboxStyles.justifyCenter]}>
          {networks.map(({ id, name }: any) => (
            <View key={id} style={styles.supportedNetworksContainer}>
              <View style={{ marginBottom: 3 }}>
                <NetworkIcon name={id} type="monochrome" />
              </View>
              <Text
                style={spacings.plMi}
                fontSize={10}
                numberOfLines={1}
                color={colors.waikawaGray}
              >
                {name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  )
}

export default DepositTokens
