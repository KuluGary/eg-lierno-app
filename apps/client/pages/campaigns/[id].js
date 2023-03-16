import { Box, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import { CampaignCreatures } from "components/CampaignProfile/CampaignCreatures";
import { CampaignDetails } from "components/CampaignProfile/CampaignDetails/CampaignDetails";
import { CampaignDiary } from "components/CampaignProfile/CampaignDiary";
import { CampaignFactions } from "components/CampaignProfile/CampaignFactions";
import { CampaignLogs } from "components/CampaignProfile/CampaignLogs";
import { CampaignMap } from "components/CampaignProfile/CampaignMap";
import Container from "components/Container/Container";
import Layout from "components/Layout/Layout";

import Metadata from "components/Metadata/Metadata";
import serialize from "helpers/serializeJson";
import useCampaignData from "hooks/useCampaignData";
import { useQueryState } from "hooks/useQueryState";

const tabs = [
  { label: "Detalles", Component: CampaignDetails },
  { label: "Diario", Component: CampaignDiary },
  { label: "Criaturas", Component: CampaignCreatures },
  { label: "Facciones", Component: CampaignFactions },
  { label: "Mapa", Component: CampaignMap },
  { label: "Historial", Component: CampaignLogs },
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (value !== index) return null;

  return (
    <Grid
      item
      container
      spacing={2}
      laptop={12}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </Grid>
  );
}

export default function CampaignProfile({ campaign }) {
  const [activeStep, setActiveStep] = useQueryState("step", 0, "number");
  const { players, dm, characters } = useCampaignData(campaign);

  const handleStepChange = (_, newValue) => {
    setActiveStep(newValue);
  };

  return (
    <Layout>
      <Metadata title={(campaign?.name ?? "") + " | Lierno App"} description={campaign?.flavor.synopsis} />
      <Grid container spacing={2}>
        <Grid item laptop={12}>
          <Container noPadding>
            <Box component="div" sx={{ p: 3 }}>
              <Typography variant="h3">{campaign?.name}</Typography>
              <Typography component="subtitle">{campaign?.flavor?.game}</Typography>
            </Box>
            <Divider />
            <Tabs
              value={activeStep}
              variant="scrollable"
              scrollButtons={"auto"}
              onChange={handleStepChange}
              aria-label="basic tabs example"
            >
              {tabs.map(({ label }, index) => (
                <Tab key={index} label={label} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Container>
        </Grid>
        {tabs.map(({ Component }, index) => (
          <TabPanel key={index} value={activeStep} index={index}>
            <Component campaign={campaign} players={players} dm={dm} characters={characters} />
          </TabPanel>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { connectToDB } = await import("lib/mongodb");
  const { default: Campaign } = await import("models/campaign");

  await connectToDB();

  const campaign = serialize(await Campaign.findById(query.id));

  return {
    props: {
      campaign,
    },
  };
}
