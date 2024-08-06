import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import AccountAddress from '@common/components/AccountAddress'
import Avatar from '@common/components/Avatar'
import Text from '@common/components/Text'
import useReverseLookup from '@common/hooks/useReverseLookup'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const AccountOption = ({ acc }: { acc: Account }) => {
  const { ens, ud, isLoading } = useReverseLookup({ address: acc.addr })

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Avatar ens={ens} ud={ud} pfp={acc.preferences.pfp} size={32} style={spacings.prTy} />
      <View>
        <Text
          fontSize={14}
          weight="medium"
          style={{
            lineHeight: 20
          }}
        >
          {acc.preferences.label}
        </Text>
        <AccountAddress
          isLoading={isLoading}
          ens={ens}
          ud={ud}
          address={acc.addr}
          plainAddressMaxLength={32}
          withCopy={false}
        />
      </View>
    </View>
  )
}

export default AccountOption
