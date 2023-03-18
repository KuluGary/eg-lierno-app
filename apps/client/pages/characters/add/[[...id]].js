import { setNestedKey } from "@lierno/core-helpers";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiContainer from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import Container from "components/Container/Container";
import { AlienStare as AlienStareIcon } from "components/icons/AlienStare";
import { Backpack as BackpackIcon } from "components/icons/Backpack";
import { Barbute as BarbuteIcon } from "components/icons/Barbute";
import { Character as CharacterIcon } from "components/icons/Character";
import { Juggler as JugglerIcon } from "components/icons/Juggler";
import { MuscleUp as MuscleUpIcon } from "components/icons/MuscleUp";
import { SpellBolt as SpellBoltIcon } from "components/icons/SpellBolt";
import { SwordShield as SwordShieldIcon } from "components/icons/SwordShield";
import Layout from "components/Layout/Layout";
import dynamic from "next/dynamic";

import character_template from "helpers/json/character_template.json";
import useCreatureData from "hooks/useCreatureData";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Api from "services/api";

const Abilities = dynamic(() => import("components/CreatureCreation/Abilities"));
const Background = dynamic(() => import("components/CreatureCreation/Background"));
const Class = dynamic(() => import("components/CreatureCreation/Class"));
const Details = dynamic(() => import("components/CreatureCreation/Details"));
const Equipment = dynamic(() => import("components/CreatureCreation/Equipment"));
const Proficiencies = dynamic(() => import("components/CreatureCreation/Proficiencies"));
const Race = dynamic(() => import("components/CreatureCreation/Race"));
const Stats = dynamic(() => import("components/CreatureCreation/Stats"));

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
  { label: "Raza", Icon: AlienStareIcon, Component: Race },
  { label: "Clase", Icon: SwordShieldIcon, Component: Class },
  { label: "Estadísticas", Icon: MuscleUpIcon, Component: Stats },
  { label: "Trasfondo", Icon: BarbuteIcon, Component: Background },
  { label: "Proficiencias", Icon: JugglerIcon, Component: Proficiencies },
  { label: "Habilidades", Icon: SpellBoltIcon, Component: Abilities },
  { label: "Equipamiento", Icon: BackpackIcon, Component: Equipment },
];

export default function AddCharacter({ character = null }) {
  const theme = useTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { commoner } = character_template;
  const [creature, setCreature] = useState({ ...(character ?? commoner) });
  const { spells, items, classes } = useCreatureData(creature, "character");
  const colors = {
    active: theme.palette.primary.main,
    inactive: theme.palette.action.active,
  };
  const session = useSession();

  useEffect(() => {
    if (session.status === "loading") return;

    if (session.status === "unauthenticated") {
      router.push("/");
    }

    if (router.query.id) {
      Api.fetchInternal(`/characters/${router.query.id}`)
        .then((character) => {
          if (session.data.userId === character.createdBy) {
            setCreature(character);
          }
        })
        .catch(() => null);
    }
  }, [router.query.id, session]);

  const handleStepChange = (_, newValue) => {
    setActiveStep(newValue);
  };

  const handleCreatureChange = (key, value) => {
    setCreature({ ...setNestedKey(key, creature, value) });
  };

  const handleSubmit = () => {
    if (!!creature._id) {
      Api.fetchInternal("/characters/" + creature._id, {
        method: "PUT",
        body: JSON.stringify(creature),
      }).then(() => router.back());
    } else {
      Api.fetchInternal("/characters", {
        method: "POST",
        body: JSON.stringify(creature),
      }).then(() => router.back());
    }
  };

  return (
    <Layout>
      <Head>
        <title>Lierno App | Crear personaje</title>
      </Head>
      <Container noPadding sx={{ maxWidth: "75%", margin: "0 auto" }}>
        {creature && (
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeStep}
                variant="scrollable"
                scrollButtons={"auto"}
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
                    classes={classes}
                    spells={spells}
                    items={items}
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
        )}
      </Container>
    </Layout>
  );
}
