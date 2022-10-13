type CharacterFlavor = {
  alignment: string;
  appearance: string;
  background: CharacterBackground;
  backstory: string;
  faction: string;
  personality: string;
  portrait: CharacterPortrait;
  traits: CharacterTraits;
};

type CharacterBackground = {
  description: string;
  name: string;
  trait: string;
};

type CharacterPortrait = {
  original: string;
  token: string;
  avatar: string;
};

type CharacterTraits = {
  age: string;
  eyes: string;
  gender: string;
  hair: string;
  height: string;
  pronoun: string;
  skin: string;
  weight: string;
};

type CharacterRace = {
  name: string;
  description: string;
  traits: string;
  size?: string;
};

export type CharacterSpeed = {
  land: number;
  air?: number;
  swim?: number;
};

type CharacterAbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type CharacterSkills = {
  acrobatics: CharacterSkill;
  "animal-handling": CharacterSkill;
  arcana: CharacterSkill;
  athletics: CharacterSkill;
  deception: CharacterSkill;
  history: CharacterSkill;
  insight: CharacterSkill;
  intimidation: CharacterSkill;
  investigation: CharacterSkill;
  medicine: CharacterSkill;
  nature: CharacterSkill;
  perception: CharacterSkill;
  performance: CharacterSkill;
  persuasion: CharacterSkill;
  religion: CharacterSkill;
  "sleight-of-hand": CharacterSkill;
  stealth: CharacterSkill;
  survival: CharacterSkill;
};

type CharacterSkill = {
  modifier: string;
  proficient: boolean;
  expertise: boolean;
};

type CharacterHitPoints = {
  max: number;
  current: number;
  temporary?: number;
};

type CharacterAbility = {
  name: string;
  description: string;
};

type CharacterAttack = {
  name: string;
  proficient: boolean;
  data: CharacterAttackData;
};

type CharacterAttackData = {
  modifier: string;
  damage: CharacterAttackDamage;
  extraInfo: string;
};

export type CharacterAttackDamage = {
  distance?: CharacterAttackDistance;
  melee?: CharacterAttackDistance;
};

type CharacterAttackDistance = {
  damageBonus: number;
  attackBonus: number;
  range: number | CharacterAttackRange;
  type: string;
  numDie: number;
  dieSize: number;
};

type CharacterAttackRange = {
  short: number;
  long: number;
};

export type CharacterSpellCasting = {
  modifier: string;
  caster: string;
  level: number;
  spells: CharacterSpellLevels;
};

export type CharacterSpellLevels = {
  "0"?: CharacterSpell[];
  "1"?: CharacterSpell[];
  "2"?: CharacterSpell[];
  "3"?: CharacterSpell[];
  "4"?: CharacterSpell[];
  "5"?: CharacterSpell[];
  "6"?: CharacterSpell[];
  "7"?: CharacterSpell[];
  "8"?: CharacterSpell[];
  "9"?: CharacterSpell[];
};

export type CharacterSpell = {
  spellId: string;
};

type CharacterEquipment = {
  items?: CharacterItem[];
  armor?: CharacterItem[];
  magicItems?: CharacterItem[];
  weapons?: CharacterItem[];
  magicWeapons: CharacterItem[];
};

type CharacterItem = {
  id: string;
  equipped: boolean;
  quantity: number;
};

export type CharacterSavingThrows = {
  strength: CharacterSavingThrow;
  dexterity: CharacterSavingThrow;
  constitution: CharacterSavingThrow;
  intelligence: CharacterSavingThrow;
  wisdom: CharacterSavingThrow;
  charisma: CharacterSavingThrow;
};

type CharacterSavingThrow = {
  proficient: boolean;
  expertise: boolean;
};

export type CharacterClass = {
  _id: string;
  className: string;
  classLevel: number;
  hitDie: number;
  classId: string;
  subclassName?: string;
  spellcasting: any[];
};

type CharacterStatBonus = {
  modifier: string;
  bonus: number;
  descriptions: string;
};

type CharacterStats = {
  race: CharacterRace;
  armorClass: number;
  speed: CharacterSpeed;
  abilityScores: CharacterAbilityScores;
  proficiencyBonus: number;
  skills: CharacterSkills;
  hitPoints: CharacterHitPoints;
  initiativeBonus: number;
  passivePerception: number;
  experience: number;
  actions: CharacterAbility[];
  bonusActions: CharacterAbility[];
  attacks: CharacterAttack[];
  additionalAbilities: CharacterAbility[];
  reactions: CharacterAbility[];
  spells: CharacterSpellCasting[];
  equipment: CharacterEquipment;
  proficiencies: string;
  savingThrows: CharacterSavingThrows;
  classes: CharacterClass[];
  wounds: [];
  statBonus: CharacterStatBonus[];
};

export type Character = {
  name: string;
  flavor: CharacterFlavor;
  stats: CharacterStats;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type NpcFlavor = {
  faction: string;
  environment: string;
  description: string;
  class: NpcClass;
  campaign: NpcCampaign[];
  portrait: CharacterPortrait;
  personality: string;
  traits: NpcTraits;
  appearance: string;
  backstory: string;
  alignment: string;
  race?: CharacterRace;
};

type NpcTraits = {
  gender: string;
  pronoun: string;
};

type NpcCampaign = {
  campaignId: string;
  unlocked: boolean;
};

type NpcClass = {
  name: string;
};

export type Npc = {
  name: string;
  flavor: NpcFlavor;
  stats: CharacterStats;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type SpellSlots = {
  classSpells?: CharacterSpell[];
  pactSpells?: CharacterSpell[];
};

export type InnateSpellCasting = {
  atWill?: string;
  perDay3?: string;
  perDay2?: string;
  perDay1?: string;
};

export type Spellcasters = {
  "00000": SpellcastersData;
  "5ed2b6f0dfd4d4a1adcbbba4": SpellcastersData;
  "5ec02407f44b2b688355a566": SpellcastersData;
  "5fe145ae267d9afc8e956c0f": SpellcastersData;
  "5f6630144af7eaef9120f98e": SpellcastersData;
  "5ec02fbcf44b2b688355aaeb": SpellcastersData;
  "6025567f9f3d039145e02731": SpellcastersData;
  "5ec030b0f44b2b688355ab60": SpellcastersData;
  "5ec03176f44b2b688355abb7": SpellcastersData;
  "615764cf69c41a2d46d7b23a": SpellcastersData;
  "5ea1843b8bfa3a13ac19cc07": SpellcastersData;
  "5ec03048f44b2b688355ab2c": SpellcastersData;
};

export type SpellcastersData = {
  name: string;
  components: SpellcasterComponents;
  ability?: string;
  level?: SpellcasterLevel;
  multiclassing?: SpellcasterMulticlassing;
};

type SpellcasterComponents = {
  material: boolean;
  somatic: boolean;
  verbal: boolean;
};

type SpellcasterLevel = {
  "1": SpellcastingLevel;
  "2": SpellcastingLevel;
  "3": SpellcastingLevel;
  "4": SpellcastingLevel;
  "5": SpellcastingLevel;
  "6": SpellcastingLevel;
  "7": SpellcastingLevel;
  "8": SpellcastingLevel;
  "9": SpellcastingLevel;
  "10": SpellcastingLevel;
  "11": SpellcastingLevel;
  "12": SpellcastingLevel;
  "13": SpellcastingLevel;
  "14": SpellcastingLevel;
  "15": SpellcastingLevel;
  "16": SpellcastingLevel;
  "17": SpellcastingLevel;
  "18": SpellcastingLevel;
  "19": SpellcastingLevel;
  "20": SpellcastingLevel;
};

type SpellcastingLevel = {
  spellSlots: number[];
  cantripsKnown: number;
  spellsKnown: number;
};

type SpellcasterMulticlassing = {
  type: string;
};

export type GetStatBonus = {
  base: number;
  bonus: number;
  bonusList: any[];
  total: number;
};

export type Creature = Character | Npc;
