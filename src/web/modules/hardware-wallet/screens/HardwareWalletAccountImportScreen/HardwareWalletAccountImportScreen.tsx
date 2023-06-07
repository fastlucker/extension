import React from 'react'
import { View } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import Spinner from '@common/components/Spinner'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import { useTranslation } from '@common/config/localization'
import Text from '@common/components/Text'
import flexbox from '@common/styles/utils/flexbox'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import HardwareWalletAccount from '@web/modules/hardware-wallet/screens/HardwareWalletAccountImportScreen/components/HardwareWalletAccount'
import Button from '@common/components/Button'
import Toggle from '@common/components/Toggle'
import Select from '@common/components/Select'

const HardwareWalletAccountImportScreen = () => {
  const { t } = useTranslation()
  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View
          style={{ ...flexbox.alignCenter, ...spacings.mbSm, height: 325, overflowY: 'scroll' }}
        >
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
            <Text weight="semiBold" color={colors.martinique} style={{ width: 35 }} fontSize={20}>
              1
            </Text>
            <View
              style={{
                backgroundColor: '#BBBDE4',
                width: 3,
                height: '100%',
                ...spacings.mlTy,
                ...spacings.mrTy
              }}
            />
            <View>
              <HardwareWalletAccount
                smartAccount
                address="0x12H563DB6...Ff456G23Def25"
                balance="$24642.65"
              />
              <HardwareWalletAccount address="0x603f453E4...5a245fB3D34Df" balance="$98.98" />
              <HardwareWalletAccount
                smartAccount
                address="0xfd945fB5F...F2124E354f306"
                linked
                balance="$985,165.30"
                last
              />
            </View>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
            <Text weight="semiBold" color={colors.martinique} style={{ width: 35 }} fontSize={20}>
              2
            </Text>
            <View
              style={{
                backgroundColor: '#BBBDE4',
                width: 3,
                height: '100%',
                ...spacings.mlTy,
                ...spacings.mrTy
              }}
            />
            <View>
              <HardwareWalletAccount
                smartAccount
                address="0x12H563DB6...Ff456G23Def25"
                balance="$24642.65"
              />
              <HardwareWalletAccount address="0x603f453E4...5a245fB3D34Df" balance="$98.98" />
              <HardwareWalletAccount
                smartAccount
                address="0xfd945fB5F...F2124E354f306"
                linked
                balance="$985,165.30"
                last
              />
            </View>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
            <Text weight="semiBold" color={colors.martinique} style={{ width: 35 }} fontSize={20}>
              3
            </Text>
            <View
              style={{
                backgroundColor: '#BBBDE4',
                width: 3,
                height: '100%',
                ...spacings.mlTy,
                ...spacings.mrTy
              }}
            />
            <View>
              <HardwareWalletAccount
                smartAccount
                address="0x12H563DB6...Ff456G23Def25"
                balance="$24642.65"
              />
              <HardwareWalletAccount address="0x603f453E4...5a245fB3D34Df" balance="$98.98" />
              <HardwareWalletAccount
                smartAccount
                address="0xfd945fB5F...F2124E354f306"
                linked
                balance="$985,165.30"
                last
              />
            </View>
          </View>
        </View>
        <View style={[flexbox.alignCenter]}>
          <View style={[spacings.mb, flexbox.alignCenter, flexbox.directionRow]}>
            <Spinner style={{ width: 16, height: 16 }} />
            <Text color={colors.violet} style={[spacings.mlSm]} fontSize={12}>
              {t('Looking for linked smart accounts')}
            </Text>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
            <LeftArrowIcon width={36} height={36} color={colors.violet} />
            <Text
              weight="semiBold"
              color={colors.martinique}
              fontSize={12}
              style={[spacings.mlSm, spacings.mrSm]}
            >
              1
            </Text>
            <Text fontSize={12} color={colors.martinique} style={[spacings.mrSm]}>
              2
            </Text>
            <Text fontSize={12} color={colors.martinique} style={[spacings.mrSm]}>
              3
            </Text>
            <Text fontSize={12} color={colors.martinique} style={[spacings.mrSm]}>
              ...
            </Text>
            <LeftArrowIcon width={36} height={36} style={[spacings.mlSm]} color={colors.violet} />
          </View>
          <Toggle style={[spacings.mbTy]} label="Show empty legacy accounts" />
          <Select
            hasArrow
            items={[{ label: 'First item', value: '1' }]}
            label="Custom Derivation"
          />
          <Button style={{ width: 296 }} text="Import Accounts" />
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text fontSize={16} style={[spacings.mb]} color={colors.zircon} weight="medium">
          {t('Importing accounts')}
        </Text>
        <Text fontSize={14} style={[spacings.mbMd]} color={colors.zircon} weight="regular">
          {t(
            'Here you can choose which accounts to import. For every individual key, there exists both a legacy account and a smart account that you can individually choose to import.'
          )}
        </Text>
        <Text fontSize={16} color={colors.turquoise} style={[spacings.mb]} weight="regular">
          {t('Linked Smart Accounts')}
        </Text>
        <Text fontSize={14} color={colors.turquoise} weight="regular">
          {t(
            'Linked smart accounts are accounts that were not created with a given key originally, but this key was authorized for that given account on any supported network.'
          )}
        </Text>
      </AuthLayoutWrapperSideContent>{' '}
    </>
  )
}

export default HardwareWalletAccountImportScreen
