export function isCrossOriginFrame(): boolean {
  try {
    const topOrigin = window?.top?.location?.origin
    const currentOrigin = window?.location?.origin
    return !topOrigin || currentOrigin !== topOrigin
  } catch {
    return true
  }
}

export function isTooDeepFrameInTheFrameHierarchy(maxDepth = 10): boolean {
  let depth = 0
  let win: Window | null = window

  while (win && win !== window.top && depth < maxDepth) {
    win = win.parent
    depth++
  }

  return win !== window.top
}
