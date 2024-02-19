export type WindowSizeProps = {
  width: number
  height: number
  minElementWidthSize: (size: number) => boolean
  maxElementWidthSize: (size: number) => boolean
}
