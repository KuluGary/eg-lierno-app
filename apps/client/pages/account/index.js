import { Check } from "@mui/icons-material";
import { Box, Button, ButtonBase, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Avatar } from "components/Avatar/Avatar";
import Container from "components/Container/Container";
import Layout from "components/Layout/Layout";

import { getToken } from "next-auth/jwt";
import { useContext, useMemo } from "react";
import Api from "services/api";
import ColorModeContext from "services/color-context";
import { background, primary } from "services/theme";

export default function Settings({}) {
  const themeEditor = useContext(ColorModeContext);
  const selectedBackground = useMemo(() => {
    if (typeof window !== "undefined") return localStorage.getItem("background");

    return "";
  });
  const selectedColor = useMemo(() => {
    if (typeof window !== "undefined") return localStorage.getItem("primary");

    return "";
  });

  return (
    <Layout>
      <Container>
        <Typography variant="h3">Ajustes</Typography>
      </Container>
      <Container sx={{ marginTop: "1rem" }}>
        <Grid container spacing={1}>
          <Grid item laptop={12}>
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
                    {background.map(({ mode, background }, i) => {
                      const isSelected = selectedBackground
                        ? JSON.parse(selectedBackground).background === background
                        : background[0] === background;

                      return (
                        <ButtonBase
                          key={i}
                          onClick={() => themeEditor.changeBackgroundColor(background, mode)}
                          sx={{
                            backgroundColor: background,
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

// export async function getServerSideProps(context) {
//   const { req } = context;
//   const secret = process.env.SECRET;

//   const token = await getToken({ req, secret, raw: true }).catch((e) => console.error(e));

//   const headers = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     withCredentials: true,
//   };

//   if (token) {
//     headers["Authorization"] = "Bearer " + token;
//   }

//   const user = await Api.fetchInternal("/auth/user", { headers });

//   if (!user) return { notFound: true };

//   return {
//     props: { user },
//   };
// }
