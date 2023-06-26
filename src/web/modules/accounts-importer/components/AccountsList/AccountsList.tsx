import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { LARGE_PAGE_STEP } from '@web/modules/accounts-importer/constants/pagination'
import Account from '@web/modules/accounts-importer/components/AccountsList/Account'

import useAccountsPagination from '@web/modules/accounts-importer/hooks/useAccountsPagination'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import LeftDoubleArrowIcon from '@common/assets/svg/LeftDoubleArrowIcon.tsx'
import RightDoubleArrowIcon from '@common/assets/svg/RightDoubleArrowIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'

// TODO: each legacy account in the list should be grouped with an Ambire Smart Account
// TODO: each list item must be selectable (checkbox)

const AccountsList = ({ accounts, loading }: { accounts: any[]; loading?: boolean }) => {
  const { t } = useTranslation()

  const {
    page,
    handleSmallPageStepDecrement,
    handleSmallPageStepIncrement,
    handleLargePageStepDecrement,
    handleLargePageStepIncrement
  } = useAccountsPagination()

  return (
    <View>
      {(!accounts.length || !!loading) && (
        <View style={[flexbox.alignCenter]}>
          <View style={[spacings.mb, flexbox.alignCenter, flexbox.directionRow]}>
            <Spinner style={{ width: 16, height: 16 }} />
            <Text color={colors.violet} style={[spacings.mlSm]} fontSize={12}>
              {t('Looking for linked smart accounts')}
            </Text>
          </View>
        </View>
      )}
      {!!accounts.length && !loading && (
        <View>
          <Wrapper style={{ height: 300, overflowY: 'auto' }}>
            {accounts.map((acc, idx) => (
              <Account key={acc.address} acc={acc} idx={idx} />
            ))}
          </Wrapper>
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
            <TouchableOpacity onPress={handleSmallPageStepIncrement}>
              <RightArrowIcon style={[spacings.mrTy]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLargePageStepIncrement}>
              <RightDoubleArrowIcon />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

export default React.memo(AccountsList)
