import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { Copyright } from "components/Copyright/Copyright";
import { Link } from "components/Link/Link";
import { StringUtil } from "helpers/string-util";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Api from "services/api";

export default function Register() {
  const regex = StringUtil.regex;
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    metadata: { email: "" },
  });
  const errorMessages = {
    username: "Este no es un nombre de usuario válido. Asegúrate de que al menos tenga 3 carácteres.",
    password:
      "Esta contraseña no es válida, por favor asegúrate de que tu contraseña tiene 6 carácteres sin espacios.",
    metadata: {
      email: "Este no es un email válido. Por favor, asegúrate que el email que introduces es correcto.",
    },
  };

  const handleChange = (e) => {
    const { value, attributes } = e.target;
    const id = attributes.id.value;

    if (!!regex[id]) {
      if (!regex[id].test(value)) {
        if (id in credentials) {
          setErrors({ ...errors, [id]: errorMessages[id] });
        } else {
          setErrors({ ...errors, metadata: { ...errors.metadata, [id]: errorMessages.metadata[id] } });
        }
      } else {
        if (id in credentials) {
          setErrors({ ...errors, [id]: "" });
        } else {
          setErrors({ ...errors, metadata: { ...errors.metadata, [id]: "" } });
        }
      }
    }

    if (id in credentials) {
      setCredentials({ ...credentials, [id]: value });
    } else {
      setCredentials({ ...credentials, metadata: { ...credentials.metadata, [id]: value } });
    }
  };

  const hasErrors = () =>
    errors["username"].length > 0 ||
    errors["password"].length > 0 ||
    errors["metadata"]["email"].length > 0 ||
    !credentials["username"].length > 0 ||
    !credentials["password"].length > 0 ||
    !credentials["metadata"]["email"].length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    Api.fetchInternal("/user/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => {
        toast.success(res.message);
        Router.push("/");
      })
      .catch((err) => toast.error(err.toString()));
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Head>
        <title>Lierno App | Registrarse</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid
        item
        mobile={false}
        tablet={4}
        laptop={6}
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(art/login-bg.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item mobile={12} tablet={8} laptop={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h3">Regístrate en Lierno App</Typography>
          <Typography component="div" variant="subtitle2" textAlign="center" marginTop=".5em">
            En Lierno App podrás llevar la cuenta de tus personajes y campañas de forma fácil e intuitiva.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: "60%" }}>
            <Grid container spacing={2}>
              <Grid item mobile={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Cuenta de email"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  error={!!errors["metadata"]["email"]}
                  helperText={errors["metadata"]["email"]}
                />
              </Grid>
              <Grid item mobile={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Nombre de usuario"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={handleChange}
                  error={!!errors["username"]}
                  helperText={errors["username"]}
                />
              </Grid>
              <Grid item mobile={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  error={!!errors["password"]}
                  helperText={errors["password"]}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="outlined" sx={{ marginBlock: 3, p: 1 }} disabled={hasErrors()}>
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  ¿Ya tienes una cuenta? Entrar
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Grid>
    </Grid>
  );
}
