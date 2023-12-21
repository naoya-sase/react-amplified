import { defaultDarkModeOverride } from "@aws-amplify/ui";
import { createTheme as aCreateTheme } from "@aws-amplify/ui";
import { ColorMode } from "@aws-amplify/ui-react";
import { createTheme as muiCreateTheme } from "@mui/material";

const theme = aCreateTheme({
  name: 'theme',
  overrides: [defaultDarkModeOverride],
});

export function getColorMode() {
  const elem = document.querySelector('[data-amplify-color-mode]');
  const colorMode = elem?.getAttribute('data-amplify-color-mode');
  return colorMode as ColorMode;
}

export const muiDarkTheme = muiCreateTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1a26',
      paper: '#0d1a26',
    },
  }
});

export const muiLightTheme = muiCreateTheme({
  palette: {
    mode: 'light',
  }
});

export default theme;