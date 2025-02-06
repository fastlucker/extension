import React, { useContext, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AddIcon from '@common/assets/svg/AddIcon'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import Badge from '@common/components/Badge'
import Button from '@common/components/Button'
import Dropdown from '@common/components/Dropdown'
import NetworkIcon from '@common/components/NetworkIcon'
import Search from '@common/components/Search'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'
import { getTokenId } from '@web/utils/token'

import getStyles from './styles'

const ALL_NETWORKS_OPTION = {
  value: 'all',
  label: <Text weight="medium">All Networks</Text>,
  icon: (
    <View style={spacings.phMi}>
      <NetworksIcon width={24} height={24} />
    </View>
  )
}

const ManageTokensSettingsScreen = () => {
  // TODO: Componentize
  const { t } = useTranslation()
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { control } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const { networks } = useNetworksControllerState()
  const { theme } = useTheme(getStyles)
  const {
    portfolio: { isAllReady, tokens }
  } = useSelectedAccountControllerState()

  useEffect(() => {
    setCurrentSettingsPage('manage-tokens')
  }, [setCurrentSettingsPage])

  const customOrHiddenTokens = useMemo(() => {
    return tokens
      .filter(({ flags }) => {
        return flags.isCustom || flags.isHidden
      })
      .sort((a, b) => {
        const isACustom = a.flags.isCustom
        const isBCustom = b.flags.isCustom

        if (isACustom && !isBCustom) return -1
        if (!isACustom && isBCustom) return 1

        const aIsHidden = a.flags.isHidden
        const bIsHidden = b.flags.isHidden

        if (!aIsHidden && bIsHidden) return -1
        if (aIsHidden && !bIsHidden) return 1

        return a.symbol.localeCompare(b.symbol)
      })
  }, [tokens])

  const networksOptions: SelectValue[] = useMemo(
    () => [
      ALL_NETWORKS_OPTION,
      ...networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon key={n.id} id={n.id} />
      }))
    ],
    [networks]
  )

  return (
    <View>
      <View
        style={[
          flexbox.directionRow,
          flexbox.justifySpaceBetween,
          flexbox.alignCenter,
          spacings.mbXl
        ]}
      >
        <View style={{ maxWidth: 512 }}>
          <Text appearance="primaryText" fontSize={20} style={spacings.mbTy} weight="medium">
            {t('Manage Tokens')}
          </Text>
          <Text appearance="secondaryText">
            {t(
              'Manage your custom and hidden tokens. These settings will be applied across all accounts.'
            )}
          </Text>
        </View>
        <Button
          childrenPosition="left"
          style={{ width: 220 }}
          text={t('Add Custom Token')}
          onPress={() => {}}
        >
          <AddIcon color={theme.primaryBackground} />
        </Button>
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
        <Search
          containerStyle={{
            minWidth: 360,
            ...spacings.mrTy
          }}
          placeholder={t('Search tokens')}
          control={control}
          height={50}
        />
        <Select
          options={networksOptions}
          value={networksOptions[0]}
          setValue={() => {}}
          containerStyle={{ width: 260, marginBottom: 0 }}
        />
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pvMi]}>
        <View style={{ flex: 1.25, ...spacings.plSm }}>
          <Text appearance="secondaryText" fontSize={14}>
            Token
          </Text>
        </View>
        <View style={{ flex: 1.75 }}>
          <Text appearance="secondaryText" fontSize={14}>
            Network
          </Text>
        </View>
        <View style={{ flex: 0.4, ...spacings.prSm }}>
          <Text appearance="secondaryText" fontSize={14}>
            Visibility
          </Text>
        </View>
      </View>
      {isAllReady ? (
        customOrHiddenTokens.map((token) => (
          <View
            key={getTokenId(token)}
            style={[
              flexbox.directionRow,
              flexbox.alignCenter,
              common.borderRadiusPrimary,
              flexbox.flex1,
              spacings.mbTy,
              spacings.pvTy,
              {
                backgroundColor: theme.secondaryBackground
              }
            ]}
          >
            <View
              style={[{ flex: 1.25 }, flexbox.directionRow, flexbox.alignCenter, spacings.plSm]}
            >
              <TokenIcon
                withContainer
                address={token.address}
                networkId={token.networkId}
                onGasTank={token.flags.onGasTank}
                containerHeight={40}
                containerWidth={40}
                width={28}
                height={28}
              />
              <Text weight="medium" selectable style={spacings.mrTy}>
                {token.symbol}
              </Text>
              {token.flags.isCustom && <Badge text="Custom" />}
            </View>
            <View style={[flexbox.directionRow, flexbox.alignCenter, { flex: 1.75 }]}>
              <NetworkIcon id={token.networkId} style={spacings.mrTy} />
              <Text>
                {networks.find(({ id }) => id === token.networkId)?.name || 'Unknown Network'}
              </Text>
            </View>
            <View
              style={[
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.justifySpaceBetween,
                spacings.prSm,
                { flex: 0.4 }
              ]}
            >
              <Toggle isOn={!token.flags.isHidden} onToggle={() => {}} />
              <Dropdown data={[]} onSelect={() => {}} />
            </View>
          </View>
        ))
      ) : (
        // TODO: Skeleton
        <Text>Loading...</Text>
      )}
    </View>
  )
}

export default ManageTokensSettingsScreen
