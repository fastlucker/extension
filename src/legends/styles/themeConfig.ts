import { ColorValue } from 'react-native'

const colors = {
  springWood: '#F1EEE5',
  merino: '#F2E9DB',
  starkWhite: '#EADDC9',
  cinnabar: '#E75132',
  mineShaft: '#333131',
  chicago: '#5C5954',
  tapa: '#79766F',
  silk: '#BAAFAC',
  ebonyClay: '#2A3041',
  givry: '#F9DBC5',
  rawSienna: '#D08D4C',
  pottersClay: '#8A6037',
  westar: '#E8E6E3',
  cloudy: '#B0ACA4',
  ironsideGray: '#686663',
  dairyCream: '#F8E3B7',
  fuelYellow: '#E7AA27',
  pirateGold: '#B67D02'
}

export type ThemeProps = {
  [key in keyof typeof LEGENDS_THEME]: ColorValue
}

const LEGENDS_THEME = {
  primaryText: colors.mineShaft,
  secondaryText: colors.chicago,
  tertiaryText: colors.tapa,
  primaryBorder: colors.silk,
  secondaryBorder: colors.ebonyClay,
  primaryBackground: colors.springWood,
  secondaryBackground: colors.merino,
  tertiaryBackground: colors.starkWhite,
  accent: colors.cinnabar,
  bronzeBackground: colors.givry,
  bronzeDecorative: colors.rawSienna,
  bronzeText: colors.pottersClay,
  silverBackground: colors.westar,
  silverDecorative: colors.cloudy,
  silverText: colors.ironsideGray,
  goldBackground: colors.dairyCream,
  goldDecorative: colors.fuelYellow,
  goldText: colors.pirateGold
}

export default LEGENDS_THEME
