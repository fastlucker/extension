import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'

const AccountsImporterScreen = () => {
  const { params } = useRoute()

  console.log('AccountsImporterScreen params: ', params)
  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Title>Accounts Importer Screen</Title>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default AccountsImporterScreen
