import { useTheme } from "@emotion/react";
import { getOperatorString } from "@lierno/core-helpers";
import { getModifier } from "@lierno/dnd-helpers";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import HTMLContainer from "components/HTMLContainer/HTMLContainer";
import { FullScreenModal } from "components/Modal/FullScreenModal";
import { convert as convertHtmlToString } from "html-to-text";
import style from "./Stat.style";

const StatModal = ({ stat, stats, base, bonusList, label, checks, show, onClose, descriptionOnly = false }) => {
  const theme = useTheme();

  return (
    <FullScreenModal
      open={show}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      containerStyles={theme.mixins.noScrollbar}
    >
      {!descriptionOnly && <StatModalTable stat={stat} base={base} bonusList={bonusList} />}

      <Box style={style.modalContentContainer}>
        <Typography id="modal-modal-title" variant="h4" sx={style.modalTitle}>
          {`${stats[label]?.name} ${stat ?? ""}`}
        </Typography>
        {!descriptionOnly && (
          <Typography variant="subtitle2" sx={style.modalSubtitle}>
            {` (${getOperatorString(getModifier(stat))})`}
          </Typography>
        )}
      </Box>
      <Box>
        <Box style={style.labelDescriptionContainer}>
          <HTMLContainer content={checks[label]?.description} />
        </Box>
      </Box>
    </FullScreenModal>
  );
};

const StatModalTable = ({ stat, base, bonusList }) => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell sx={style.tableCell}>Modificador base</TableCell>
        <TableCell sx={style.tableCell}>{base}</TableCell>
      </TableRow>
      {bonusList.map(({ descriptions, bonus }, i) => (
        <TableRow key={i}>
          <TableCell sx={style.tableCell}>{convertHtmlToString(descriptions)}</TableCell>
          <TableCell sx={style.tableCell}>{getOperatorString(bonus)}</TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell sx={style.tableCell}>{"Total"}</TableCell>
        <TableCell sx={[style.tableCell, { fontWeight: "bold" }]}>{stat}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default StatModal;
