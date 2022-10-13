import { CacheProvider } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, darken, ThemeProvider } from "@mui/material/styles";
import { SessionProvider as AuthProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import * as React from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createEmotionCache from "../helpers/createEmotionCache";
import ColorModeContext from "../services/color-context";
import { background as backgroundList, initialTheme, primary as primaryList } from "../services/theme";
import "../styles/globals.css";

const ProgressBar = dynamic(() => import("components/ProgressBar"), {
  ssr: false,
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState(prefersDarkMode ? "dark" : "light");
  const [theme, setTheme] = useState(createTheme({ ...initialTheme }));

  React.useEffect(() => {
    if (typeof window !== undefined) {
      colorMode.setDefaultTheme();
    }
  }, []);

  const colorMode = React.useMemo(
    () => ({
      changePrimaryColor: (main) => {
        const newTheme = createTheme({
          ...theme,
          palette: { ...theme.palette, primary: { main } },
          components: { ...initialTheme.components },
        });

        setTheme(newTheme);
        localStorage.setItem("primary", JSON.stringify({ main }));
        document.documentElement.style.setProperty("--primary-color", newTheme.palette.primary.main);
      },
      changeBackgroundColor: (background, mode) => {
        const newTheme = createTheme({
          ...theme,
          palette: {
            mode,
            primary: { ...theme.palette.primary },
            background: {
              ...theme.palette.augmentColor({ color: { main: background } }),
            },
          },
          components: { ...initialTheme.components },
        });

        setTheme(newTheme);
        localStorage.setItem("background", JSON.stringify({ background, mode }));
      },
      setDefaultTheme: () => {
        const backgroundStr = localStorage.getItem("background") ?? `${{ background: backgroundList[0], mode }}`;
        const primaryStr = localStorage.getItem("primary") ?? `${{ main: primaryList[0] }}`;

        const { background, mode } = JSON.parse(backgroundStr);
        const primary = JSON.parse(primaryStr);

        const newTheme = createTheme({
          ...theme,
          palette: {
            mode,
            primary,
            background: { ...theme.palette.augmentColor({ color: { main: background } }) },
          },
          components: { ...initialTheme.components },
        });

        setTheme(newTheme);
        document.documentElement.style.setProperty("--primary-color", newTheme.palette.primary.main);
      },
    }),
    [theme]
  );

  React.useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", theme.palette.primary.main);
  }, [theme]);

  return (
    <AuthProvider options={{ clientMaxAge: 0, keepAlive: 0 }} session={pageProps.session}>
      <ToastContainer
        closeOnClick
        draggable
        position="top-right"
        autoClose={5000}
        theme={prefersDarkMode ? "dark" : "light"}
      />
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Lierno App</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <CssBaseline />
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <ProgressBar />
            <Component {...pageProps} />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </CacheProvider>
    </AuthProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
