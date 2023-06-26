import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { AntDesign } from '@expo/vector-icons'
import { LARGE_PAGE_STEP } from '@web/modules/accounts-importer/constants/pagination'
import useAccountsPagination from '@web/modules/accounts-importer/hooks/useAccountsPagination'

// TODO: each legacy account in the list should be grouped with an Ambire Smart Account
// TODO: each list item must be selectable (checkbox)

const AccountsList = ({ accounts, loading }: { accounts: any[]; loading?: boolean }) => {
  const {
    page,
    handleSmallPageStepDecrement,
    handleSmallPageStepIncrement,
    handleLargePageStepDecrement,
    handleLargePageStepIncrement
  } = useAccountsPagination()

  return (
    <View>
      {(!accounts.length || !!loading) && <Spinner />}
      {!!accounts.length && !loading && (
        <View>
          {accounts.map((acc, idx) => {
            if (acc.address) {
              return (
                <View key={acc.address} style={[flexbox.directionRow, flexbox.alignCenter]}>
                  <Text weight="semiBold" style={spacings.mhSm}>
                    {acc?.index || idx + 1}
                  </Text>
                  <View
                    style={[
                      spacings.mbTy,
                      {
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: colors.chetwode_50,
                        borderRadius: 10
                      }
                    ]}
                  >
                    <Text fontSize={12} weight="medium">
                      Legacy Account
                    </Text>
                    <Text>{acc.address}</Text>
                  </View>
                </View>
              )
            }
            return null
          })}
          <View
            style={[flexbox.directionRow, flexbox.justifyCenter, flexbox.alignCenter, spacings.pv]}
          >
            <TouchableOpacity
              onPress={handleLargePageStepDecrement}
              disabled={page <= LARGE_PAGE_STEP}
              style={page <= LARGE_PAGE_STEP && { opacity: 0.6 }}
            >
              <AntDesign color={colors.white} name="doubleleft" size={24} spot />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSmallPageStepDecrement}
              disabled={page === 1}
              style={page === 1 && { opacity: 0.6 }}
            >
              <AntDesign color={colors.white} name="left" size={24} spot />
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
            <TouchableOpacity onPress={handleSmallPageStepIncrement}>
              <AntDesign color={colors.white} name="right" size={24} spot />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLargePageStepIncrement}>
              <AntDesign color={colors.white} name="doubleright" size={24} spot />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

export default React.memo(AccountsList)
