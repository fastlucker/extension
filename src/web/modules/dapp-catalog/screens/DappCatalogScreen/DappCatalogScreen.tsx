import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import BackButton from '@common/components/BackButton'
import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import Search from '@common/components/Search'
import Header from '@common/modules/header/components/Header'
import spacings, { SPACING_MI, SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { Dapp } from '@web/extension-services/background/controllers/dapps'
import useDappsControllerState from '@web/hooks/useDappsControllerState'
import DappItem from '@web/modules/dapp-catalog/components/DappItem'

const DappCatalogScreen = () => {
  const { control, watch } = useForm({
    defaultValues: {
      search: ''
    }
  })

  const { state } = useDappsControllerState()

  const search = watch('search')

  const filteredDapps = useMemo(
    () => state.dapps.filter((dapp) => dapp.name.toLowerCase().includes(search.toLowerCase())),
    [search, state.dapps]
  )

  const renderItem = ({ item }: { item: Dapp }) => <DappItem {...item} />

  return (
    <TabLayoutContainer
      hideFooterInPopup
      width="full"
      footer={<BackButton />}
      footerStyle={{ maxWidth: tabLayoutWidths.xl }}
      header={<Header withPopupBackButton mode="title" withAmbireLogo />}
      style={spacings.ph0}
      withHorizontalPadding={false}
    >
      <View style={[flexbox.flex1]}>
        <View style={[spacings.phSm, spacings.pvSm]}>
          <Search placeholder="Search for dApp" control={control} />
        </View>
        <ScrollableWrapper
          type={WRAPPER_TYPES.FLAT_LIST}
          contentContainerStyle={[
            spacings.plTy,
            spacings.pbTy,
            { paddingRight: SPACING_TY - SPACING_MI / 2, marginTop: -SPACING_MI }
          ]}
          numColumns={3}
          data={filteredDapps}
          renderItem={renderItem}
          keyExtractor={(item: Dapp) => item.id}
        />
      </View>
    </TabLayoutContainer>
  )
}

export default React.memo(DappCatalogScreen)
