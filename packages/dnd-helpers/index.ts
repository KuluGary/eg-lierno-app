import { getNestedKey, getOperatorString, isArrayNotEmpty } from "@lierno/core-helpers";
import challengeRating from "./json/challengeRating.json";
import classGenderDictionary from "./json/classGenderDictionary.json";
import { skills as skillsJSON } from "./json/customizable_stats.json";
import fullcaster from "./json/fullcaster.json";
import innateSpellcastingLabels from "./json/innateSpellcastingLabels.json";
import pactcaster from "./json/pactcaster.json";
import statLabels from "./json/statLabels.json";
import {
  Character,
  CharacterAttackDamage,
  CharacterClass,
  CharacterSavingThrows,
  CharacterSkills,
  CharacterSpeed,
  CharacterSpellCasting,
  CharacterSpellLevels,
  Creature,
  GetStatBonus,
  InnateSpellCasting,
  Npc,
  SpellSlots,
} from "./types";

/**
 * Gets a number and converts it to a modifier
 * @param {number} stat the number to convert to a modifier (eg: 16)
 * @returns {number} value converted to modifier
 */
export function getModifier(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

/**
 * Searches the bonus of a stat in for the creature
 * @param {string} key the object string key to the character value
 * @param {Creature} creature the creature object
 * @param {string=} fallback a fallback string key
 * @returns {number} full selected stat with bonus added
 */
export function getStatBonus(key: string, creature: Creature, fallback: string | undefined): GetStatBonus {
  const arrayBonusSelected = creature?.stats?.statBonus?.filter((bonus) => bonus.modifier === key);
  let base = getNestedKey(key, creature);

  if (!base && !!fallback) {
    base = getNestedKey(fallback, creature);
  }

  if (isArrayNotEmpty(arrayBonusSelected)) {
    const bonusSelected = arrayBonusSelected
      .map(({ bonus }) => bonus)
      .reduce((results: any, current: any) => {
        return results + current;
      }, 0);

    return { base, bonus: bonusSelected ?? 0, bonusList: arrayBonusSelected, total: base + (bonusSelected ?? 0) };
  }

  return { base, bonus: 0, bonusList: [], total: base };
}

/**
 * Returns the proficiency bonus based on the total creature level
 * @param {Character} creature the creature object
 * @returns {number} proficiency bonus value
 */
export function getProficiencyBonus(creature: Creature): number {
  const { classes, proficiencyBonus } = creature.stats;
  if (!classes) return proficiencyBonus;

  const totalLevel = classes.reduce((total, current) => (total += current.classLevel), 0);

  return Math.ceil(1 + totalLevel / 4);
}

/**
 * Gets a class name and translates based on gender
 * @param {string} charClass the name of the class to translate
 * @param {string} pronoun the selected creature's pronoun
 * @returns {string} the gendered name of the class
 */
export function getGenderedClass(charClass: string, pronoun: string): string {
  if (!charClass || !pronoun) return charClass;

  let charClassToReturn = charClass;
  pronoun = pronoun.toLowerCase();

  if (pronoun in classGenderDictionary) {
    const genderedClasses = classGenderDictionary[pronoun as keyof typeof classGenderDictionary];

    charClassToReturn = genderedClasses[charClass as keyof typeof genderedClasses];
  }

  return charClassToReturn;
}

/**
 * Gets a subtitle for the selected character
 * @param {Character} character the character object
 * @returns {string} character subtitle
 */
export function getCharacterSubtitle(character: Character): string {
  if (!character) return "";

  const classes = character["stats"]["classes"]
    .map((charClass) => {
      let string = `${getGenderedClass(charClass.className, character["flavor"]["traits"]["pronoun"])} nivel ${
        charClass.classLevel
      }`;

      if (!!charClass.subclassName) {
        string += ` ( ${charClass.subclassName} )`;
      }

      return string;
    })
    .join(" / ");

  const race = character["stats"]["race"]?.name;

  return [race, classes].join(", ");
}

/**
 * Gets a subtitle for the selected character
 * @param {object} character the character object
 * @returns {string} character subtitle
 */
export function getNpcSubtitle(character: Npc): string {
  if (!character) return "";

  return [character?.flavor?.race?.name, character?.flavor?.class].filter((el) => !!el).join(", ");
}

/**
 * Gets a subtitle for the selected character
 * @param {object} character the character object
 * @returns {string} character subtitle
 */
export function getMonsterSubtitle(character: Npc): string {
  if (!character) return "";

  return [
    [character?.flavor?.race?.size, character?.flavor?.race?.name].filter((el) => !!el).join(" "),
    character.flavor.alignment,
  ]
    .filter((el) => !!el)
    .join(", ");
}

/**
 * Gets the passive perception based on character stats
 * @param {Creature} character the character object
 * @returns {number} passive perception number
 */
export function getPassivePerception(character: Creature): number {
  const { proficiencyBonus, skills } = character.stats;

  const proficiencyModifier =
    skills["perception"]?.expertise === true
      ? proficiencyBonus * 2
      : skills["perception"]?.proficient === true
      ? proficiencyBonus
      : 0;

  const { bonus: perceptionBonus } = getStatBonus("stats.passivePerception", character, "stats.abilityScores.wisdom");
  const { total: wisdomTotal } = getStatBonus("stats.abilityScores.wisdom", character, "stats.abilityScores.wisdom");

  return 10 + getModifier(wisdomTotal) + perceptionBonus + proficiencyModifier;
}

/**
 * Gets the passive investigation based on character stats
 * @param {Creature} character the character object
 * @returns {number} passive investigation number
 */
export function getPassiveInvestigation(character: Creature): number {
  const { proficiencyBonus, skills } = character.stats;

  const proficiencyModifier =
    skills["investigation"]?.expertise === true
      ? proficiencyBonus * 2
      : skills["investigation"]?.proficient === true
      ? proficiencyBonus
      : 0;

  const { bonus: investigationBonus } = getStatBonus(
    "stats.passiveInvestigation",
    character,
    "stats.abilityScores.intelligence"
  );
  const { total: intelligenceTotal } = getStatBonus(
    "stats.abilityScores.intelligence",
    character,
    "stats.abilityScores.intelligence"
  );

  return 10 + getModifier(intelligenceTotal) + investigationBonus + proficiencyModifier;
}

/**
 * Gets the initiative bonus based on character stats
 * @param {Creature} character the character object
 * @returns {number} initiative bonus number
 */
export function getInitiativeBonus(character: Creature): number {
  return (
    getModifier(getStatBonus("stats.abilityScores.dexterity", character, "stats.abilityScores.dexterity").total) +
    getStatBonus("stats.initiativeBonus", character, "stats.abilityScores.dexterity").bonus
  );
}

/**
 * Gets a string with all the characters saving throws
 * @param {Creature} character the character object
 * @returns {string} string listing all the proficient saving throws
 */
export function getSavingThrowString(character: Creature): string {
  const { savingThrows } = character.stats;
  const proficiency = getProficiencyBonus(character);

  const modifiers = Object.keys(savingThrows ?? {})
    .filter(
      (key) =>
        savingThrows[key as keyof CharacterSavingThrows].proficient ||
        savingThrows[key as keyof CharacterSavingThrows].expertise
    )
    .map((key) => {
      const { total: abilityScore } = getStatBonus(
        `stats.abilityScores.${key}`,
        character,
        `stats.abilityScores.${key}`
      );
      let modifier = getModifier(abilityScore);

      if (savingThrows[key as keyof CharacterSavingThrows].expertise) {
        modifier += proficiency * 2;
      } else if (savingThrows[key as keyof CharacterSavingThrows].proficient) {
        modifier += proficiency;
      }

      return `${statLabels[key as keyof CharacterSavingThrows]} ${getOperatorString(modifier)}`;
    });

  return modifiers.join(", ");
}

/**
 * Gets a string with all the character abilities
 * @param {Creature} character the character object
 * @returns {string} string listing all the proficient abilities
 */
export function getAbilitiesString(character: Creature): string {
  const { skills } = character.stats;
  const proficiency = getProficiencyBonus(character);

  const modifiers = Object.entries(skills)
    .filter(([_, skill]) => skill.proficient || skill.expertise)
    .map(([name, skill]) => {
      const { total: abilityScore } = getStatBonus(
        `stats.abilityScores.${skill.modifier}`,
        character,
        `stats.abilityScores.${skill.modifier}`
      );
      let modifier = getModifier(abilityScore);

      if (skill.expertise) {
        modifier += proficiency * 2;
      } else if (skill.proficient) {
        modifier += proficiency;
      }

      return `${skillsJSON[name as keyof CharacterSkills]?.name} ${getOperatorString(modifier)} (${
        statLabels[skill.modifier as keyof CharacterSavingThrows]
      })`;
    });

  return modifiers.join(", ");
}

/**
 * Gets a string for the current attack
 * @param {Creature} character the character object
 * @returns {string[]} array with strings of the attacks
 */
export function getAttackStrings(character: Creature): { name: string; description: string }[] {
  const { attacks } = character.stats;
  const proficiency = getProficiencyBonus(character);

  const attackStrings = attacks.map((attack) => {
    const attackTypeDictionary = {
      melee: "melé",
      distance: "distancia",
    };

    let toHitBonus = 0;
    let damageBonus = 0;
    let bonusStat = attack.data.modifier ?? "strength";
    let typeArr: string[] = [];
    let typeStr: string;
    let rangeStr: string;
    let rangeArr: string[] = [];

    Object.entries(attack.data.damage).forEach(([key, damage]) => {
      if (key in attackTypeDictionary) {
        typeArr.push(attackTypeDictionary[key as keyof CharacterAttackDamage]);

        if (typeof damage.range === "object") {
          const { short, long } = damage.range;

          rangeArr.push(`${short}/${long} ft.`);
        } else rangeArr.push(`${damage.range} ft.`);
      }
    });

    typeStr = `Ataque de arma ${typeArr.join(" o ")}.`;
    rangeStr = rangeArr.join(" o ");

    const { total: abilityScore } = getStatBonus(
      `stats.abilityScores.${bonusStat}`,
      character,
      `stats.abilityScores.${bonusStat}`
    );

    toHitBonus = getModifier(abilityScore) + (attack.proficient ? proficiency : 0);
    damageBonus = getModifier(abilityScore);

    let toHitStr = typeArr
      .map((type) => {
        const typeKey = Object.keys(attackTypeDictionary).find(
          (key) => attackTypeDictionary[key as keyof typeof attackTypeDictionary] === type
        );
        const totalBonus =
          toHitBonus + (attack?.data?.damage[typeKey as keyof CharacterAttackDamage]?.attackBonus ?? 0);

        return { type, totalBonus };
      })
      .filter((elem, index, arr) => arr.findIndex((e) => e.totalBonus === elem.totalBonus) === index)
      .map(({ type, totalBonus }, _, arr) => {
        if (arr.length > 1) return `${getOperatorString(totalBonus)} al golpe a ${type}`;

        return `${getOperatorString(totalBonus)} al golpe`;
      })
      .join(" o ");

    let damageStr = Object.entries(attack.data.damage)
      .map(([key, value]) => {
        const { dieSize, numDie, type } = value;
        const die = `${numDie}d${dieSize}`;
        const totalBonus = damageBonus + (attack?.data?.damage[key as keyof CharacterAttackDamage]?.damageBonus ?? 0);

        return { damageType: type, die, type: key, totalBonus };
      })
      .filter(
        (v: any, i, a) =>
          a.findIndex((v2: any) => ["damageType", "die", "totalBonus"].every((k) => v2[k as any] === v[k])) === i
      )
      .map(({ type, die, damageType, totalBonus }, i, arr) => {
        const totalBonusStr =
          totalBonus > 0
            ? `${getOperatorString(
                damageBonus + (attack?.data?.damage[type as keyof CharacterAttackDamage]?.damageBonus ?? 0)
              )}`
            : "";
        let damageTypeStr = damageType.toLowerCase();
        let nextType = arr[i + 1];
        let damageModeStr = "";

        if (type === "versatile") damageModeStr = "a dos manos";

        if (type === "extraDamage") damageModeStr = "de daño adicional";

        return [die, totalBonusStr, nextType?.damageType === damageType ? "" : damageTypeStr, damageModeStr]
          .filter((el) => !!el)
          .join(" ");
      })
      .join(" o ");

    let extraInfo = attack.data.extraInfo ? ` ${attack.data.extraInfo}` : "";

    let description = `<p><em>${typeStr}</em> 1d20 ${toHitStr}, alcance ${rangeStr} Daño ${damageStr}.${extraInfo}</p>`;

    return {
      name: attack.name,
      description,
    };
  });

  return attackStrings;
}

/**
 * Generates a spellcasting name string from classes
 * @param {string} caster caster ID
 * @param {CharacterClass[]} classes array of all classes
 * @returns {string} spellcasting string
 */
export function getSpellcastingName(caster: string, classes: CharacterClass[]): string {
  if (caster === "00000") return "Lanzamiento de conjuros innato";

  if (!!classes) {
    const className = classes
      .find((charClass: CharacterClass) => charClass.classId === caster)
      ?.className?.toLocaleLowerCase();

    if (!!className) {
      return `Lanzamiento de conjuros de ${className}`;
    }
  }

  return "Lanzamiento de conjuros";
}

/**
 * Gets an object with arrays of the character spell slots
 * @param {Creature} character the character object
 * @param {CharacterClass[]} apiClasses array of all classes
 * @returns {object} object with arrays of spells slots
 */
export function getSpellSlots(character: Creature, apiClasses: CharacterClass[]): object {
  const { classes } = character.stats;
  let effectiveLevel: number = 0;
  let halfLevels = 0;
  let semiLevels = 0;

  let artificer = false;
  let warlock = false;

  let spells: any = {};

  let totalClasses = 0;

  classes.forEach(({ classId, classLevel }) => {
    const currentSpellcaster: any = apiClasses.find((charClass) => charClass!._id === classId)?.spellcasting;

    if (!!currentSpellcaster?.multiclassing) {
      if (
        currentSpellcaster.multiclassing.type === "fullcaster" ||
        currentSpellcaster.multiclassing.type === "warlock"
      ) {
        effectiveLevel = classLevel * 1;
        totalClasses++;

        if (currentSpellcaster.multiclassing.type === "warlock") warlock = true;
      } else if (
        currentSpellcaster.multiclassing.type === "halfcaster" ||
        currentSpellcaster.multiclassing.type === "artificer"
      ) {
        halfLevels += classLevel * 0.5;
        totalClasses++;

        if (currentSpellcaster.multiclassing.type === "artificer") artificer = true;
      } else {
        semiLevels += classLevel * 0.33334;
        totalClasses++;
      }

      if (totalClasses === 1 && (halfLevels > 0.5 || artificer)) {
        halfLevels += 0.5;
      }

      if (totalClasses === 1 && semiLevels > 0.7) {
        semiLevels += 0.66666667;
      }

      effectiveLevel += Math.floor(halfLevels);
      effectiveLevel += Math.floor(semiLevels);
    }
  });

  spells["classSpells"] = fullcaster[effectiveLevel.toString() as keyof typeof fullcaster].spellSlots;

  if (warlock) spells["pactSpells"] = pactcaster[effectiveLevel.toString() as keyof typeof fullcaster].spellSlots;

  return spells;
}

/**
 * Gets a HTML string for the current spellcasting spells
 * @param {object} spellcasting one of the current character spellcasting abilities
 * @param {object[]} spellData list of all the available spells
 * @param {Creature} character the caracter object
 * @param {CharacterClass[]} classes array of all classes
 * @returns {string} spell description string
 */
export function getSpellStrings(
  spellcasting: CharacterSpellCasting,
  spellData: any[],
  character: Creature,
  classes: CharacterClass[]
): string {
  const { spells, modifier, caster } = spellcasting;
  const proficiency = getProficiencyBonus(character);
  const spellSlots: SpellSlots | null = character.stats.classes ? getSpellSlots(character, classes) : null;

  let spellDC: number;
  let spellBonus: number;

  const spellByLevel: CharacterSpellLevels = {};

  Object.keys(spells).forEach((key) => {
    spells[key as keyof CharacterSpellLevels]?.forEach((spell) => {
      const element = spellData.find((spellDataElement) => spellDataElement._id === spell.spellId);

      if (key in spellByLevel) {
        spellByLevel[key as keyof CharacterSpellLevels]?.push(element.name);
      } else {
        spellByLevel[key as keyof CharacterSpellLevels] = [element.name];
      }
    });
  });

  if (!!modifier) {
    const { total: abilityScore } = getStatBonus(
      `stats.abilityScores.${modifier}`,
      character,
      `stats.abilityScores.${modifier}`
    );
    const abilityScoreModifier = getModifier(abilityScore);

    spellDC = 8 + proficiency + abilityScoreModifier;
    spellBonus = proficiency + abilityScoreModifier;

    const spellString = {
      description: `<p>La habilidad de conjuración de ${character.name} es ${
        statLabels[modifier as keyof CharacterSavingThrows]
      } (salvación de conjuro CD ${spellDC ?? "N/A"}, ${getOperatorString(
        spellBonus
      )} al golpe con ataques de hechizo). Tiene los siguientes hechizos preparados:</p><ul>`,
    };

    Object.keys(spellByLevel).forEach((key) => {
      const spellStr = spellByLevel[key as keyof CharacterSpellLevels]
        ?.map((i, index) => (index > 0 ? i?.toString().toLowerCase() : i))
        .join(", ");

      if (caster === "00000") {
        spellString.description += `<li><b>${
          innateSpellcastingLabels[key as keyof InnateSpellCasting]
        }</b>: ${spellStr}</li>`;
      } else if (caster !== "" && spellSlots !== null) {
        const casting = caster === "5ec030b0f44b2b688355ab60" ? spellSlots["pactSpells"] : spellSlots["classSpells"];
        spellString.description += `<li>${
          parseInt(key) === 0
            ? "<b>Trucos (a voluntad)</b>"
            : `<b>Nivel ${key} (${casting?.[parseInt(key) - 1]} huecos)</b>`
        }: ${spellStr}.</li>`;
      }
    });

    return spellString.description;
  }

  return "";
}

/**
 * Gets the experience value based on the creature's challenge rating
 * @param {number} cr the creature challenge rating
 * @returns {number} experience value
 */
export function getExperienceByCr(cr: number): number {
  return challengeRating[cr?.toString() as keyof typeof challengeRating];
}

/**
 * Gets a string with the character speeds
 * @param {CharacterSpeed} speed the character's speed object
 * @returns {string} speed string
 */
export function getSpeedString(speed: CharacterSpeed): string {
  const speedDictionary = { land: "en tierra", air: "en el aire", swim: "en el agua" };
  const speeds = Object.keys(speed)
    .filter((key) => speed[key as keyof CharacterSpeed]! > 0)
    .map((key) => `${speed[key as keyof CharacterSpeed]}ft. (${speedDictionary[key as keyof CharacterSpeed]})`);

  return speeds.join(", ");
}
