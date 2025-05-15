import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

import { Hex } from '@ambire-common/interfaces/hex'
import { getDelegatorName } from '@ambire-common/libs/7702/7702'
import ExpandableCard from '@common/components/ExpandableCard'
import Text from '@common/components/Text'

interface Props {
  setDelegation?: boolean
  delegatedContract?: Hex | null
}

const DelegationHumanization: FC<Props> = ({ setDelegation, delegatedContract }) => {
  const { t } = useTranslation()

  const delegatorName = useMemo(() => {
    if (!delegatedContract) return ''
    return getDelegatorName(delegatedContract)
  }, [delegatedContract])

  return (
    <View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
        <ExpandableCard
          enableToggleExpand={false}
          hasArrow={false}
          style={{ width: '100%' }}
          content={
            <Text>
              {setDelegation ? (
                <>
                  <Text weight="semiBold">{t('Enable')} </Text>
                  <Text>{t('the Ambire EIP-7702 Delegation for this account')}</Text>
                </>
              ) : (
                <>
                  <Text weight="semiBold">{t('Revoke')} </Text>
                  <Text>
                    {t('the')} {delegatorName ? `${delegatorName} ` : ''}
                    {t('EIP-7702 Delegation for this account')}
                  </Text>
                  {!delegatorName && <Text weight="semiBold">: {delegatedContract}</Text>}
                </>
              )}
            </Text>
          }
        />
      </View>
    </View>
  )
}

export default DelegationHumanization
