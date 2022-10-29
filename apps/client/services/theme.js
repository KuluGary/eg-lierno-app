const background = [
  { type: "light", color: "hsl(0, 0%, 100%)" },
  { type: "dark", color: "hsl(229, 20%, 20%)" },
  { type: "dark", color: "hsl(229, 27%, 8%)" },
];

const primary = [
  "hsl(204, 88%, 53%)",
  "hsl(50, 100%, 50%)",
  "hsl(332, 95%, 54%)",
  "hsl(252, 100%, 67%)",
  "hsl(29, 100%, 50%)",
  "hsl(160, 100%, 36%)",
];

const initialTheme = {
  palette: {
    primary: { main: primary[0] },
    secondary: { main: primary[0] },
    background: { main: background[0] },
  },
  shape: { borderRadius: 12 },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
  mixins: {
    noScrollbar: {
      "&::-webkit-scrollbar": {
        display: "none",
      },
      msOverflowStyle: "none" /* IE and Edge */,
      scrollbarWidth: "none",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.background.main,
        }),
      },
    },
  },
  typography: {
    htmlFontSize: 16,
    fontSize: 14,
    h1: { fontSize: "2.4em", fontFamily: "Lalezar" },
    h2: { fontSize: "1.464em" },
    h3: { fontSize: "1.331em" },
    h4: { fontSize: "1.21em" },
    h5: { fontSize: "1.1em" },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.909em" },
  },
};

export { initialTheme, background, primary };
