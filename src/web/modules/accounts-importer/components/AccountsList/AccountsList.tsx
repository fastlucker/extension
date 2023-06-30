import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Button from '@common/components/Button'
import Toggle from '@common/components/Toggle'
import Select from '@common/components/Select'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { LARGE_PAGE_STEP } from '@web/modules/accounts-importer/constants/pagination'
import Account from '@web/modules/accounts-importer/components/Account'

import useAccountsPagination from '@web/modules/accounts-importer/hooks/useAccountsPagination'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import LeftDoubleArrowIcon from '@common/assets/svg/LeftDoubleArrowIcon.tsx'
import RightDoubleArrowIcon from '@common/assets/svg/RightDoubleArrowIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'

// TODO: each legacy account in the list should be grouped with an Ambire Smart Account
// TODO: each list item must be selectable (checkbox)

const AccountsList = ({
  accounts,
  loading,
  onImportReady
}: {
  accounts: any[]
  loading?: boolean
  onImportReady: () => void
}) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [elementHeights, setElementHeights] = useState({})
  const [totalHeight, setTotalHeight] = useState(300)

  const handleLayout = (index: string, event: any) => {
    const { height } = event.nativeEvent.layout
    setElementHeights((prevState) => ({ ...prevState, [index]: height + 10 }))
  }

  useEffect(() => {
    // Calculate the sum of heights
    const totalHeightCalculated = Object.values(elementHeights)
      .slice(0, 4)
      .reduce((acc, height) => acc + height, 0)

    accounts.length && setTotalHeight(totalHeightCalculated)
  }, [elementHeights])

  const {
    page,
    handleSmallPageStepDecrement,
    handleSmallPageStepIncrement,
    handleLargePageStepDecrement,
    handleLargePageStepIncrement
  } = useAccountsPagination()

  return (
    <View>
      <View style={[flexbox.alignCenter]}>
        <Wrapper contentContainerStyle={{ height: totalHeight, ...spacings.pt0 }}>
          {!!accounts.length && !loading ? (
            accounts.map((acc, idx) => (
              <Account key={acc.address} handleLayout={handleLayout} acc={acc} idx={idx} />
            ))
          ) : (
            <View style={[flexbox.alignCenter]}>
              <View style={[spacings.mb, flexbox.alignCenter, flexbox.directionRow]}>
                <Spinner style={{ width: 16, height: 16 }} />
              </View>
            </View>
          )}
        </Wrapper>
        <View style={[flexbox.alignCenter, spacings.pt]}>
          <View style={[spacings.mb, flexbox.alignCenter, flexbox.directionRow]}>
            <Spinner style={{ width: 16, height: 16 }} />
            <Text color={colors.violet} style={[spacings.mlSm]} fontSize={12}>
              {t('Looking for linked smart accounts')}
            </Text>
          </View>
        </View>
        <View
          style={[flexbox.directionRow, flexbox.justifyCenter, flexbox.alignCenter, spacings.pv]}
        >
          <TouchableOpacity
            onPress={handleLargePageStepDecrement}
            disabled={page <= LARGE_PAGE_STEP}
            style={page <= LARGE_PAGE_STEP && { opacity: 0.6 }}
          >
            <LeftDoubleArrowIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSmallPageStepDecrement}
            disabled={page === 1}
            style={page === 1 && { opacity: 0.6 }}
          >
            <LeftArrowIcon width={36} height={36} style={[spacings.mlTy]} />
          </TouchableOpacity>
          <Text style={spacings.ph}>
            {page > 2 && <Text>{'...  '}</Text>}
            {page === 1 && (
              <Text>
                <Text weight="semiBold">{page}</Text>
                <Text>{`  ${page + 1}  ${page + 2}`}</Text>
              </Text>
            )}
            {page !== 1 && (
              <Text>
                <Text>{`  ${page - 1}  `}</Text>
                <Text weight="semiBold">{page}</Text>
                <Text>{`  ${page + 1}`}</Text>
              </Text>
            )}
            <Text>{'  ...'}</Text>
          </Text>
          <TouchableOpacity
            style={loading && { opacity: 0.6 }}
            disabled={loading}
            onPress={handleSmallPageStepIncrement}
          >
            <RightArrowIcon style={[spacings.mrTy]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={loading && { opacity: 0.6 }}
            disabled={loading}
            onPress={handleLargePageStepIncrement}
          >
            <RightDoubleArrowIcon />
          </TouchableOpacity>
        </View>
        <Toggle label="Show empty legacy accounts" />
        <Select
          hasArrow
          options={[
            { label: 'Swap', value: 'Swap' },
            { label: 'Bridge', value: 'Bridge' },
            { label: 'Top Up Gas Tank', value: 'Top Up Gas Tank' },
            { label: 'Deposit', value: 'Deposit' }
          ]}
          setValue={setValue}
          value={value}
          menuPlacement="top"
          label="Custom Derivation"
        />
        <Button
          style={{ ...spacings.mtTy, width: 296, ...flexbox.alignSelfCenter }}
          onPress={onImportReady}
          text="Import Accounts"
        />
      </View>
    </View>
  )
}

export default React.memo(AccountsList)
