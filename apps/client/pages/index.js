import { AccountCircle, Explore, MenuBook } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { NavBar } from "components";
import LoginForm from "components/LoginForm/LoginForm";

export default function Home() {
  return (
    <Box>
      <NavBar />
      <Box sx={style.hero}>
        <Typography variant="h1" color="primary.contrastText" sx={style.title}>
          {"Gestiona tus partidas de "}
          <Box component="span" sx={style.accentTitle}>
            {"D&D"}
          </Box>
        </Typography>
        <Typography sx={style.subtitle} component="subtitle1" color="primary.contrastText">
          {"Organiza y ten al alcance de tu mano toda la información que necesitas para tus sesiones de D&D"}
        </Typography>
      </Box>
      <Box sx={style.section}>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0.00,49.98 C150.00,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
        </svg>
        <Box component="ul" sx={style.sectionList}>
          <Box component="li">
            <AccountCircle />
            <Typography variant="body1">Crea, modifica y descarga las fichas de tus personajes.</Typography>
          </Box>
          <Box component="li">
            <MenuBook />
            <Typography variant="body1">Gestiona tus campañas con notas, mapas y un historial de mensajes.</Typography>
          </Box>
          <Box component="li">
            <Explore />
            <Typography variant="body1">Accede a una referencia rápida de hechizos, objetos y condiciones.</Typography>
          </Box>
        </Box>

        <Box sx={style.formContainer}>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
}

const style = {
  hero: {
    position: "relative",
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "10vw",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage: "url(art/home-bg.jfif)",
      backgroundRepeat: "no-repeat",
      backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "brightness(40%)",
      zIndex: -1,
    },
  },
  title: {
    maxWidth: { tablet: "30vw", laptop: "80vw" },
  },
  accentTitle: {
    color: (t) => t.palette.primary.main,
  },
  subtitle: {
    maxWidth: { laptop: "40vw", tablet: "80vw" },
  },
  sectionList: {
    listStyleType: "none",
    marginTop: "-10rem",
    "& li": {
      display: "flex",
      gap: 3,
      marginBlock: "1.5em",
      color: (t) => t.palette.background.contrastText,
    },
  },
  buttonContainer: {
    marginBlock: "2em",
    display: "flex",
    gap: "2em",
  },
  section: (theme) => ({
    position: "relative",
    backgroundColor: theme.palette.background.main,
    minHeight: "50vh",
    "& > svg": {
      transform: "translateY(-100%)",
      height: "100%",
      width: "100%",
      height: 150,

      "& path": {
        stroke: "none",
        fill: theme.palette.background.main,
      },
    },
  }),
  formContainer: {
    position: {
      laptop: "absolute",
      tablet: "relative",
    },
    right: "7vw",
    top: 0,
    maxWidth: {
      laptop: "30vw",
      tablet: "5100vw",
    },
    transform: {
      laptop: "translateY(-70%)",
      tablet: "none",
    },
  },
};
