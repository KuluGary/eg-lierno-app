import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { Avatar } from "components/Avatar/Avatar";
import { Link } from "components/Link/Link";
import { useWidth } from "hooks/useWidth";
import { convert as convertHtmlToString } from "html-to-text";
import style from "./TableRow.style";

function TableRow({ data, src }) {
  const width = useWidth();
  const { _id, id, description, avatar, name, subtitle, count } = data;
  const parsedSrc = !!src ? src?.replace("{ID}", id ?? _id) : "#";

  const parseDescription = (description) => {
    const maxWords = 75;
    const descriptionArray = convertHtmlToString(description, {
      selectors: [{ selector: "a", options: { ignoreHref: true } }],
    }).split(" ");

    if (descriptionArray.length < maxWords) return descriptionArray.join(" ");

    return descriptionArray.slice(0, maxWords).join(" ") + "...";
  };

  return (
    <MuiTableRow hover key={_id}>
      <TableCell sx={style.tableCell}>
        {!!avatar && <Avatar src={avatar} size={56} count={count} />}
        <Box component="div" sx={style.tableCellContent}>
          <Link href={parsedSrc}>
            <Typography variant="h4" sx={style.tableCellTitle}>
              {name}
            </Typography>
          </Link>
          {!!subtitle && (
            <Typography variant="subtitle2" sx={style.tableCellSubtitle}>
              {subtitle}
            </Typography>
          )}
          {description && width.up("tablet") && <Box component="div">{parseDescription(description)}</Box>}
        </Box>
      </TableCell>
    </MuiTableRow>
  );
}

export { TableRow };
