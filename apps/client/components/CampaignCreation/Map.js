import { Grid, TextField, Typography } from "@mui/material";

export function Map({ campaign, setCampaign }) {
  return (
    <Grid container spacing={3}>
      <Grid item laptop={12}>
        <Typography variant="h3">Incluye el mapa de tu campaña</Typography>
        <Typography variant="subtitle1" sx={{ marginTop: "1em" }}>
          Por favor, introduce la URL al mapa de tu campaña.
        </Typography>
      </Grid>
      <Grid item laptop={12}>
        <TextField
          fullWidth
          label="URL de tu mapa"
          value={campaign.flavor?.map ?? ""}
          onChange={(e) => setCampaign("flavor.map", e.target.value)}
        />
      </Grid>
      <Grid item laptop={12}>
        {!!campaign?.flavor.map && (
          <iframe style={{ width: "100%", minHeight: "40vh", border: "none" }} src={campaign.flavor.map} />
        )}
      </Grid>
    </Grid>
  );
}
