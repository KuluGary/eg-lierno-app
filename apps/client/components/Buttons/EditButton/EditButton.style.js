/**
 * @see {@link https://mui.com/system/the-sx-prop|MUI Docs}
 */
const style = {
  container: {
    margin: ".5em",
  },
  iconButton: {
    outline: (t) => `1px solid ${t.palette.primary.main}`,
    borderRadius: "8px",
    padding: ".25em",
    transition: (t) =>
      t.transitions.create(["border"], {
        easing: (t) => t.transitions.easing.sharp,
        duration: (t) => t.transitions.duration.leavingScreen,
      }),
    "&:hover": {
      outline: (t) => `2px solid ${t.palette.primary.main}`,
    },
  },
};

export default style;
