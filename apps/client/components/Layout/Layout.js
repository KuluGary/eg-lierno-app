import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import style from "./Layout.style";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("components/NavBar/NavBar"));
const SecondaryNav = dynamic(() => import("components/SecondaryNav/SecondaryNav"));

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      <NavBar open={open} toggleDrawer={toggleDrawer} />

      <Box sx={style.container}>
        {/* Side navigation bar */}
        <SecondaryNav open={open} />

        {/* Content body */}
        <Box component="main" id="#main-content" sx={style.mainContainer}>
          <Box component="div" sx={[style.contentContainer, theme.mixins.noScrollbar]}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
}
