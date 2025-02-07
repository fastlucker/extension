import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import NetworksIcon from '@common/assets/svg/NetworksIcon'
import Checkbox from '@common/components/Checkbox'
import NetworkIcon from '@common/components/NetworkIcon'
import Search from '@common/components/Search'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

type Props = {
  control: any
  networkFilter: string
  setNetworkFilterValue: (value: SelectValue) => void
  displayAllTokens: boolean
  setDisplayAllTokens: React.Dispatch<React.SetStateAction<boolean>>
}

const ALL_NETWORKS_OPTION = {
  value: 'all',
  label: <Text weight="medium">All Networks</Text>,
  icon: (
    <View style={spacings.phMi}>
      <NetworksIcon width={24} height={24} />
    </View>
  )
}

const Filters: FC<Props> = ({
  control,
  networkFilter,
  setNetworkFilterValue,
  displayAllTokens,
  setDisplayAllTokens
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { networks } = useNetworksControllerState()

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
    <View
      style={[flexbox.directionRow, flexbox.alignEnd, flexbox.justifySpaceBetween, spacings.mbMd]}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <Search
          containerStyle={{
            minWidth: 280,
            ...spacings.mrTy
          }}
          placeholder={t('Search tokens')}
          control={control}
          height={50}
        />
        <Select
          options={networksOptions}
          value={
            networkFilter
              ? networksOptions.filter((opt) => opt.value === networkFilter)[0]
              : ALL_NETWORKS_OPTION
          }
          setValue={setNetworkFilterValue}
          containerStyle={{ width: 260, marginBottom: 0, ...spacings.mrTy }}
        />
      </View>
      <Checkbox
        label={t('Display selected account tokens')}
        value={displayAllTokens}
        onValueChange={setDisplayAllTokens}
        labelProps={{ style: { color: theme.secondaryText } }}
        style={[
          flexbox.alignSelfEnd,
          spacings.phTy,
          spacings.pvTy,
          spacings.mb0,
          common.borderRadiusPrimary,
          {
            width: 'fit-content',
            backgroundColor: theme.secondaryBackground,
            marginBottom: 2
          }
        ]}
      />
    </View>
  )
}

export default Filters
