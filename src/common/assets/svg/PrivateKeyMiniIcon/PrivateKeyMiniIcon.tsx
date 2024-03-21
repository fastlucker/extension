import React from 'react'
import Svg, { Circle, G, Path, SvgProps } from 'react-native-svg'

const PrivateKeyMiniIcon: React.FC<SvgProps> = ({ width = 43, height = 50, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...rest}>
    <G transform="translate(11029 -7569)">
      <Circle cx="12" cy="12" r="12" transform="translate(-11029 7569)" fill="#141833" />
      <Path fill="none" d="M-11029 7569h24v24h-24z" />
      <G fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-11012.113 7582.87a4.842 4.842 0 0 1-4.858 1.2l-3.011 3a1.237 1.237 0 0 1-.952.313l-1.393-.192a1.207 1.207 0 0 1-.956-.958l-.192-1.393a1.288 1.288 0 0 1 .313-.952l3-3a4.84 4.84 0 1 1 8.047 1.988Z" />
        <Path data-name="Path 3643" d="m-11020.359 7584.507 1.47 1.47" />
        <Path
          data-name="Path 3644"
          d="M-11015.494 7580.999a1.6 1.6 0 1 0-1.6-1.6 1.6 1.6 0 0 0 1.6 1.6Z"
        />
      </G>
    </G>
  </Svg>
)

export default React.memo(PrivateKeyMiniIcon)
