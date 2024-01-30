function hex2dec(hex: string) {
  const matched = hex.replace('#', '').match(/.{2}/g)
  if (!matched) throw new Error('Invalid hex string')
  return matched.map((n) => parseInt(n, 16))
}

function rgb2hex(r: number, g: number, b: number) {
  let newR = Math.round(r)
  let newG = Math.round(g)
  let newB = Math.round(b)
  newR = Math.min(r, 255)
  newG = Math.min(g, 255)
  newB = Math.min(b, 255)

  return `#${[newR, newG, newB].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export default function mixHexColors(hex1: string, hex2: string, ratio: number = 0.5) {
  if (ratio > 1 || ratio < 0) throw new Error('Invalid ratio')
  const [r1, g1, b1] = hex2dec(hex1)
  const [r2, g2, b2] = hex2dec(hex2)
  const r = Math.round(r1 * ratio + r2 * (1 - ratio))
  const g = Math.round(g1 * ratio + g2 * (1 - ratio))
  const b = Math.round(b1 * ratio + b2 * (1 - ratio))
  return rgb2hex(r, g, b)
}
