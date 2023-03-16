import { getFraction, getOperatorString } from "@lierno/core-helpers";
import {
  getAbilitiesString,
  getAttackStrings,
  getExperienceByCr,
  getInitiativeBonus,
  getModifier,
  getMonsterSubtitle,
  getPassiveInvestigation,
  getPassivePerception,
  getSavingThrowString,
  getSpeedString,
} from "@lierno/dnd-helpers";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CreatureMenu from "components/CreatureMenu/CreatureMenu";
import { CreatureFlavor } from "components/CreatureProfile/CreatureFlavor/CreatureFlavor";
import HitPoints from "components/CreatureProfile/CreatureStats/components/HitPoints/HitPoints";
import { CreatureStats } from "components/CreatureProfile/CreatureStats/CreatureStats";
import Layout from "components/Layout/Layout";
import Metadata from "components/Metadata/Metadata";
import { ArrayUtil } from "helpers/string-util";
import { useWidth } from "hooks/useWidth";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Api from "services/api";

export default function MonsterProfile({ monster, spells, items, classes, tier }) {
  const { data: session } = useSession();
  const theme = useTheme();
  const width = useWidth();
  const [currentMonster, setCurrentMonster] = useState(monster);

  const downloadPdf = () => {
    Api.fetchInternal("/monster/sheet/pdf/" + currentMonster["_id"])
      .then((base64Url) => download(base64Url, `${currentMonster["name"]}.png`, "image/png"))
      .catch((err) => toast.error(err?.message));
  };

  const modifyHitPoints = (key, amount) => {
    const newMonster = { ...currentNpc };

    newMonster.stats.hitPoints[key] = amount;

    Api.fetchInternal("/monster", {
      method: "PUT",
      body: JSON.stringify(newMonster),
    }).then(() => setCurrentMonster(newMonster));
  };

  return (
    <Layout>
      <Metadata
        title={(currentMonster?.name ?? "") + " | Lierno App"}
        image={currentMonster?.flavor.portrait?.original}
        description={currentMonster?.flavor.personality}
      />

      <Grid container spacing={1} sx={{ height: "100%" }}>
        <Grid item laptop={6} tablet={12}>
          <CreatureFlavor
            containerStyle={{
              height: width.down("tablet") ? "100%" : "90vh",
              overflowY: width.down("tablet") ? "no-scroll" : "scroll",
              ...theme.mixins.noScrollbar,
            }}
            data={{
              id: currentMonster._id,
              sections: [{ title: "Descripción", content: currentMonster?.flavor.description }],
              image: currentMonster?.flavor.portrait?.original,
              tier,
              type: "monster",
            }}
            Header={() => (
              <>
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
                    <Box>
                      <Typography variant="h3">{monster?.name}</Typography>
                      <Typography variant="subtitle1">
                        {/* {[currentMonster.flavor.class, currentMonster.stats.race, currentMonster.stats.alignment]
                          .filter((el) => el && el.length > 0)
                          .map((el, i) => (i > 0 ? el.toLowerCase() : el))
                          .join(", ")} */}
                        {getMonsterSubtitle(currentMonster)}
                      </Typography>
                    </Box>
                  </Box>
                  {!!session && session.userId === currentMonster.createdBy && (
                    <CreatureMenu creature={currentMonster} type="monster" downloadPdf={downloadPdf} />
                  )}
                </Box>
              </>
            )}
          />
        </Grid>
        <Grid item laptop={6} tablet={12}>
          <CreatureStats
            containerStyle={{
              height: width.down("tablet") ? "100%" : "90vh",
              overflowY: width.down("tablet") ? "no-scroll" : "scroll",
              paddingBottom: width.down("tablet") ? "2em" : "0",
              marginBottom: width.down("tablet") ? "1em" : "0",
              ...theme.mixins.noScrollbar,
            }}
            data={{
              classes,
              character: currentMonster,
              stats: currentMonster["stats"]["abilityScores"],
              proficiencyBonus: currentMonster["stats"]["proficiencyBonus"],
              proficiencies: [
                {
                  key: "hitPoints",
                  title: "Puntos de vida",
                  content: (
                    <HitPoints modifyHitPoints={modifyHitPoints} hitPoints={currentMonster.stats.hitPoints}>
                      {`${currentMonster["stats"]["hitPoints"]["current"]}${
                        currentMonster.stats.hitPoints.temp
                          ? ` ${getOperatorString(currentMonster.stats.hitPoints.temp)}`
                          : ""
                      } / ${currentMonster["stats"]["hitPoints"]["max"]} (${currentMonster["stats"]["hitDie"]["num"]}d${
                        currentMonster["stats"]["hitDie"]["size"]
                      } ${getOperatorString(
                        parseInt(
                          getModifier(currentMonster["stats"]["abilityScores"]["constitution"]) *
                            currentMonster["stats"]["hitDie"]["num"]
                        )
                      )})`}
                    </HitPoints>
                  ),
                },
                {
                  key: "armorClass",
                  title: "Clase de armadura",
                  content: `${currentMonster["stats"]["armorClass"]} (${
                    ArrayUtil.isNotEmpty(currentMonster.stats.equipment?.armor)
                      ? currentMonster.stats.equipment?.armor
                          .filter((armor) => armor.equipped)
                          .map((armor) => items.find((item) => item.id === armor.id)?.name?.toLowerCase())
                          .join(", ")
                      : "sin armadura"
                  })`,
                },
                { key: "speed", title: "Velocidad", content: getSpeedString(currentMonster.stats.speed) },
                {
                  key: "savingThrows",
                  title: "Tiradas de salvación con competencia",
                  content: getSavingThrowString(currentMonster),
                },
                {
                  key: "skills",
                  title: "Habilidades con competencia",
                  content: getAbilitiesString(currentMonster),
                },
                {
                  key: "senses",
                  title: "Sentidos",
                  content: `Percepción pasiva ${getPassivePerception(
                    currentMonster
                  )}, investigación pasiva ${getPassiveInvestigation(
                    currentMonster
                  )}, bono de Iniciativa ${getOperatorString(getInitiativeBonus(currentMonster))}`,
                },
                {
                  key: "damageVulnerabilities",
                  title: "Vulnerabilidades al daño",
                  content: currentMonster["stats"]["damageVulnerabilities"].join(", "),
                },
                {
                  key: "damageResistances",
                  title: "Resistencias al daño",
                  content: currentMonster["stats"]["damageResistances"].join(", "),
                },
                {
                  key: "damageImmunities",
                  title: "Inmunidades al daño",
                  content: currentMonster["stats"]["damageImmunities"].join(", "),
                },
                {
                  key: "conditionImmunities",
                  title: "Inmunidades a la condición",
                  content: currentMonster["stats"]["conditionImmunities"].join(", "),
                },
                {
                  key: "challengeRating",
                  title: "Valor de desafío",
                  content: `${getFraction(currentMonster["stats"]["challengeRating"])} (${getExperienceByCr(
                    currentMonster["stats"]["challengeRating"]
                  )} puntos de experiencia)`,
                },
              ],
              abilities: [
                { title: "Ataques", content: currentMonster.stats.attacks ? getAttackStrings(currentMonster) : [] },
                { title: "Acciones", content: currentMonster["stats"]["actions"] },
                { title: "Reacciones", content: currentMonster["stats"]["reactions"] },
                { title: "Habilidades", content: currentMonster["stats"]["additionalAbilities"] },
                {
                  title: "Hechizos",
                  content:
                    currentMonster.stats.spells?.length > 0
                      ? { characterSpells: currentMonster.stats.spells, spellData: spells }
                      : null,
                },
                { title: "Acciones legendarias", content: currentMonster["stats"]["legendaryActions"] },
                { title: "Objetos", content: items },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { req, query } = context;
  const secret = process.env.SECRET;

  const token = await getToken({ req, secret, raw: true }).catch((e) => console.error(e));

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: true,
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const monster = await Api.fetchInternal("/monsters/" + query.id, {
    headers,
  });

  if (!monster) return { notFound: true };

  let spells = null;
  let items = [];

  if (!!monster.stats.spells && monster.stats.spells.length > 0) {
    const spellIds = [];

    monster.stats.spells.forEach((spellcasting) => {
      Object.values(spellcasting.spells || {})?.forEach((spellLevel) => {
        spellIds.push(...spellLevel);
      });
    });

    spells = await Api.fetchInternal(`/spells?id=${JSON.stringify(spellIds.map((spell) => spell.spellId))}`, {
      headers,
    });
  }

  if (!!monster?.stats?.equipment) {
    const objects = [];

    for (const key in monster.stats.equipment || {}) {
      const element = monster.stats.equipment[key];

      if (Array.isArray(element)) {
        objects.push(...element.map((i) => i.id));
      }
    }

    items = await Api.fetchInternal("/items", {
      method: "POST",
      body: JSON.stringify(objects),
    });

    items = items.map(({ _id, name, description }) => {
      return {
        id: _id,
        name,
        description,
      };
    });
  }

  let classes = await Api.fetchInternal("/classes/", {
    headers,
  }).catch(() => null);

  if (!!classes) {
    classes = classes.map((charClass) => {
      const parsed = {
        className: charClass.name,
        classId: charClass._id,
      };

      return parsed;
    });
  }

  let tier = null;

  if (!!monster?.flavor.group) {
    tier = await Api.fetchInternal(`/tier-by-creature?type=monster&id=${monster.flavor.group}`, {
      headers,
    })
      .then((res) => res.map((el) => el._id))
      .catch(() => null);
  }

  return {
    props: {
      key: monster._id,
      monster,
      spells,
      items,
      classes,
      tier,
    },
  };
}
