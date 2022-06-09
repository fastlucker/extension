import React from 'react'

import Header from '@config/Router/Header'

export const headerAlpha = (props: any) => <Header withHamburger withScanner {...props} name="a" />
export const headerBeta = (props: any) => <Header mode="title" {...props} name="b" />
export const headerGamma = (props: any) => <Header {...props} withScanner name="c" />
