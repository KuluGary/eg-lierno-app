import {
  Grid,
  Typography,
  InputBase,
  Divider,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Box,
  ListSubheader,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Close } from "@mui/icons-material";
import { Container, HTMLEditor } from "components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { skills, saves } from "../../helpers/json/customizable_stats.json";
import { getModifier, getStatBonus } from "@lierno/dnd-helpers";
import { getOperatorString } from "@lierno/core-helpers";

const scoreBonusOptions = [
  {
    label: "Estadísticas",
    children: Object.entries(saves).map(([key, { name }]) => ({ label: name, key: "stats.abilityScores." + key })),
  },
  {
    label: "Habilidades",
    children: Object.entries(skills).map(([key, { name }]) => ({ label: name, key: "stats.skills." + key })),
  },
  {
    label: "Otros",
    children: [
      { label: "Clase de armadura", key: "stats.armorClass" },
      { label: "Bono de iniciativa", key: "stats.initiativeBonus" },
      { label: "Percepción pasiva", key: "stats.passivePerception" },
      { label: "Investigación pasiva", key: "stats.passiveInvestigation" },
      { label: "Puntos de vida", key: "stats.hitPoints.max" },
    ],
  },
];

const statLabels = {
  strength: "FUE",
  dexterity: "DES",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "SAB",
  charisma: "CAR",
};

export function Stats({ creature, setCreature }) {
  const router = useRouter();
  const isCharacter = router.pathname.includes("characters");

  return (
    <Grid container spacing={3}>
      <Grid item laptop={12}>
        <Typography variant="h3">Detalles de las estadísticas de personaje</Typography>
        <Typography variant="subtitle1" sx={{ marginTop: "1em" }}>
          Selecciona los datos referentes a las estadísticas de tu personaje.
        </Typography>
      </Grid>
      <Grid item laptop={isCharacter ? 8 : 6}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="button">VELOCIDAD</Typography>
          </Box>
          <Grid item laptop={12} container spacing={3}>
            <Grid
              item
              laptop={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">A PIE</Typography>
              <Container>
                <InputBase
                  type="number"
                  inputProps={{ step: 5, style: { textAlign: "center" } }}
                  value={creature?.stats.speed.land ?? creature?.stats.speed}
                  onChange={(e) => setCreature("stats.speed.land", parseInt(e.target.value))}
                />
              </Container>
            </Grid>
            <Grid
              item
              laptop={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">NADANDO</Typography>
              <Container>
                <InputBase
                  type="number"
                  inputProps={{ step: 5, style: { textAlign: "center" } }}
                  value={creature?.stats.speed.swim ?? 0}
                  onChange={(e) => setCreature("stats.speed.swim", parseInt(e.target.value))}
                />
              </Container>
            </Grid>
            <Grid
              item
              laptop={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">VOLANDO</Typography>
              <Container>
                <InputBase
                  type="number"
                  inputProps={{ step: 5, style: { textAlign: "center" } }}
                  value={creature?.stats.speed.air ?? 0}
                  onChange={(e) => setCreature("stats.speed.air", parseInt(e.target.value))}
                />
              </Container>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      {!isCharacter && (
        <Grid item laptop={isCharacter ? 4 : 3}>
          <Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="button">CLASE</Typography>
              <Typography variant="overline">DE DESAFÍO</Typography>
              <Container>
                <InputBase
                  type="number"
                  value={creature.stats?.challengeRating}
                  inputProps={{ min: 0, max: 50, step: 0.25, style: { textAlign: "center" } }}
                  onChange={(e) => {
                    let newValue = parseFloat(e.target.value);
                    let oldValue = creature.stats.challengeRating;

                    if (newValue > 1) {
                      if (newValue > oldValue) {
                        newValue = Math.ceil(newValue);
                      } else {
                        newValue = Math.floor(newValue);
                      }
                    } else {
                      if (newValue === 0.75) {
                        if (newValue > oldValue) {
                          newValue = 1;
                        } else {
                          newValue = 0.5;
                        }
                      }
                    }

                    setCreature("stats.challengeRating", newValue);
                  }}
                />
              </Container>
            </Box>
          </Container>
        </Grid>
      )}
      <Grid item laptop={isCharacter ? 4 : 3}>
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="button">CLASE</Typography>
            <Typography variant="overline">DE ARMADURA</Typography>
            <Container>
              <InputBase
                type="number"
                inputProps={{ min: 5, style: { textAlign: "center" } }}
                value={creature?.stats.armorClass}
                onChange={(e) => setCreature("stats.armorClass", parseInt(e.target.value))}
              />
            </Container>
          </Box>
        </Container>
      </Grid>
      <Grid item laptop={12}>
        <Container>
          <Grid container spacing={3}>
            <Grid item laptop={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="button">Puntuación de característica</Typography>
              </Box>
            </Grid>
            {Object.keys(creature.stats?.abilityScores)?.map((key, index) => {
              const label = statLabels[key];
              const value = creature.stats.abilityScores[key];

              return (
                <Grid
                  item
                  laptop={2}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="button">{label}</Typography>
                  <Container sx={{ marginTop: "1em" }}>
                    <InputBase
                      value={value}
                      type="number"
                      inputProps={{ min: 0, style: { textAlign: "center" } }}
                      onChange={(e) => setCreature("stats.abilityScores." + key, parseInt(e.target.value))}
                    />
                  </Container>
                </Grid>
              );
            })}
            <Grid item laptop={12} sx={{}}>
              <Divider sx={{ mb: "1em" }} />
              {creature?.stats.statBonus?.map(({ modifier, bonus, descriptions }, index) => (
                <Grid key={index} item laptop={12} container spacing={3}>
                  <Grid item laptop={8}>
                    <FormControl fullWidth>
                      <Select
                        labelId="hitDie-select-label"
                        id="hitDie-select"
                        value={modifier}
                        onChange={(e) => {
                          const newBonuses = [...creature?.stats.statBonus];
                          newBonuses[index].modifier = e.target.value;

                          setCreature("stats.statBonus", newBonuses);
                        }}
                      >
                        {scoreBonusOptions.map(({ label, children }, index) => [
                          <Divider textAlign="center">
                            <ListSubheader sx={{ fontWeight: "bold", backgroundColor: "transparent" }}>
                              {label}
                            </ListSubheader>
                          </Divider>,
                          ...children.map(({ label, key }, index) => (
                            <MenuItem value={key} key={key}>
                              {label}
                            </MenuItem>
                          )),
                        ])}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item laptop={3}>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="Bonificador"
                      InputProps={{ inputProps: { min: 1, max: 20 }, style: { textAlign: "center" } }}
                      value={bonus}
                      onChange={(e) => {
                        const newBonuses = [...creature?.stats.statBonus];
                        newBonuses[index].bonus = parseInt(e.target.value);

                        setCreature("stats.statBonus", newBonuses);
                      }}
                    />
                  </Grid>
                  <Grid item laptop={1} sx={{ display: "flex", justifyContent: "center" }}>
                    <IconButton
                      onClick={() => {
                        const newBonuses = [...creature?.stats.statBonus];
                        newBonuses.splice(index, 1);

                        setCreature("stats.statBonus", newBonuses);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                  <Grid item laptop={12}>
                    <HTMLEditor
                      fullWidth
                      placeholder="Causa del modificador"
                      value={descriptions ?? ""}
                      onChange={(content) => {
                        const newBonuses = [...creature?.stats.statBonus];
                        newBonuses[index].descriptions = content;

                        setCreature("stats.statBonus", newBonuses);
                      }}
                    />
                  </Grid>
                  <Grid item laptop={12}>
                    <Divider sx={{ mb: "1em" }} />
                  </Grid>
                </Grid>
              ))}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  sx={{ margin: "0 auto" }}
                  onClick={() => {
                    const newBonuses = [
                      ...(creature?.stats?.statBonus ?? []),
                      {
                        modifier: "stats.abilityScores.strength",
                        bonus: 1,
                        descriptions: "",
                      },
                    ];

                    setCreature("stats.statBonus", newBonuses);
                  }}
                >
                  <AddIcon sx={{ marginRight: "1em" }} />
                  Añadir bonificador a las características
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      {!isCharacter && (
        <Grid item laptop={4}>
          <Container sx={{ height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="button">DADOS DE GOLPE</Typography>
            </Box>
            <Grid item laptop={12} container spacing={2}>
              <Grid
                item
                laptop={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="overline">NÚMERO</Typography>
                <Container>
                  <InputBase
                    type="number"
                    inputProps={{ min: 1, max: 999, step: 1, style: { textAlign: "center" } }}
                    value={creature?.stats.hitDie?.num ?? 0}
                    onChange={(e) => setCreature("stats.hitDie.num", parseInt(e.target.value))}
                  />
                </Container>
              </Grid>
              <Grid
                item
                laptop={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="overline">TAMAÑO</Typography>
                <Container>
                  <InputBase
                    type="number"
                    inputProps={{ min: 4, max: 12, step: 2, style: { textAlign: "center" } }}
                    value={creature?.stats.hitDie?.size ?? 0}
                    onChange={(e) => setCreature("stats.hitDie.size", parseInt(e.target.value))}
                  />
                </Container>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      )}
      <Grid item laptop={isCharacter ? 12 : 8}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="button">PUNTOS DE VIDA</Typography>
          </Box>
          <Grid item laptop={12} container spacing={3}>
            <Grid
              item
              laptop={isCharacter ? 2 : 3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">MÁXIMOS</Typography>
              <Container>
                <InputBase
                  type="number"
                  inputProps={{ min: 1, max: 999, style: { textAlign: "center" } }}
                  value={creature?.stats.hitPoints.max ?? 0}
                  onChange={(e) => setCreature("stats.hitPoints.max", parseInt(e.target.value))}
                />
              </Container>
            </Grid>
            <Grid
              item
              laptop={isCharacter ? 2 : 3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">ACTUALES</Typography>
              <Container>
                <InputBase
                  type="number"
                  inputProps={{ min: 1, max: creature?.stats.hitPoints.max ?? 999, style: { textAlign: "center" } }}
                  value={creature?.stats.hitPoints.current ?? creature?.stats.hitPoints.max ?? 0}
                  onChange={(e) => setCreature("stats.hitPoints.current", parseInt(e.target.value))}
                />
              </Container>
            </Grid>
            <Grid
              item
              laptop={isCharacter ? 2 : 3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">TEMPORALES</Typography>
              <Container>
                <InputBase
                  type="number"
                  inputProps={{ min: 1, max: 999, style: { textAlign: "center" } }}
                  value={creature?.stats.hitPoints.temporal ?? 0}
                  onChange={(e) => setCreature("stats.hitPoints.temporal", parseInt(e.target.value))}
                />
              </Container>
            </Grid>
            <Grid
              item
              laptop={isCharacter ? 6 : 3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="overline">CALCULAR</Typography>
              <Container>
                <Button
                  onClick={() => {
                    const { total: conTotal } = getStatBonus(`stats.abilityScores.constitution`, creature);
                    const { bonus: hitPointBonus } = getStatBonus(`stats.hitPoints.max`, creature);

                    const conModifier = getModifier(conTotal);
                    const modifiers = [];

                    if (isCharacter) {
                      creature.stats.classes.forEach(({ classLevel, hitDie }) => {
                        for (let index = 0; index < classLevel; index++) {
                          if (index === 0) {
                            modifiers.push(hitDie + conModifier);
                          } else {
                            modifiers.push(hitDie / 2 + 1 + conModifier);
                          }
                        }
                      });
                    } else {
                      const { num, size } = creature?.stats.hitDie;

                      for (let index = 0; index < num; index++) {
                        if (index === 0) {
                          modifiers.push(size + conModifier);
                        } else {
                          modifiers.push(size / 2 + 1 + conModifier);
                        }
                      }
                    }
                    const newMaxHitPoints = modifiers.reduce((a, b) => a + b) + hitPointBonus;

                    setCreature("stats.hitPoints.max", newMaxHitPoints);
                  }}
                >
                  <FontAwesomeIcon size="lg" icon={faDice} style={{}} />
                  {isCharacter && (
                    <Box sx={{ marginLeft: "1em" }}>
                      {`${creature?.stats.classes
                        ?.map(({ classLevel, hitDie }) => `${classLevel}d${hitDie}`)
                        .join(" + ")} ${getOperatorString(
                        getModifier(creature?.stats.abilityScores.constitution)
                      )} puntos de vida`}
                    </Box>
                  )}
                </Button>
              </Container>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}
