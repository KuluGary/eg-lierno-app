import { createContext } from "react";

const ColorModeContext = createContext({
  changePrimaryColor: () => {},
  changeBackgroundColor: () => {},
  toggleColorMode: () => {},
});

export default ColorModeContext;
