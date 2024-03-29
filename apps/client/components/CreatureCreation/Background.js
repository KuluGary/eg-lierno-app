import { Grid, TextField, Typography } from "@mui/material";
import { HTMLEditor } from "components/HTMLEditor/HTMLEditor";

export default function Background({ creature, setCreature }) {
  return (
    <Grid container spacing={3}>
      <Grid item laptop={12}>
        <Typography variant="h3">Trasfondo de tu personaje</Typography>
        <Typography variant="subtitle1" sx={{ marginTop: "1em" }}>
          Por favor, introduce los detalles del trasfondo de tu personaje.
        </Typography>
      </Grid>
      <Grid item laptop={12}>
        <TextField
          fullWidth
          placeholder="Nombre del trasfondo"
          value={creature?.flavor.background?.name}
          onChange={(e) => setCreature("flavor.background.name", e.target.value)}
        />
      </Grid>
      <Grid item laptop={12}>
        <HTMLEditor
          fullWidth
          multiline
          label="Descripción del trasfondo"
          value={creature?.flavor.background?.description ?? ""}
          onChange={(content) => {
            setCreature("flavor.background.description", content);
          }}
        />
      </Grid>
      <Grid item laptop={12}>
        <HTMLEditor
          fullWidth
          multiline
          label="Rasgos del trasfondo"
          value={creature?.flavor.background?.trait ?? ""}
          onChange={(content) => {
            setCreature("flavor.background.trait", content);
          }}
        />
      </Grid>
    </Grid>
  );
}
