import { getOperatorString, isArrayNotEmpty } from "@lierno/core-helpers";
import {
  getAbilitiesString,
  getAttackStrings,
  getInitiativeBonus,
  getModifier,
  getPassiveInvestigation,
  getPassivePerception,
  getProficiencyBonus,
  getSavingThrowString,
  getSpeedString,
  getStatBonus
} from "@lierno/dnd-helpers";
import { Api } from "@mui/icons-material";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import HitPoints from "../HitPoints/HitPoints";

const CreatureStats = dynamic(() => import("../../CreatureStats"));

const CharacterStats = ({ character, setCurrentCharacter, spells, items, classes }) => {
  const modifyHitPoints = (key, amount) => {
    const newChar = { ...character };

    newChar.stats.hitPoints[key] = amount;

    Api.fetchInternal("/characters/" + newChar._id, {
      method: "PUT",
      body: JSON.stringify(newChar),
    }).then(() => setCurrentCharacter(newChar));
  };

  const data = useMemo(
    () => ({
      character: character,
      classes: character["stats"]["classes"],
      stats: character["stats"]["abilityScores"],
      proficiencyBonus: character["stats"]["proficiencyBonus"],
      dataClasses: classes,
      proficiencies: [
        {
          key: "hitPoints",
          title: "Puntos de vida",
          content: (
            <HitPoints modifyHitPoints={modifyHitPoints} hitPoints={character.stats.hitPoints}>
              {`${character.stats.hitPoints.current}${
                character.stats.hitPoints.temp ? ` ${getOperatorString(character.stats.hitPoints.temp)}` : ""
              } / ${character.stats.hitPoints.max} (${character.stats.classes
                .map((charClass) => `${charClass.classLevel}d${charClass.hitDie}`)
                .join(", ")} + ${getModifier(character.stats.abilityScores.constitution)})`}
            </HitPoints>
          ),
        },
        {
          key: "armorClass",
          title: "Clase de armadura",
          content: `${getStatBonus("stats.armorClass", character, "stats.armorClass")?.total} (${
            isArrayNotEmpty(character.stats.equipment.armor)
              ? character.stats.equipment.armor
                  .filter((armor) => armor.equipped)
                  .map((armor) => items.find((item) => item.id === armor.id)?.name?.toLowerCase())
                  .join(", ")
              : "sin armadura"
          })`,
        },
        {
          key: "proficiencyBonus",
          title: "Bonificador de competencia",
          content: getProficiencyBonus(character),
        },
        {
          key: "speed",
          title: "Velocidad",
          content: getSpeedString(character.stats.speed),
        },
        {
          key: "savingThrows",
          title: "Tiradas de salvación con competencia",
          content: getSavingThrowString(character),
        },
        {
          key: "skills",
          title: "Habilidades con competencia",
          content: getAbilitiesString(character),
        },
        {
          key: "senses",
          title: "Sentidos",
          content: `Percepción pasiva ${getPassivePerception(
            character
          )}, investigación pasiva ${getPassiveInvestigation(character)}, bono de Iniciativa ${getOperatorString(
            getInitiativeBonus(character)
          )}`,
        },
      ],
      abilities: [
        { title: "Ataques", content: getAttackStrings(character) },
        {
          title: "Acciones",
          content: [...character.stats.actions, ...character.stats.bonusActions],
        },
        { title: "Reacciones", content: character.stats.reactions },
        {
          title: "Habilidades",
          content: character.stats.additionalAbilities,
        },
        {
          title: "Hechizos",
          content:
            character.stats.spells?.length > 0
              ? {
                  characterSpells: character.stats.spells,
                  spellData: spells,
                }
              : null,
        },
        { title: "Objetos", content: items },
        {
          title: "Trasfondo",
          content: [character.flavor.background].map((back) => ({
            ...back,
            description: back.trait,
          })),
        },
      ],
    }),
    [character]
  );

  return <CreatureStats data={data} />;
};

export default React.memo(CharacterStats);
