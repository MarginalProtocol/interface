import { useMemo } from "react"

enum LOGOLESS_COLORS {
  PINK = "PINK",
  ORANGE = "ORANGE",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
  TURQUOISE = "TURQUOISE",
  CYAN = "CYAN",
  BLUE = "BLUE",
  PURPLE = "PURPLE",
}

type ColorScheme = {
  light: { foreground: string; background: string }
  dark: { foreground: string; background: string }
}

type LogolessColorSchemes = {
  [key in LOGOLESS_COLORS]: ColorScheme
}

const logolessColorSchemes: LogolessColorSchemes = {
  // TODO (MOB-2417): update the colors in the global colors file to these and pull from there
  [LOGOLESS_COLORS.PINK]: {
    light: { foreground: "#FC74FE", background: "#FEF4FF" },
    dark: { foreground: "#FC74FE", background: "#361A37" },
  },
  [LOGOLESS_COLORS.ORANGE]: {
    light: { foreground: "#FF7715", background: "#FFF2F1" },
    dark: { foreground: "#FF7715", background: "#2E0805" },
  },
  [LOGOLESS_COLORS.YELLOW]: {
    light: { foreground: "#FFBF17", background: "#FFFCF2" },
    dark: { foreground: "#FFF612", background: "#1F1E02" },
  },
  [LOGOLESS_COLORS.GREEN]: {
    light: { foreground: "#2FBA61", background: "#EEFBF1" },
    dark: { foreground: "#2FBA61", background: "#0F2C1A" },
  },
  [LOGOLESS_COLORS.TURQUOISE]: {
    light: { foreground: "#00C3A0", background: "#F7FEEB" },
    dark: { foreground: "#5CFE9D", background: "#1A2A21" },
  },
  [LOGOLESS_COLORS.CYAN]: {
    light: { foreground: "#2ABDFF", background: "#EBF8FF" },
    dark: { foreground: "#2ABDFF", background: "#15242B" },
  },
  [LOGOLESS_COLORS.BLUE]: {
    light: { foreground: "#3271FF", background: "#EFF4FF" },
    dark: { foreground: "#3271FF", background: "#10143D" },
  },
  [LOGOLESS_COLORS.PURPLE]: {
    light: { foreground: "#9E62FF", background: "#FAF5FF" },
    dark: { foreground: "#9E62FF", background: "#1A0040" },
  },
}

function getLogolessColorIndex(tokenName: string, numOptions: number): number {
  const charCodes = Array.from(tokenName).map((char) => char.charCodeAt(0))
  const sum = charCodes.reduce((acc, curr) => acc + curr, 0)
  return sum % numOptions
}

/**
 * Picks a color scheme for a token that doesn't have a logo.
 * The color scheme is derived from the characters of the token name and will only change if the name changes
 * @param tokenName The name of the token
 * @returns a light and dark version of a color scheme with a foreground and background color
 */
export function useLogolessColorScheme(tokenName: string): ColorScheme {
  return useMemo(() => {
    const index = getLogolessColorIndex(tokenName, Object.keys(LOGOLESS_COLORS).length)
    return logolessColorSchemes[
      LOGOLESS_COLORS[Object.keys(LOGOLESS_COLORS)[index] as keyof typeof LOGOLESS_COLORS]
    ]
  }, [tokenName])
}
