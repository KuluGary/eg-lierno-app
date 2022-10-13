const {
  getModifier,
  getGenderedClass,
  getCharacterSubtitle,
  getStatBonus,
  getPassivePerception,
  getProficiencyBonus,
  getSavingThrowString,
  getAbilitiesString,
  getAttackStrings,
  getSpellSlots,
  getSpellStrings,
  getExperienceByCr,
  getSpeedString,
  getSpellcastingName,
  getPassiveInvestigation,
  getInitiativeBonus,
} = require("./index");
const { spells: spellData } = require("./json/spells.json");
const { classes } = require("./json/classes.json");
const athan = require("./json/characters/athan.json");
const aradna = require("./json/characters/aradna.json");
const ament = require("./json/characters/ament.json");
const lyanna = require("./json/characters/lyanna.json");
const jon = require("./json/characters/jon.json");
const mario = require("./json/characters/mario.json");
const artifice = require("./json/characters/artifice.json");

describe("#getModifier", () => {
  test("it gets the correct modifier", () => {
    expect(getModifier(10)).toBe(0);
    expect(getModifier(11)).toBe(0);
    expect(getModifier(12)).toBe(1);
    expect(getModifier(13)).toBe(1);
    expect(getModifier(14)).toBe(2);
    expect(getModifier(15)).toBe(2);
    expect(getModifier(16)).toBe(3);
  });
});

describe("#getGenderedClass", () => {
  const pronouns = {
    masc: "El",
    fem: "La",
    neutral: "Le",
  };

  test("return the masc class with the masc pronoun", () => {
    expect(getGenderedClass("Pícaro", pronouns.masc)).toBe("Pícaro");
  });

  test("return the fem class with the fem pronoun", () => {
    expect(getGenderedClass("Pícaro", pronouns.fem)).toBe("Pícara");
  });

  test("return the neutral class with the neutral pronoun", () => {
    expect(getGenderedClass("Pícaro", pronouns.neutral)).toBe("Pícare");
  });
});

describe("#getCharacterSubtitle", () => {
  test("it gets the correct character subtitle for Athan", () => {
    expect(getCharacterSubtitle(athan)).toBe("Humana, Bruja nivel 1 ( Patrón fantasmal )");
  });

  test("it gets the correct character subtitle for Lyanna", () => {
    expect(getCharacterSubtitle(lyanna)).toBe("Cambiaformas, Druida nivel 1");
  });

  test("it gets the correct character subtitle for Aradna", () => {
    expect(getCharacterSubtitle(aradna)).toBe("Humana, Guerrera nivel 1");
  });
});

describe("#getStatBonus", () => {
  test("it returns 0 if the character doesnt have bonus", () => {
    expect(getStatBonus("stats.abilityScores.intelligence", aradna)).toEqual({
      base: 14,
      bonus: 0,
      bonusList: [],
      total: 14,
    });
  });

  test("it returns the bonus if the character has it", () => {
    expect(getStatBonus("stats.abilityScores.intelligence", artifice).total).toEqual(18);
  });
});

describe("#getProficiencyBonus", () => {
  test("it returns the correct proficiency bonus", () => {
    expect(getProficiencyBonus(athan)).toBe(2);
  });
});

describe("#getPassivePerception", () => {
  test("it returns the correct character passive perception", () => {
    expect(getPassivePerception(athan)).toBe(13);
  });
});

describe("#getPassiveInvestigation", () => {
  test("it returns the correct character passive investigation", () => {
    expect(getPassiveInvestigation(ament)).toBe(15);
  });
});
describe("#getInitiativeBonus", () => {
  test("it returns the correct character initiative bonus", () => {
    expect(getInitiativeBonus(ament)).toBe(3);
  });
});

describe("#getSavingThrowString", () => {
  test("it returns the correct saving throw string", () => {
    expect(getSavingThrowString(lyanna)).toEqual("Inteligencia +2, Sabiduría +5");
  });
});

describe("#getAbilitiesString", () => {
  test("it returns the correct ability string", () => {
    expect(getAbilitiesString(lyanna)).toEqual(
      "T.con Animales +5 (Sabiduría), Perspicacia +5 (Sabiduría), Naturaleza +2 (Inteligencia), Percepción +5 (Sabiduría), Supervivencia +5 (Sabiduría)"
    );
  });
});

describe("#getAttackStrings", () => {
  test("it returns the correct attack string", () => {
    expect(getAttackStrings(ament)).toEqual([
      {
        description: "<p><em>Ataque de arma melé.</em> 1d20 +5 al golpe, alcance 5 ft. Daño 1d6 +3 perforante.</p>",
        name: "Espada corta",
      },
      {
        description:
          "<p><em>Ataque de arma distancia.</em> 1d20 +5 al golpe, alcance 80/320 ft. Daño 1d6 +3 perforante.</p>",
        name: "Arco corto",
      },
    ]);
  });
});

describe("#getSpellcastingName", () => {
  test("it returns the correct spell string", () => {
    expect(getSpellcastingName()).toEqual("Lanzamiento de conjuros");
    expect(getSpellcastingName("00000")).toEqual("Lanzamiento de conjuros innato");
    expect(
      getSpellcastingName("5ec030b0f44b2b688355ab60", [
        {
          className: "Brujo",
          subclassName: "Ctónico",
          hitDie: 8,
          classLevel: 5,
          classId: "5ec030b0f44b2b688355ab60",
          subclassDescription:
            "Se espera que los seguidores del ctónico sirvan a su voluntad en el mundo. El ctónico se preucpa por asegurarse de que aquellos destinados a morir lo hagan como se esperaba, y pide a sus agentes que derroten a aquellos que buscan engañar a la muerte mediante imitaciones de la inmortalidad. Odia a los muertos vivientes inteligentes y espera que sus seguidores los derriben, mientras que los muertos vivientes sin sentido, como los esqueletos, son poco más que autómatas torpes a sus ojos.",
        },
      ])
    ).toEqual("Lanzamiento de conjuros de brujo");
  });
});

describe("#getSpellSlots", () => {
  test("it returns the correct spell slot number", () => {
    expect(getSpellSlots(lyanna, classes)).toEqual({ classSpells: [2, 0, 0, 0, 0, 0, 0, 0, 0] });

    expect(getSpellSlots(athan, classes)).toEqual({
      classSpells: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      pactSpells: [1, 0, 0, 0, 0],
    });

    expect(getSpellSlots(jon, classes)).toEqual({ classSpells: [2, 0, 0, 0, 0, 0, 0, 0, 0] });
  });
});

describe("#getSpellStrings", () => {
  test("it returns the correct spell string", () => {
    expect(getSpellStrings(mario.stats.spells[0], spellData, mario, classes)).toEqual(
      "<p>La habilidad de conjuración de Mario es Carisma (salvación de conjuro CD 13, +5 al golpe con ataques de hechizo). Tiene los siguientes hechizos preparados:</p><ul><li><b>A voluntad</b>: Descarga de fuego, controlar llamas, salto, caída de pluma</li><li><b>2/día</b>: Manos ardientes, agrandar / reducir</li><li><b>1/día</b>: Bola de fuego</li>"
    );
  });
  test("it returns the correct spell string", () => {
    expect(getSpellStrings(lyanna.stats.spells[0], spellData, lyanna, classes)).toEqual(
      "<p>La habilidad de conjuración de Lyanna Celeren (druida) es Sabiduría (salvación de conjuro CD 13, +5 al golpe con ataques de hechizo). Tiene los siguientes hechizos preparados:</p><ul><li><b>Trucos (a voluntad)</b>: Saber druídico, ferocidad primordial.</li><li><b>Nivel 1 (2 huecos)</b>: Absorber elementos, encantar animal, enlace animal, encantar persona, crear o destruir agua, curar heridas, detectar magia, detectar venenos y enfermedades, temblor terrestre, enmarañar, fuego feérico, nube de oscurecimiento, buenas bayas, palabra de curación, cuchillo de hielo, salto, zancada prodigiosa, purificar comida y bebida, trampa, hablar con los animales, ola atronadora.</li>"
    );

    expect(getSpellStrings(athan.stats.spells[0], spellData, athan, classes)).toEqual(
      "<p>La habilidad de conjuración de Athan Lor es Sabiduría (salvación de conjuro CD 13, +5 al golpe con ataques de hechizo). Tiene los siguientes hechizos preparados:</p><ul><li><b>Trucos (a voluntad)</b>: Descarga sobrenatural, repicar funesto.</li><li><b>Nivel 1 (1 huecos)</b>: Maldición, brazos de hadar.</li>"
    );

    expect(getSpellStrings(jon.stats.spells[0], spellData, jon, classes)).toEqual(
      "<p>La habilidad de conjuración de Jon Armin es Inteligencia (salvación de conjuro CD 13, +5 al golpe con ataques de hechizo). Tiene los siguientes hechizos preparados:</p><ul><li><b>Trucos (a voluntad)</b>: Remendar, descarga de fuego.</li><li><b>Nivel 1 (2 huecos)</b>: Fuego feérico, curar heridas.</li>"
    );
  });
});

describe("#getExperienceByCr", () => {
  test("it returns the correct cr by level", () => {
    expect(getExperienceByCr(0)).toBe(10);
    expect(getExperienceByCr(0.25)).toBe(50);
    expect(getExperienceByCr(5)).toBe(1800);
  });
});

describe("#getSpeedString", () => {
  test("it returns the correct speed", () => {
    expect(getSpeedString(lyanna.stats.speed)).toBe("30ft. (en tierra)");
  });
});
