import { createTheme, Theme } from '@mui/material'
import { v4 as uuid } from 'uuid'

export type ExtendedTheme = Theme & { name: string; id: string }

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    // title: TypographyStyle;
    // subtitle: TypographyStyle;
    // para1: TypographyStyle;
    // inlinePara1: TypographyStyle;
    // hText: TypographyStyle;
  }

  // allow configuration using `createMuiTheme`
  interface TypographyOptions {
    // title?: TypographyStyleOptions;
    // subtitle?: TypographyStyleOptions;
    // para1?: TypographyStyleOptions;
    // inlinePara1?: TypographyStyleOptions;
    // hText: TypographyStyleOptions;
  }
}
const mainLightColor = 'rgba(0, 228, 156, 1)'

const mainDarkColor = 'rgba(0, 228, 156, 1)'

export const muiLightSiteTheme: ExtendedTheme = {
  // ...(responsiveFontSizes(
  ...createTheme({
    palette: {
      primary: {
        main: mainLightColor,
        // main: mainColor,
      },
      secondary: {
        main: '#f50057',
      },

      mode: 'light',
    },
    typography: {
      body1: {
        lineHeight: 1.5,
        fontSize: '1.2rem',
        fontWeight: 400,
        fontFamily: '"Open Sans"',
      },
      body2: {
        lineHeight: 1.5,
        fontFamily: '"Open Sans"',
      },
      h1: {
        fontWeight: 600,
        fontSize: '3rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainLightColor,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2.5rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainLightColor,
      },
      h3: {
        fontWeight: 600,
        fontSize: '2.1rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainLightColor,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.8rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainLightColor,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.44rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainLightColor,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainLightColor,
      },
      fontFamily: '"Open Sans"',
    },
  }),
  // { factor: 2 }
  // ) ?? {}),
  name: 'light',
  id: uuid(),
}

export const muiDarkSiteTheme: ExtendedTheme = {
  // ...(responsiveFontSizes(
  ...createTheme({
    palette: {
      primary: {
        main: mainDarkColor,
      },
      secondary: {
        main: '#f50057',
      },
      mode: 'dark',
      background: {
        paper: '#333',
        default: '#333',
      },
    },
    typography: {
      body1: {
        fontWeight: 400,
        lineHeight: 1.5,
        fontSize: '1.2rem',
        color: '#fff',
        fontFamily: '"Open Sans"',
      },
      body2: {
        lineHeight: 1.5,
        color: '#ccc',
        fontFamily: '"Open Sans"',
      },
      h1: {
        fontWeight: 700,
        fontSize: '3rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainDarkColor,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainDarkColor,
      },
      h3: {
        fontWeight: 700,
        fontSize: '2.1rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainDarkColor,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.8rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainDarkColor,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.44rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainDarkColor,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.75,
        fontFamily: '"Open Sans"',
        color: mainDarkColor,
      },
      fontFamily: '"Open Sans"',
    },
  }),
  // { factor: 2 }
  // ) ?? {}),
  name: 'dark',
  id: uuid(),
}
