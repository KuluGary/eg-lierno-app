const style = {
  tableCell: {
    p: "1.5em",
    display: "flex",
    alignItems: "center",
    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
  },
  tableCellContent: {
    pl: "1em",
  },
  tableCellTitle: {
    fontWeight: 500,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  tableCellSubtitle: {
    opacity: 0.75,
    fontWeight: 500,
    fontStyle: "italic",
  },
};

export default style;
