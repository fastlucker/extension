const WHEEL_PRIZE_DATA: {
  [key: number]: { from: number; to: number }[]
} = {
  300: [{ from: 5, to: -5 }], // covers top center
  150: [{ from: -205, to: -215 }],
  80: [
    { from: -55, to: -65 },
    { from: -175, to: -185 },
    { from: -235, to: -245 },
    { from: -325, to: -335 }
  ],
  50: [
    { from: -25, to: -35 },
    { from: -85, to: -95 },
    { from: -145, to: -155 },
    { from: -265, to: -275 }
  ],
  20: [
    { from: -115, to: -125 },
    { from: -295, to: -305 }
  ]
}

export default WHEEL_PRIZE_DATA
