import { getStatBonus } from "@lierno/dnd-helpers";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Container } from "components/Container/Container";
import { useWidth } from "hooks/useWidth";
import dynamic from "next/dynamic";
import { useState } from "react";
import style from "./CreatureStats.style";
import CircularProgress from "@mui/material/CircularProgress";

const Ability = dynamic(() => import("./components/Ability/Ability"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4 }}>
      <CircularProgress />
    </Box>
  ),
});

const Proficiency = dynamic(() => import("./components/Proficiency/Proficiency"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4 }}>
      <CircularProgress />
    </Box>
  ),
});

const StatComponent = dynamic(() => import("./components/Stat/Stat"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4 }}>
      <CircularProgress />
    </Box>
  ),
});

export default function CreatureStats({ Header, data }) {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, newValue) => setTab(newValue);
  const width = useWidth();
  const theme = useTheme();

  return (
    <Box data-testid="creature-stats">
      <Container
        noPadding
        header={!!Header && <Header />}
        sx={{
          height: width.down("tablet") ? "100%" : "90vh",
          overflowY: width.down("tablet") ? "no-scroll" : "scroll",
          paddingBottom: width.down("tablet") ? "1em" : 0,
          ...theme.mixins.noScrollbar,
        }}
      >
        <Box data-testid="stats-container" component="div" sx={style.abilityScoresContainer}>
          {Object.keys(data.stats)?.map((key) => {
            const bonusKey = `stats.abilityScores.${key}`;
            const { total, base, bonusList } = getStatBonus(bonusKey, data.character, bonusKey);

            return (
              <StatComponent stat={total} label={key} key={key} bonusKey={bonusKey} base={base} bonusList={bonusList} />
            );
          })}
        </Box>

        <Divider />

        <Box data-testid="stats-proficiencies" component="div" sx={{ paddingInline: 3 }}>
          <Box component="ul" sx={style.proficiencyContainer}>
            {data.proficiencies
              ?.filter(({ title, content }) => !!title && !!content)
              .map((proficiency, index) => (
                <Proficiency key={index} {...proficiency} />
              ))}
          </Box>
        </Box>

        <Divider />

        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="Pestañas de Habilidades"
          variant="scrollable"
          scrollButtons="auto"
        >
          {data.abilities
            ?.filter(({ content }) => content?.length > 0 || Object.keys(content ?? {})?.length > 0)
            .map(({ title }, index) => (
              <Tab key={index} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} label={title} />
            ))}
        </Tabs>

        <Divider />

        <Box component="div">
          {data.abilities
            ?.filter(({ content }) => content?.length > 0 || Object.keys(content ?? {})?.length > 0)
            .map((ability, index) => (
              <Ability show={tab === index} key={index} index={index} {...ability} {...data} />
            ))}
        </Box>
      </Container>
    </Box>
  );
}
