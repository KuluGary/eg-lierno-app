import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { HTMLEditor } from "components/HTMLEditor/HTMLEditor";
import { useState, useEffect } from "react";
import Api from "services/api";

export function Details({ campaign, setCampaign }) {
  const [characterOptions, setCharacterOptions] = useState([]);

  useEffect(() => {
    campaign?.players
      ?.filter(({ active }) => active === true)
      .forEach(async ({ id }) => {
        const apiCharacters = await Api.fetchInternal(`/user/${id}/characters`);

        setCharacterOptions((chars) => new Set([...chars, ...apiCharacters]));
      });
  }, []);

  const addNewPlayer = (e) => {
    setCampaign("players", [...campaign?.players, { id: null, email: e.target.value, active: false }]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item laptop={12}>
        <Typography variant="h3">Detalles básicos de la campaña</Typography>
        <Typography variant="subtitle1" sx={{ marginTop: "1em" }}>
          Por favor, introduce los detalles básicos referentes a tu campaña.
        </Typography>
      </Grid>
      <Grid item laptop={6}>
        <TextField
          fullWidth
          placeholder="Nombre de campaña"
          value={campaign?.name}
          onChange={(e) => setCampaign("name", e.target.value)}
        />
      </Grid>
      <Grid item laptop={3}>
        <FormControl fullWidth>
          <Select
            labelId="game-select-label"
            id="game-select"
            value={campaign?.flavor?.game ?? "D&D 5e"}
            onChange={(e) => setCampaign("flavor.game", e.target.value)}
          >
            {["D&D 5e"].map((game, index) => (
              <MenuItem key={index} value={game}>
                {game}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item laptop={3}>
        <FormControlLabel
          control={
            <Checkbox
              inputProps={{ "aria-label": "¿Con competencia?" }}
              checked={campaign?.completed ?? false}
              onChange={() => setCampaign("completed", !campaign?.completed)}
            />
          }
          label="¿Partida finalizada?"
        />
      </Grid>
      <Grid item laptop={12}>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          multiple
          options={[]}
          disableClearable
          renderTags={(tagValue) =>
            tagValue.map((option, index) => (
              <Chip key={index} variant="outlined" label={`${option.email} (${option.active ? "" : "pendiente"})`} />
            ))
          }
          value={campaign?.players}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Añadir jugadores..."}
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
          onChange={addNewPlayer}
        />
      </Grid>
      {campaign?.players?.some(({ active }) => active === true) && (
        <Grid item laptop={12}>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            multiple
            options={characterOptions}
            getOptionLabel={(option) => `${option.name}`}
            value={campaign?.characters}
            renderInput={(params) => <TextField {...params} label={"Añadir jugadores..."} />}
            onChange={addNewPlayer}
          />
        </Grid>
      )}
      <Grid item laptop={12}>
        <HTMLEditor
          multiline
          fullWidth
          label="Sinopsis de la campaña"
          value={campaign.flavor?.synopsis ?? ""}
          onChange={(content) => setCampaign("flavor.synopsis", content)}
        />
      </Grid>
    </Grid>
  );
}
