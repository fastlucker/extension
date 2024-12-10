import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const CloseIcon: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
    <Rect x={0.5} y={0.5} width={31} height={31} rx={15.5} stroke="#FAF6F0" />
    <Path
      d="M13.808 21.5h-3.536v-.496l.64-.256c.432-.16.608-.4.976-.928l2.672-3.76L12 12.284c-.512-.752-.576-.816-.928-.992l-.544-.256v-.496h4.736v.496l-.528.224c-.304.144-.432.272-.432.448 0 .128.08.32.224.528l1.616 2.416 1.616-2.304c.256-.384.368-.56.368-.704 0-.16-.128-.304-.464-.432l-.448-.176v-.496h3.568v.496l-.64.256c-.432.16-.608.4-.992.928l-2.416 3.328 2.816 4.208c.512.768.608.832.944.992l.544.256v.496h-4.736v-.496l.512-.224c.32-.144.448-.272.448-.448 0-.128-.096-.32-.24-.528l-1.872-2.848-1.856 2.736c-.256.368-.384.56-.384.704 0 .16.128.32.464.432l.432.176v.496z"
      fill="#FAF6F0"
    />
  </Svg>
)

export default React.memo(CloseIcon)
