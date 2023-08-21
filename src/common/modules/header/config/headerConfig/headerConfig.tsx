import React from 'react'

import Header from '@common/modules/header/components/Header'

export const headerControls = (props: any) => (
  <Header withHamburger withHeaderRight {...props} name="controls" />
)
export const headerTitle = (props: any) => <Header mode="title" {...props} name="title" />
export const headerTitleWithAmbireLogo = (props: any) => (
  <Header mode="title" {...props} name="title" withBackButton={false} withAmbireLogo />
)
