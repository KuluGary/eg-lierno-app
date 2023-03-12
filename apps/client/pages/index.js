import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@mui/material";
import { Avatar, Box, Button, CircularProgress, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { Copyright } from "components/Copyright/Copyright";
import { Link } from "components/Link/Link";
import { StringUtil } from "helpers/string-util";
import { getProviders, getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

export default function Login({ providers }) {
  const regex = StringUtil.regex;
  const theme = useTheme();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const errorMessages = {
    username: "Este no es un nombre de usuario válido. Por favor, asegúrate que el email que introduces es correcto.",
    password:
      "Esta contraseña no es válida, por favor asegúrate de que tu contraseña tiene al menos un número, una letra mayúscula y minúscula, un carácter especial y tiene entre 6 y 20 carácteres.",
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (!!regex[name]) {
      if (!regex[name].test(value)) {
        setErrors({ ...errors, [name]: errorMessages[name] });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }

    setCredentials({ ...credentials, [name]: value });
  };

  const hasErrors = () =>
    Object.values(errors).some((el) => el.length > 0) || Object.values(credentials).some((el) => el.length === 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    signIn("credentials", credentials);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Head>
        <title>Lierno App | Entrar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid item mobile={0} tablet={4} laptop={6} sx={style.imageContainer} />
      <Grid item mobile={12} tablet={8} laptop={6} component={Paper} elevation={6} square>
        <Box sx={style.rightContainer}>
          <Avatar sx={style.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h3">Accede a Lierno App</Typography>
          <Typography component="div" variant="subtitle2" textAlign="center" marginTop=".5em">
            En Lierno App podrás llevar la cuenta de tus personajes y campañas de forma fácil e intuitiva.
          </Typography>
          {Object.values(providers || {})
            .filter((provider) => provider.id !== "credentials")
            .map((provider) => (
              <Box component="div" key={provider.name} sx={{ margin: "1em 0" }}>
                <Button
                  variant="outlined"
                  onClick={() => signIn(provider.id)}
                  sx={style.googleButton}
                  startIcon={<Box component="img" src={"icons/btn_google_light_normal_ios.svg"} />}
                >
                  Accede con {provider.name}
                </Button>
              </Box>
            ))}
          <Box component="div" width="60%">
            <Divider>o con tu email</Divider>
          </Box>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={style.formContainer}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="email"
              autoFocus
              error={!!errors.username}
              onChange={handleChange}
              helperText={errors["username"]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              onChange={handleChange}
              helperText={errors["password"]}
            />
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={style.submitButton}
              disabled={hasErrors() || loading}
            >
              {loading ? <CircularProgress size={25} /> : "Entrar"}
            </Button>
            <Box sx={style.formFooter}>
              <Link href="#" variant="body2">
                Recuperar contraseña
              </Link>
              <Link href="/register" color="primary" variant="body2">
                {"¿No tienes una cuenta?"}
              </Link>
            </Box>
            <Copyright sx={style.copyright} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

const style = {
  imageContainer: {
    background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(art/login-bg.jpg)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  rightContainer: {
    my: 8,
    mx: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    m: 1,
    bgcolor: "primary.main",
  },
  googleButton: {
    pt: ".15em",
    pb: ".15em",
    pl: ".15em",
  },
  formContainer: {
    mt: 1,
    width: "70%",
  },
  submitButton: {
    marginBlock: 3,
    p: 1,
  },
  formFooter: {
    display: "flex",
    justifyContent: "space-around",
  },
  copyright: {
    mt: 5,
  },
};

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const { req } = context;

  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/characters" },
    };
  }

  return {
    props: { providers },
  };
}
