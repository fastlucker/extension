import {
  RobotoSlab_300Light,
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  RobotoSlab_600SemiBold,
  RobotoSlab_700Bold,
  RobotoSlab_900Black,
  useFonts as useFontsRnRoboto
} from '@expo-google-fonts/roboto-slab'
import {
  useFonts as useFontsRn,
  Vollkorn_400Regular,
  Vollkorn_500Medium,
  Vollkorn_600SemiBold,
  Vollkorn_700Bold
} from '@expo-google-fonts/vollkorn'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FONT_FAMILIES {
  LIGHT = 'Vollkorn_300Light',
  REGULAR = 'Vollkorn_400Regular',
  MEDIUM = 'Vollkorn_500Medium',
  SEMI_BOLD = 'Vollkorn_600SemiBold'
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum ROBOTO_FONT_FAMILIES {
  LIGHT = 'RobotoSlab_300Light',
  REGULAR = 'RobotoSlab_400Regular',
  MEDIUM = 'RobotoSlab_500Medium',
  BOLD = 'RobotoSlab_700Bold',
  BLACK = 'RobotoSlab_900Black'
}

export interface UseFontsReturnType {
  fontsLoaded: boolean
  robotoFontsLoaded: boolean
}

export default function useFonts(): UseFontsReturnType {
  // Import only the ones that are used, because having all could lead to a performance
  // penalty, since loading of the fonts take some time during initial app open.
  const [fontsLoaded] = useFontsRn({
    // Vollkorn_100Thin,
    // Vollkorn_100Thin_Italic,
    // Vollkorn_200ExtraLight,
    // Vollkorn_200ExtraLight_Italic,
    // Vollkorn_300Light_Italic,
    Vollkorn_400Regular,
    // Vollkorn_400Regular_Italic,
    Vollkorn_500Medium,
    // Vollkorn_500Medium_Italic,
    Vollkorn_600SemiBold,
    // Vollkorn_600SemiBold_Italic,
    Vollkorn_700Bold
    // Vollkorn_700Bold_Italic,
    // Vollkorn_800ExtraBold,
    // Vollkorn_800ExtraBold_Italic,
    // Vollkorn_900Black,
    // Vollkorn_900Black_Italic
  })

  const [robotoFontsLoaded] = useFontsRnRoboto({
    RobotoSlab_300Light,
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    RobotoSlab_600SemiBold,
    RobotoSlab_700Bold,
    RobotoSlab_900Black
  })

  return { fontsLoaded, robotoFontsLoaded }
}
