import { getInitials, getNestedKey } from "@lierno/core-helpers";
import { getNpcSubtitle } from "@lierno/dnd-helpers";
import { Avatar, Box, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import { Container } from "components/Container/Container";
import { HTMLContainer } from "components/HTMLContainer/HTMLContainer";
import { Layout } from "components/Layout/Layout";
import { Metadata } from "components/Metadata/Metadata";
import { PaginatedTable } from "components/Table/PaginatedTable";
import serialize from "helpers/serializeJson";
import { useQueryState } from "hooks/useQueryState";
import { useRouter } from "next/router";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function FactionProfile({ faction }) {
  const [activeStep, setActiveStep] = useQueryState("step", 0, "number");
  const { query } = useRouter();

  const handleStepChange = (_, newValue) => setActiveStep(newValue);

  return (
    <Layout>
      <Metadata title={(faction?.name ?? "") + " | Lierno App"} description={faction?.description} />
      <Grid container spacing={2}>
        <Grid item laptop={12}>
          <Container noPadding>
            <Box component="div" sx={{ display: "flex", alignItems: "center", p: 3 }}>
              <Avatar src={faction?.image} fallBackText={getInitials(faction?.name ?? "")} size={45} />
              <Box component="div" sx={{ marginInline: 3 }}>
                <Typography variant="h2">
                  {faction?.name}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeStep}
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleStepChange}
                aria-label="basic tabs example"
              >
                <Tab label="Descripción" {...a11yProps(0)} />
                <Tab label="NPCs" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <Box
              component="div"
              role="tabpanel"
              hidden={activeStep !== 0}
              id={`simple-tabpanel-${0}`}
              aria-labelledby={`simple-tab-${0}`}
            >
              <HTMLContainer content={faction.description} sx={{ padding: "1em" }} />
            </Box>
            <Box
              component="div"
              role="tabpanel"
              hidden={activeStep !== 1}
              id={`simple-tabpanel-${1}`}
              aria-labelledby={`simple-tab-${1}`}
            >
              <PaginatedTable
                getRowData={(element) => ({
                  _id: getNestedKey("_id", element),
                  id: getNestedKey("id", element),
                  name: getNestedKey("name", element),
                  avatar: getNestedKey("avatar", element),
                  description: getNestedKey("personality", element),
                  subtitle: (
                    <Box mt={0.5} mb={1}>
                      {getNpcSubtitle({
                        flavor: { class: element.class },
                        stats: { race: element.race },
                      })}
                    </Box>
                  ),
                })}
                loading={false}
                fetchFrom={`/npcs/factions/${query.id}`}
                src={"/npcs/{ID}"}
                onEdit={(id) => Router.push(`/npcs/add/${id}`)}
                onDelete={(id) => handleOpenDeleteModal(`/npc/${id}`)}
                headerProps={{
                  onAdd: () => Router.push("/npcs/add"),
                }}
              />
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { connectToDB } = await import("lib/mongodb");
  const { default: Faction } = await import("models/faction");

  await connectToDB();

  const faction = serialize(await Faction.findById(query.id));

  return {
    props: {
      faction,
    },
  };
}
