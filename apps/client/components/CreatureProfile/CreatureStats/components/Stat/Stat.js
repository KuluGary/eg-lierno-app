import { getOperatorString } from "@lierno/core-helpers";
import { getModifier } from "@lierno/dnd-helpers";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Shield as ShieldIcon } from "components/icons/Shield";
import customizable_stats from "helpers/json/customizable_stats.json";
import { useState } from "react";
import style from "./Stat.style";
import StatModal from "./StatModal";

export default function StatComponent(props) {
  const { stat, label } = props;
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
      <StatModal {...props} stats={stats} checks={checks} show={openModal} onClose={() => setOpenModal(false)} />
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
