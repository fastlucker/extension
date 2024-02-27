import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import DeleteIcon from '@common/assets/svg/DeleteIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const HideToken = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const portfolio = usePortfolioControllerState()

  const [address, setAddress] = useState('')

  return (
    <View style={flexbox.flex1}>
      <Text fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]} weight="medium">
        {t('Hide Token')}
      </Text>
      <Input
        label={t('Token Address or Symbol')}
        onChange={setAddress}
        placeholder="Input token address or symbol"
        inputWrapperStyle={spacings.mbSm}
      />
      <View>
        {portfolio.accountPortfolio?.tokens
          .filter((token) => token.amount > 0n && !token.flags.onGasTank)
          .map((token) => (
            <View
              key={`${token.address}-${token.networkId}`}
              style={[
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.justifySpaceBetween,
                spacings.phTy,
                spacings.pvTy,
                spacings.mbTy
              ]}
            >
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                <TokenIcon
                  containerHeight={32}
                  containerWidth={32}
                  width={22}
                  height={22}
                  withContainer
                  networkId={token.networkId}
                  address={token.address}
                />
                <Text fontSize={16} style={spacings.mlTy} weight="semiBold">
                  {token.symbol}
                </Text>
              </View>
              <View style={flexbox.directionRow}>
                {token.isHidden ? (
                  <VisibilityIcon color="#018649" style={[spacings.phTy, { cursor: 'pointer' }]} />
                ) : (
                  <InvisibilityIcon
                    color="#ea0129"
                    style={[spacings.phTy, { cursor: 'pointer' }]}
                  />
                )}
                <DeleteIcon color="#54597a" style={[spacings.phTy, { cursor: 'pointer' }]} />
              </View>
            </View>
          ))}
      </View>
    </View>
  )
}

export default React.memo(HideToken)
