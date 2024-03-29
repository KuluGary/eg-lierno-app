import { Box, Divider, Typography } from "@mui/material";
import { Link } from "components/Link/Link";

export default function NotFound() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: (t) => t.palette.background.container,
        // color: (t) => t.palette.primary.contrastText,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Typography variant="h3" color="background.contrastText">
          404
        </Typography>
        <Divider />
        <Typography variant="subtitle1" color="background.contrastText">
          No se ha podido encontrar la página.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", marginBlock: 1 }}>
          <Link href="/">
            <Typography variant="subtitle2">Volver al inicio</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
