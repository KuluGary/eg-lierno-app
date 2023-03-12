import { getOperatorString, isArrayNotEmpty } from "@lierno/core-helpers";
import {
  getAbilitiesString,
  getAttackStrings,
  getCharacterSubtitle,
  getInitiativeBonus,
  getModifier,
  getPassiveInvestigation,
  getPassivePerception,
  getProficiencyBonus,
  getSavingThrowString,
  getSpeedString,
  getStatBonus,
} from "@lierno/dnd-helpers";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CreatureMenu } from "components/CreatureMenu/CreatureMenu";
import { CreatureFlavor } from "components/CreatureProfile/CreatureFlavor/CreatureFlavor";
import HitPoints from "components/CreatureProfile/CreatureStats/components/HitPoints/HitPoints";
import { CreatureStats } from "components/CreatureProfile/CreatureStats/CreatureStats";
import { Layout } from "components/Layout/Layout";
import { Metadata } from "components/Metadata/Metadata";
import download from "downloadjs";
import serialize from "helpers/serializeJson";
import useCreatureData from "hooks/useCreatureData";
import { useWidth } from "hooks/useWidth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import Api from "services/api";

export default function CharacterProfile({ character }) {
  const { data: session } = useSession();
  const theme = useTheme();
  const width = useWidth();
  const [currentCharacter, setCurrentCharacter] = useState(character);
  const { spells, items, tier, classes } = useCreatureData(character, "character");

  const downloadPdf = () => {
    Api.fetchInternal("/characters/sheet/pdf/" + currentCharacter["_id"])
      .then((base64Url) => download(base64Url, `${currentCharacter["name"]}.pdf`, "application/pdf"))
      .catch((err) => toast.error(err));
  };

  const modifyHitPoints = (key, amount) => {
    const newChar = { ...currentCharacter };

    newChar.stats.hitPoints[key] = amount;

    Api.fetchInternal("/characters/" + newChar._id, {
      method: "PUT",
      body: JSON.stringify(newChar),
    }).then(() => setCurrentCharacter(newChar));
  };

  return (
    <Layout>
      <Metadata
        title={(currentCharacter?.name ?? "") + " | Lierno App"}
        image={currentCharacter?.flavor.portrait?.avatar}
        description={currentCharacter?.flavor.personality}
      />
      <Grid container spacing={1} sx={{ height: "100%" }}>
        <Grid item laptop={6} mobile={12}>
          <CreatureFlavor
            containerStyle={{
              height: width.down("tablet") ? "100%" : "90vh",
              overflowY: width.down("tablet") ? "no-scroll" : "scroll",
              ...theme.mixins.noScrollbar,
            }}
            data={{
              id: currentCharacter._id,
              sections: [
                {
                  title: "Personalidad",
                  content: currentCharacter?.flavor.personality,
                },
                { title: "Apariencia", content: currentCharacter?.flavor.appearance },
                { title: "Historia", content: currentCharacter?.flavor.backstory },
              ],
              image: currentCharacter?.flavor.portrait?.original,
              tier,
              type: "character",
            }}
            Header={() => (
              <Box
                data-testid="creature-header"
                component="main"
                sx={{
                  display: "flex",
                  gap: "1em",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: "1em 1.2em",
                }}
              >
                <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ textAlign: width.down("tablet") ? "center" : "left" }}>
                    <Typography variant="h3">{character?.name}</Typography>
                    <Typography variant="subtitle1">{getCharacterSubtitle(currentCharacter)}</Typography>
                  </Box>
                </Box>
                {!!session && session?.userId === currentCharacter.createdBy && (
                  <CreatureMenu creature={currentCharacter} type="character" downloadPdf={downloadPdf} />
                )}
              </Box>
            )}
          />
        </Grid>
        <Grid item laptop={6} mobile={12} sx={{ paddingBottom: width.down("tablet") ? "1em" : 0 }}>
          <CreatureStats
            containerStyle={{
              height: width.down("tablet") ? "100%" : "90vh",
              overflowY: width.down("tablet") ? "no-scroll" : "scroll",
              paddingBottom: width.down("tablet") ? "1em" : 0,
              ...theme.mixins.noScrollbar,
            }}
            data={{
              character: currentCharacter,
              classes: currentCharacter["stats"]["classes"],
              stats: currentCharacter["stats"]["abilityScores"],
              proficiencyBonus: currentCharacter["stats"]["proficiencyBonus"],
              dataClasses: classes,
              proficiencies: [
                {
                  key: "hitPoints",
                  title: "Puntos de vida",
                  content: (
                    <HitPoints modifyHitPoints={modifyHitPoints} hitPoints={currentCharacter.stats.hitPoints}>
                      {`${currentCharacter.stats.hitPoints.current}${
                        currentCharacter.stats.hitPoints.temp
                          ? ` ${getOperatorString(currentCharacter.stats.hitPoints.temp)}`
                          : ""
                      } / ${currentCharacter.stats.hitPoints.max} (${currentCharacter.stats.classes
                        .map((charClass) => `${charClass.classLevel}d${charClass.hitDie}`)
                        .join(", ")} + ${getModifier(currentCharacter.stats.abilityScores.constitution)})`}
                    </HitPoints>
                  ),
                },
                {
                  key: "armorClass",
                  title: "Clase de armadura",
                  content: `${getStatBonus("stats.armorClass", currentCharacter, "stats.armorClass")?.total} (${
                    isArrayNotEmpty(currentCharacter.stats.equipment.armor)
                      ? currentCharacter.stats.equipment.armor
                          .filter((armor) => armor.equipped)
                          .map((armor) => items.find((item) => item.id === armor.id)?.name?.toLowerCase())
                          .join(", ")
                      : "sin armadura"
                  })`,
                },
                {
                  key: "proficiencyBonus",
                  title: "Bonificador de competencia",
                  content: getProficiencyBonus(currentCharacter),
                },
                {
                  key: "speed",
                  title: "Velocidad",
                  content: getSpeedString(currentCharacter.stats.speed),
                },
                {
                  key: "savingThrows",
                  title: "Tiradas de salvación con competencia",
                  content: getSavingThrowString(currentCharacter),
                },
                {
                  key: "skills",
                  title: "Habilidades con competencia",
                  content: getAbilitiesString(currentCharacter),
                },
                {
                  key: "senses",
                  title: "Sentidos",
                  content: `Percepción pasiva ${getPassivePerception(
                    currentCharacter
                  )}, investigación pasiva ${getPassiveInvestigation(
                    currentCharacter
                  )}, bono de Iniciativa ${getOperatorString(getInitiativeBonus(currentCharacter))}`,
                },
              ],
              abilities: [
                { title: "Ataques", content: getAttackStrings(currentCharacter) },
                {
                  title: "Acciones",
                  content: [...currentCharacter.stats.actions, ...currentCharacter.stats.bonusActions],
                },
                { title: "Reacciones", content: currentCharacter.stats.reactions },
                {
                  title: "Habilidades",
                  content: currentCharacter.stats.additionalAbilities,
                },
                {
                  title: "Hechizos",
                  content:
                    currentCharacter.stats.spells?.length > 0
                      ? {
                          characterSpells: currentCharacter.stats.spells,
                          spellData: spells,
                        }
                      : null,
                },
                { title: "Objetos", content: items },
                {
                  title: "Trasfondo",
                  content: [currentCharacter.flavor.background].map((back) => ({
                    ...back,
                    description: back.trait,
                  })),
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const character = await Api.fetchInternal(`/characters/${query.id}`).catch(() => null);

  return {
    props: {
      key: character._id,
      character,
    },
  };
}
