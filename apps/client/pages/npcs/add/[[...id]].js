import { setNestedKey } from "@lierno/core-helpers";
import { Box, Button, Container as MuiContainer, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Container, Layout } from "components";
import { Abilities, Details, Equipment, Proficiencies, Stats } from "components/CreatureCreation";
import {
  Backpack as BackpackIcon,
  Character as CharacterIcon,
  Juggler as JugglerIcon,
  MuscleUp as MuscleUpIcon,
  SpellBolt as SpellBoltIcon,
} from "components/icons";
import Api from "services/api";
import creature_template from "helpers/json/creature_template.json";
import { getToken } from "next-auth/jwt";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useCreatureData from "hooks/useCreatureData";
import serialize from "helpers/serializeJson";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabs = [
  { label: "Detalles", Icon: CharacterIcon, Component: Details },
  { label: "Estadísticas", Icon: MuscleUpIcon, Component: Stats },
  { label: "Proficiencias", Icon: JugglerIcon, Component: Proficiencies },
  { label: "Habilidades", Icon: SpellBoltIcon, Component: Abilities },
  { label: "Equipamiento", Icon: BackpackIcon, Component: Equipment },
];

export default function AddNpc({
  npc,
  // spells,
  // classes,
  // items
}) {
  const theme = useTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const commoner = creature_template;
  const [creature, setCreature] = useState({ ...(npc ?? commoner) });
  const { spells, items, classes } = useCreatureData(npc, "npc");
  const colors = {
    active: theme.palette.primary.main,
    inactive: theme.palette.action.active,
  };

  const handleStepChange = (_, newValue) => {
    setActiveStep(newValue);
  };

  const handleCreatureChange = (key, value) => {
    setCreature({ ...setNestedKey(key, creature, value) });
  };

  const handleSubmit = () => {
    if (!!creature._id) {
      Api.fetchInternal("/npcs/" + creature._id, {
        method: "PUT",
        body: JSON.stringify(creature),
      }).then(() => router.back());
    } else {
      Api.fetchInternal("/npcs", {
        method: "POST",
        body: JSON.stringify(creature),
      }).then(() => router.back());
    }
  };

  return (
    <Layout>
      <Head>
        <title>Lierno App | Crear NPC</title>
      </Head>
      <Container noPadding sx={{ width: { laptop: "65vw", tablet: "90%" }, margin: "0 auto" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeStep}
              variant="scrollable"
              scrollButtons="auto"
              onChange={handleStepChange}
              aria-label="basic tabs example"
            >
              {tabs.map(({ label, Icon }, index) => (
                <Tab
                  key={index}
                  label={label}
                  icon={<Icon color={activeStep === index ? colors.active : colors.inactive} size={28} />}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>
          <MuiContainer maxWidth="xs" sx={{ width: "75%" }}>
            {tabs.map(({ Component }, index) => (
              <TabPanel key={index} value={activeStep} index={index}>
                <Component
                  creature={creature}
                  setCreature={handleCreatureChange}
                  spells={spells}
                  items={items}
                  classes={classes}
                />
              </TabPanel>
            ))}
            <Box sx={{ m: 3, float: "right" }}>
              <Button sx={{ marginInline: 1 }}>Cancelar</Button>
              <Button sx={{ marginInline: 1 }} variant="outlined" onClick={handleSubmit}>
                Guardar
              </Button>
            </Box>
          </MuiContainer>
        </Box>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { connectToDB } = await import("lib/mongodb");
  const { default: Npc } = await import("/models/npc");

  await connectToDB();

  const npc = serialize(await Npc.findById(query.id));

  return {
    props: {
      npc,
    },
  };
}
