export type ElementSizeProps = {
  width: number
  height: number
  x: number
  y: number
  minElementWidthSize: (size: number) => boolean
  maxElementWidthSize: (size: number) => boolean
}
