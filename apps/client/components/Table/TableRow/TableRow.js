import { TableCell, TableRow as MuiTableRow, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { HTMLContainer, Link, Avatar } from "../..";
import { convert as convertHtmlToString } from "html-to-text";
import { useWidth } from "hooks/useWidth";
import style from "./TableRow.style";

function TableRow({ data, src }) {
  const theme = useTheme();
  const width = useWidth();
  const { _id, id, description, avatar, name, subtitle, count } = data;
  const parsedSrc = !!src ? src?.replace("{ID}", id ?? _id) : "#";

  const parseDescription = (description) => {
    const maxWords = width.down("tablet") ? 25 : 75;
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
            <Typography variant="subtitle1" sx={style.tableCellTitle}>
              {name}
            </Typography>
          </Link>
          {!!subtitle && (
            <Typography variant="subtitle2" sx={style.tableCellSubtitle}>
              {subtitle}
            </Typography>
          )}
          {description && <Box component="div">{parseDescription(description)}</Box>}
        </Box>
      </TableCell>
    </MuiTableRow>
  );
}

export { TableRow };
