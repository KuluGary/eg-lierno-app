import { Box, Button, Typography } from "@mui/material";
import { getSession, signIn } from "next-auth/react";
import { Link } from "../components";

export default function Home() {
  return (
    <Box>
      <Box sx={style.hero}>
        <Typography component="h1" variant="h3" color="primary.contrastText" sx={style.h1}>
          {"Gestiona tus partidas de "}
          <Box component="span">{"D&D"}</Box>
        </Typography>
        <Typography component="subtitle1" color="primary.contrastText">
          {"Organiza y ten al alcance de tu mano toda la información que necesitas para tus sesiones de D&D"}
        </Typography>
        <Box sx={style.buttonContainer}>
          <Link href="/register">
            <Button size="large" variant="contained">
              Prueba Lierno App
            </Button>
          </Link>
          <Link
            href={"/api/auth/signing"}
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            <Button size="large" variant="outlined" color="background">
              Accede con tu cuenta
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession({ ctx });

  if (!session) return { props: {} };

  return {
    redirect: {
      permanent: true,
      destination: "/characters",
    },
  };
}

const style = {
  hero: {
    position: "relative",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage: "url(art/home-bg.jfif)",
      backgroundRepeat: "no-repeat",
      backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "brightness(60%)",
      zIndex: -1,
    },
  },
  h1: {
    maxWidth: "30ch",
    textAlign: "center",
  },
  buttonContainer: {
    marginBlock: "2em",
    display: "flex",
    gap: "2em",
  },
};
