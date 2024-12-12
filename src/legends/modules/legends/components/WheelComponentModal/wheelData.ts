const WHEEL_PRIZE_DATA: {
  [key: number]: { from: number; to: number }[]
} = {
  300: [
    {
      from: 11,
      to: -10
    }
  ],
  150: [
    {
      from: -215,
      to: -245
    }
  ],
  80: [
    {
      from: -46,
      to: -76
    },
    {
      from: -181,
      to: -211
    },
    {
      from: -249,
      to: -279
    }
  ],
  20: [
    { from: -114, to: -144 },
    {
      from: -317,
      to: -347
    }
  ],
  50: [
    {
      from: -11,
      to: -43
    },
    {
      from: -79,
      to: -111
    },
    {
      from: -147,
      to: -178
    },
    {
      from: -282,
      to: -313
    }
  ]
}

export default WHEEL_PRIZE_DATA
