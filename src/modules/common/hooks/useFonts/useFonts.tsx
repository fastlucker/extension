import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts as useFontsRn
} from '@expo-google-fonts/poppins'

export default function useFonts() {
  // Import only the ones that are used, because having all could lead to a performance
  // penalty, since loading of the fonts take some time during initial app open.
  const [fontsLoaded] = useFontsRn({
    // Poppins_100Thin,
    // Poppins_100Thin_Italic,
    // Poppins_200ExtraLight,
    // Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    // Poppins_300Light_Italic,
    Poppins_400Regular,
    // Poppins_400Regular_Italic,
    Poppins_500Medium
    // Poppins_500Medium_Italic,
    // Poppins_600SemiBold,
    // Poppins_600SemiBold_Italic,
    // Poppins_700Bold,
    // Poppins_700Bold_Italic,
    // Poppins_800ExtraBold,
    // Poppins_800ExtraBold_Italic,
    // Poppins_900Black,
    // Poppins_900Black_Italic
  })

  return { fontsLoaded }
}
