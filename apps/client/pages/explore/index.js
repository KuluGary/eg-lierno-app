import { getNestedKey } from "@lierno/core-helpers";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import Container from "components/Container/Container";
import Layout from "components/Layout/Layout";

import Metadata from "components/Metadata/Metadata";
import ItemSubtitle from "components/Subtitle/ItemSubtitle/ItemSubtitle";
import SpellSubtitle from "components/Subtitle/SpellSubtitle/SpellSubtitle";
import { Table } from "components/Table/Table";
import references from "helpers/json/references.json";
import { SPELL_ICON_DICTIONARY } from "helpers/string-util";
import useExploreData from "hooks/useExploreData";
import { useQueryState } from "hooks/useQueryState";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

export default function ExplorePage() {
  const { items, spells, classes } = useExploreData();
  const [tabValue, setTabValue] = useQueryState("category", 0, "number");
  const [itemTabValue, setItemTabValue] = useQueryState("item", 0, "number");
  const [classTabValue, setClassTabValue] = useQueryState("class", 0, "number");
  const [spellTabValue, setSpellTabValue] = useQueryState("spell", 0, "number");
  const [referenceTabValue, setReferenceTabValue] = useQueryState("reference", 0, "number");
  const itemLabels = {
    armor: "Armadura",
    items: "Objetos",
    weapons: "Armas",
    vehicles: "Vehículos",
    magicItems: "Objetos mágicos",
    magicWeapons: "Armas mágicas",
    magicArmor: "Armadura mágica",
  };
  const referenceLabels = {
    action: "Acciones",
    bonus_action: "Acciones adicionales",
    condition: "Condiciones",
    environment: "Ambientales",
    rest: "Descanso",
    movement: "Movimiento",
    optional: "Opcionales",
    reaction: "Reacciones",
  };

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleItemTabValue = (_, newValue) => setItemTabValue(newValue);

  const handleClassTabValue = (_, newValue) => setClassTabValue(newValue);

  const handleSpellTabValue = (_, newValue) => setSpellTabValue(newValue);

  const handleReferenceTabValue = (_, newValue) => setReferenceTabValue(newValue);

  return (
    <Layout>
      <Metadata title={"Explorar | Lierno App"} description={"Explora información sobre D&D."} />
      <Container noPadding>
        <Tabs variant="scrollable" value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab id="explore-tabpanel-0" aria-controls="explore-tabpanel-0" label="Objetos" />
          <Tab id="explore-tabpanel-1" aria-controls="explore-tabpanel-1" label="Clases" />
          <Tab id="explore-tabpanel-1" aria-controls="explore-tabpanel-2" label="Hechizos" />
          <Tab id="explore-tabpanel-2" aria-controls="explore-tabpanel-3" label="Referencia rápida" />
        </Tabs>
        <Divider />
        <TabPanel value={tabValue} index={0}>
          <Tabs variant="scrollable" value={itemTabValue} onChange={handleItemTabValue} aria-label="item tabs">
            {Object.keys(items).map((key, index) => (
              <Tab
                key={key}
                id={`item-tabpanel-${index}`}
                aria-controls={`item-tabpanel-${index}`}
                label={itemLabels[key]}
              />
            ))}
          </Tabs>
          <Divider />
          {Object.keys(items).map((key, index) => (
            <TabPanel key={key} value={itemTabValue} index={index}>
              <Table
                getRowData={(element) => ({
                  _id: getNestedKey("_id", element),
                  name: getNestedKey("name", element),
                  description: getNestedKey("description", element),
                  avatar: getNestedKey("image.small", element),
                  subtitle: (
                    <Box mt={0.5} mb={1}>
                      <ItemSubtitle item={element} />
                    </Box>
                  ),
                })}
                src={"/item/{ID}"}
                data={items[key]}
              />
            </TabPanel>
          ))}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Tabs variant="scrollable" value={classTabValue} onChange={handleClassTabValue} aria-label="item tabs">
            {Object.keys(classes).map((key, index) => (
              <Tab key={key} id={`item-tabpanel-${index}`} aria-controls={`item-tabpanel-${index}`} label={key} />
            ))}
          </Tabs>
          <Divider />
          {Object.keys(classes).map((key, index) => (
            <TabPanel key={key} value={classTabValue} index={index}>
              <Table
                getRowData={(element) => ({
                  _id: getNestedKey("_id", element),
                  name: getNestedKey("name", element),
                  description: getNestedKey("description", element),
                  avatar: getNestedKey("icon", element),
                })}
                src={"/class/{ID}"}
                data={classes[key]}
              />
            </TabPanel>
          ))}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Tabs variant="scrollable" value={spellTabValue} onChange={handleSpellTabValue} aria-label="spell tabs">
            {Object.keys(spells).map((key, index) => (
              <Tab
                key={key}
                id={`spell-tabpanel-${index}`}
                aria-controls={`spell-tabpanel-${index}`}
                label={key === "0" ? "Trucos" : `Nivel ${key}`}
              />
            ))}
          </Tabs>
          <Divider />
          {Object.keys(spells).map((key, index) => (
            <TabPanel key={key} value={spellTabValue} index={index}>
              <Table
                getRowData={(element) => ({
                  _id: getNestedKey("_id", element),
                  name: getNestedKey("name", element),
                  description: getNestedKey("stats.description", element),
                  avatar: `${SPELL_ICON_DICTIONARY[element.stats.school]}`,
                  subtitle: (
                    <Box mt={0.5} mb={1}>
                      <SpellSubtitle spell={element} />
                    </Box>
                  ),
                })}
                src={"/spell/{ID}"}
                data={spells[key]}
              />
            </TabPanel>
          ))}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Tabs
            variant="scrollable"
            value={referenceTabValue}
            onChange={handleReferenceTabValue}
            aria-label="reference tabs"
          >
            {Object.keys(references).map((key, index) => (
              <Tab
                key={key}
                id={`reference-tabpanel-${index}`}
                aria-controls={`reference-tabpanel-${index}`}
                label={referenceLabels[key]}
              />
            ))}
          </Tabs>
          <Divider />
          {Object.keys(references).map((key, index) => (
            <TabPanel key={key} value={referenceTabValue} index={index}>
              <Table
                getRowData={(element) => ({
                  _id: getNestedKey("title", element),
                  name: getNestedKey("title", element),
                  subtitle: (
                    <Box mt={0.5} mb={1}>
                      {getNestedKey("subtitle", element)}
                    </Box>
                  ),
                  description: getNestedKey("description", element),
                })}
                src={"/reference/{ID}"}
                data={references[key]}
              />
            </TabPanel>
          ))}
        </TabPanel>
      </Container>
    </Layout>
  );
}