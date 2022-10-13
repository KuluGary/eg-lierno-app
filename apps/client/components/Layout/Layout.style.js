const style = {
  container: {
    display: "flex",
    alignItems: "stretch",
    height: "calc(100vh - 60px)",
  },
  mainContainer: {
    backgroundColor: (theme) => theme.palette.background.main,
    flexGrow: 1,
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: {
      mobile: "80px",
      tablet: 0,
    },
  },
  contentContainer: {
    backgroundColor: (theme) => theme.palette.background.dark,
    height: "100%",
    width: "97%",
    borderRadius: "12px 12px 0px 0px",
    p: "1em",
    overflow: "auto",
  },
};

export default style;
