import { Box, Button, ButtonBase, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Avatar, Container, Layout } from "components";
import Api from "services/api";
import { getToken } from "next-auth/jwt";
import { background, primary } from "services/theme";
import ColorModeContext from "services/color-context";
import { useContext } from "react";
import { Check } from "@mui/icons-material";

export default function Settings({ user }) {
  const themeEditor = useContext(ColorModeContext);
  const selectedBackground = localStorage.getItem("background");
  const selectedColor = localStorage.getItem("primary");
  const getISODate = (date) => {
    const d = new Date(date);

    return d.toLocaleDateString("es-ES");
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h3">Ajustes</Typography>
      </Container>
      <Container sx={{ marginTop: "1rem" }}>
        <Grid container spacing={1}>
          <Grid item laptop={4}>
            <Container noPadding>
              <Box sx={{ margin: "1rem", display: "flex", alignItems: "center", gap: "1em" }}>
                <Avatar src={user.metadata.avatar} />
                <Typography>{user.username}</Typography>
              </Box>
              <Divider />
              <List>
                {user.metadata.first_name && user.metadata.last_name && (
                  <ListItem>
                    <ListItemText
                      primary={`${user.metadata.first_name} ${user.metadata.last_name}`}
                      secondary={"Nombre"}
                    />
                  </ListItem>
                )}
                {user.metadata.email && (
                  <ListItem>
                    <ListItemText primary={user.metadata.email} secondary={"Email"} />
                  </ListItem>
                )}
                {user.createdAt && (
                  <ListItem>
                    <ListItemText primary={getISODate(user.createdAt)} secondary={"Fecha de creación"} />
                  </ListItem>
                )}
                {user.metadata.location && (
                  <ListItem>
                    <ListItemText primary={user.metadata.location} secondary={"Ubicación"} />
                  </ListItem>
                )}
              </List>
            </Container>
          </Grid>
          <Grid item laptop={8}>
            <Container noPadding>
              <Box sx={{ margin: "1rem" }}>
                <Typography variant="h4">Personaliza tu visualización</Typography>
                <Typography variant="subtitle1">
                  Esta configuración afecta a todas las cuentas de Twitter en este navegador.
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ padding: "0 4rem" }}>
                <Container sx={{ marginBlock: "1em" }}>
                  <Typography variant="h4">Prueba las tipografías</Typography>
                  <Typography variant="body1">
                    Un jugoso zumo de piña y kiwi bien frío es exquisito y no lleva alcohol.
                  </Typography>
                  <Button sx={{ display: "block", margin: "2em auto 1em auto" }} color="primary" variant="outlined">
                    Botón de prueba
                  </Button>
                </Container>
                <Typography variant="overline">Fondo</Typography>
                <Container
                  sx={{
                    marginBottom: "1em",
                    backgroundColor: (theme) => theme.palette.background.dark,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      gap: 5,
                    }}
                  >
                    {background.map(({ type, color }, i) => {
                      const isSelected = selectedBackground
                        ? JSON.parse(selectedBackground).background === color
                        : background[0] === color;

                      return (
                        <ButtonBase
                          key={i}
                          onClick={() => themeEditor.changeBackgroundColor(color, type)}
                          sx={{
                            backgroundColor: color,
                            borderRadius: "100vw",
                            height: "5em",
                            width: "5em",
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          {isSelected && <Check fontSize="large" />}
                        </ButtonBase>
                      );
                    })}
                  </Box>
                </Container>
                <Typography variant="overline">Color</Typography>
                <Container
                  sx={{
                    marginBottom: "1em",
                    backgroundColor: (theme) => theme.palette.background.dark,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      flexWrap: "wrap",
                      gap: 5,
                    }}
                  >
                    {primary.map((color, i) => {
                      const isSelected = selectedColor
                        ? JSON.parse(selectedColor).main === color
                        : primary[0] === color;

                      return (
                        <ButtonBase
                          key={i}
                          onClick={() => themeEditor.changePrimaryColor(color)}
                          sx={{
                            backgroundColor: color,
                            borderRadius: "100vw",
                            height: "5em",
                            width: "5em",
                            border: (theme) => `2px solid ${theme.palette.divider}`,
                          }}
                        >
                          {isSelected && <Check fontSize="large" />}
                        </ButtonBase>
                      );
                    })}
                  </Box>
                </Container>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const secret = process.env.SECRET;

  const token = await getToken({ req, secret, raw: true }).catch((e) => console.error(e));

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: true,
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const user = await Api.fetchInternal("/auth/user", { headers });

  if (!user) return { notFound: true };

  return {
    props: { user },
  };
}
