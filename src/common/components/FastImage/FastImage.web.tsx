import React from 'react'
import { Image, ImageProps } from 'react-native'

// The 'react-native-fast-image' module doesn't work for the web, therefore -
// fallback to the default React Native Image component. The default image
// component should be quite enough for the web, because the
// 'react-native-fast-image' module solves performance issues on mobile only.
const FastImage: React.ComponentType<ImageProps> = (props) => <Image {...props} />

export default FastImage
