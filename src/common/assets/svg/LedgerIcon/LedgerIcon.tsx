import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const LedgerIcon: React.FC<SvgProps> = ({
  width = 57,
  height = 57,
  color = iconColors.primary
}) => (
  <Svg width={width} height={height} viewBox="0 0 57 57">
    <G fill="none">
      <Path d="M47.001 56.998h-3.4V43.359h13.4v3.639a10.012 10.012 0 0 1-10 10Zm-11.4 0h-13.6V43.359h13.6v13.639Zm-21.6 0h-4a10.012 10.012 0 0 1-10-10v-3.639h14v13.639Zm43-21.879h-35V-.002h25a10 10 0 0 1 10 10v25.121Zm-43 0h-14V21.738h14v13.381Zm0-21.621h-14v-3.5a10 10 0 0 1 10-10h4v13.5Z" />
      <Path
        fill={color}
        d="M47 55c4.411 0 8-3.588 8-8v-1.639h-9.396V55H47m-13.401 0v-9.639H24V55h9.598m-21.597 0v-9.639H2V47c0 4.412 3.589 8 8 8h2.002M55 33.121V10a7.956 7.956 0 0 0-2.342-5.658A7.953 7.953 0 0 0 47 2H24.001v31.121H55m-42.998 0v-9.38H2v9.38h10.002m0-21.621V2H10a7.949 7.949 0 0 0-5.657 2.342A7.953 7.953 0 0 0 2 10v1.5h10.002M47 57h-3.396V43.361H57V47c0 5.514-4.486 10-10 10Zm-11.401 0H22V43.361h13.598V57Zm-21.597 0H10C4.486 57 0 52.514 0 47v-3.639h14.002V57ZM57 35.121H22.001V0H47a9.94 9.94 0 0 1 7.072 2.928A9.94 9.94 0 0 1 57 10v25.121Zm-42.998 0H0v-13.38h14.002v13.38Zm0-21.621H0V10a9.94 9.94 0 0 1 2.928-7.072A9.94 9.94 0 0 1 10 0h4.002v13.5Z"
      />
    </G>
  </Svg>
)

export default LedgerIcon
