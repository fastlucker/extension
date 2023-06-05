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

import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'
import HardwareWalletAccount from '@web/modules/hardware-wallet/screens/HardwareWalletAccountImportScreen/components/HardwareWalletAccount'
import Button from '@common/components/Button'
import Toggle from '@common/components/Toggle'
import Select from '@common/components/Select'

const HardwareWalletAccountImportScreen = () => {
  const { t } = useTranslation()
  const { hardwareWallets } = useHardwareWallets()

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
          <View style={[spacings.mb, flexbox.alignCenter]}>
            <Spinner />
            <Text color={colors.violet}>Looking for linked smart accounts</Text>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <LeftArrowIcon width={36} height={36} color={colors.violet} />
            <Text weight="semiBold" color={colors.martinique}>
              1
            </Text>
            <Text color={colors.martinique}>2</Text>
            <Text color={colors.martinique}>3</Text>
            <Text>...</Text>
            <LeftArrowIcon width={36} height={36} color={colors.violet} />
          </View>
          <Toggle label="Show empty legacy accounts" />
          <Select label="Custom Derivation" />
          <Button style={{ width: 296 }} text="Import Accounts" />
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular">{t('Importing accounts')}</Text>
        <Text weight="regular">
          {t(
            'Here you can choose which accounts to import. For every individual key, there exists both a legacy account and a smart account that you can individually choose to import.'
          )}
        </Text>
        <Text weight="regular">{t('Linked Smart Accounts')}</Text>
        <Text weight="regular">
          {t(
            'Linked smart accounts are accounts that were not created with a given key originally, but this key was authorized for that given account on any supported network.'
          )}
        </Text>
      </AuthLayoutWrapperSideContent>{' '}
    </>
  )
}

export default HardwareWalletAccountImportScreen
