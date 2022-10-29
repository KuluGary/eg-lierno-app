const style = ({ theme, drawerWidth, open, isMainScreen, isIntersecting }) => ({
  mainScreen: {
    display: "flex",
    justifyContent: "space-between",
    color: "inherit",

    zIndex: theme.zIndex.drawer + 1,
    background: "transparent",
    WebkitBackdropFilter: "blur(20px)",
    backdropFilter: "blur(20px)",
    color: (t) => t.palette.background.contrastText,
  },
  default: {
    height: "60px",
    background: "none",
    backgroundColor: theme.palette.background.main,
    color: "text.primary",
    boxShadow: "none",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
  title: {
    fontSize: "1.45rem",
    fontFamily: "Lalezar",
    flexGrow: 1,
  },
  toolbar: {
    pr: "24px",
    display: "flex",
    justifyContent: "space-between",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  skipLink: {
    textDecoration: "underline",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: 0,
    transition: "width 150ms ease-in-out",

    "&:focus": {
      width: "100%",
      paddingInline: "1em",
    },
  },
});

export default style;
