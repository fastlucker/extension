import React from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import BackButton from '@common/components/BackButton'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useDappsControllerState from '@web/hooks/useDappsControllerState'

const DappCatalogScreen = () => {
  const { control, watch } = useForm({
    defaultValues: {
      search: ''
    }
  })

  const { state } = useDappsControllerState()

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
        <Search placeholder="Search for dApp" control={control} />
        <ScrollView>
          {state.dapps.map((dapp) => {
            return (
              <View>
                <Text>{dapp.name}</Text>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </TabLayoutContainer>
  )
}

export default React.memo(DappCatalogScreen)
