import { getOperatorString } from "@lierno/core-helpers";
import { getModifier } from "@lierno/dnd-helpers";
import { Box, Divider, Table, TableBody, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { HTMLContainer } from "components/HTMLContainer/HTMLContainer";
import { Shield as ShieldIcon } from "components/icons/Shield";
import { FullScreenModal } from "components/Modal/FullScreenModal";
import customizable_stats from "helpers/json/customizable_stats.json";
import { convert as convertHtmlToString } from "html-to-text";
import { useState } from "react";
import style from "./Stat.style";

export default function StatComponent({ stat, label, bonusList, base }) {
  const { stats, checks } = customizable_stats;
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const statLabels = {
    strength: "FUE",
    dexterity: "DES",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "SAB",
    charisma: "CAR",
  };

  return (
    <>
      <FullScreenModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        containerStyles={theme.mixins.noScrollbar}
      >
        <Box style={style.modalContentContainer}>
          <Typography id="modal-modal-title" variant="h4" sx={style.modalTitle}>
            {`${stats[label]?.name} ${stat}`}
          </Typography>
          <Typography variant="subtitle2" sx={style.modalSubtitle}>
            {` (${getOperatorString(getModifier(stat))})`}
          </Typography>
        </Box>
        <Box>
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
          <Box style={style.labelDescriptionContainer}>
            <HTMLContainer content={checks[label]?.description} />
          </Box>
        </Box>
      </FullScreenModal>

      <Box data-testid={`${label}-stat`} component="div" onClick={() => setOpenModal(true)} sx={style.statContainer}>
        <Box component="div" sx={style.abilityScoreContainer}>
          <Box component="div" sx={style.abilityScoreLabelContainer}>
            <Typography data-testid={`${label}-title`} variant="caption" sx={style.abilityScoreLabel}>
              {statLabels[label]}
            </Typography>
          </Box>
          <Divider />
          <Typography data-testid={`${label}-modifier`} variant="h3" component="p" sx={style.abilityScoreValue}>
            {getOperatorString(getModifier(stat))}
          </Typography>
        </Box>
        <ShieldIcon width={35} height={40} color={theme.palette.background.main} sx={style.shieldIcon} />
        <Typography variant="button" component="span" data-testid={`${label}-score`} style={style.abilityModifier}>
          {stat}
        </Typography>
      </Box>
    </>
  );
}
