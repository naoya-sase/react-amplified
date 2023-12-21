import { defaultDarkModeOverride } from "@aws-amplify/ui";
import { createTheme } from "@aws-amplify/ui";
import { ColorMode } from "@aws-amplify/ui-react";

const theme = createTheme({
  name: 'theme',
  overrides: [defaultDarkModeOverride],
});

export function getColorMode() {
  const elem = document.querySelector('[data-amplify-color-mode]');
  const colorMode = elem?.getAttribute('data-amplify-color-mode');
  return colorMode as ColorMode;
}

export default theme;