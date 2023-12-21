import { defaultDarkModeOverride } from "@aws-amplify/ui";
import { createTheme } from "@aws-amplify/ui";

const theme = createTheme({
  name: 'theme',
  overrides: [defaultDarkModeOverride],
});

export default theme;