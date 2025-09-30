const poppins = {
  fontFamily: "'Poppins', sans-serif",
  fontWeights: {
    300: "300",
    400: "400",
    500: "500",
    600: "600",
    700: "700",
  },
} as const;

const publicSans = {
  fontFamily: "'Public Sans', sans-serif",
  fontWeights: {
    300: "300",
    400: "400",
    500: "500",
  },
} as const;

const fonts = { publicSans, poppins } as const;

//
type Fonts = typeof fonts;
type FontPublicSans = typeof publicSans;
type FontPoppins = typeof poppins;

type FontProps<Z extends keyof Fonts> = Z extends keyof Fonts
  ? {
      fontFamily: ReturnType<<T extends keyof Fonts = Z>() => T>;
      fontWeight: Z extends keyof Fonts ? keyof Fonts[Z]["fontWeights"] : any;
    }
  : {
      fontFamily: keyof Fonts;
      fontWeight: string | number;
    };

// const a: FontProps = {
//   fontFamily: "publicSans",
//   fontWeight: "400",
// };

export const getFontProps = (
  font: keyof Fonts,
  fontWeight?: keyof Fonts[typeof font]["fontWeights"]
) => {
  const { fontFamily, fontWeights } = fonts[font] ?? fonts.poppins;

  const weight = fontWeight ? fontWeights[fontWeight] : null;

  if (!weight && fontWeight) {
    throw `fontWeight "${fontWeight} not found on font ${font}"`;
  }

  return {
    fontFamily,
    ...(!!weight && { fontWeight: weight }),
  };
};

export type { FontPoppins, FontPublicSans, FontProps, Fonts };
export { poppins, publicSans };
