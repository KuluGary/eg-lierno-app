import { setNestedKey } from "@lierno/core-helpers";
import { Box, Button, Container as MuiContainer, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Abilities } from "components/CreatureCreation/Abilities";
import { Details } from "components/CampaignCreation/Details";
import { Equipment } from "components/CreatureCreation/Equipment";
import { Proficiencies } from "components/CreatureCreation/Proficiencies";
import { Stats } from "components/CreatureCreation/Stats";
import { Backpack as BackpackIcon } from "components/icons/Backpack";
import { Character as CharacterIcon } from "components/icons/Character";
import { Juggler as JugglerIcon } from "components/icons/Juggler";
import { MuscleUp as MuscleUpIcon } from "components/icons/MuscleUp";
import { SpellBolt as SpellBoltIcon } from "components/icons/SpellBolt";
import Api from "services/api";
import creature_template from "helpers/json/creature_template.json";
import { getToken } from "next-auth/jwt";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "components/Layout/Layout";

import Container from "components/Container/Container";

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

export default function AddMonster({ monster, spells, classes, items }) {
  const theme = useTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const commoner = creature_template;
  const [creature, setCreature] = useState({ ...(monster ?? commoner) });
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
    const newCreature = { ...creature };

    if (!!router.query.campaign) {
      const hasCampaign = (newCreature.flavor.campaign ?? []).find(
        ({ campaignId }) => router.query.campaign === campaignId
      );

      if (!hasCampaign) {
        newCreature.flavor.campaign = [
          ...(newCreature.flavor.campaign ?? []),
          { campaignId: router.query.campaign, unlocked: true },
        ];
      }
    }

    if (!!newCreature._id) {
      Api.fetchInternal("/monsters/" + newCreature._id, {
        method: "PUT",
        body: JSON.stringify(newCreature),
      }).then(() => router.back());
    } else {
      Api.fetchInternal("/monsters", {
        method: "POST",
        body: JSON.stringify(newCreature),
      }).then(() => router.back());
    }
  };

  return (
    <Layout>
      <Head>
        <title>Lierno App | Crear Monstruo</title>
      </Head>
      <Container noPadding sx={{ maxWidth: "75%", margin: "0 auto" }}>
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
  const { req, query } = context;
  const secret = process.env.SECRET;

  const token = await getToken({ req, secret, raw: true }).catch((e) => console.error(e));

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: true,
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  let monster = null;
  let spells = null;

  if (!!query?.id && query?.id?.length > 0) {
    monster = await Api.fetchInternal("/monsters/" + query.id[0], {
      headers,
    }).catch(() => null);

    if (monster?.stats.spells?.length > 0) {
      const spellIds = [];

      monster.stats.spells.forEach(({ spells }) => {
        spellIds.push(
          ...Object.values(spells)
            .flat()
            .map(({ spellId }) => spellId)
        );
      });

      spells = await Api.fetchInternal(`/spells?id=${JSON.stringify(spellIds)}`, {
        headers,
      });
    }
  }

  const items = await Api.fetchInternal("/items", {
    headers,
  }).catch(() => null);

  const classes = await Api.fetchInternal("/classes/", {
    headers,
  }).catch(() => null);

  return {
    props: {
      monster,
      items,
      classes,
    },
  };
}
