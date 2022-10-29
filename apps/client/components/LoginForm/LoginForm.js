import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { getProviders } from "next-auth/react";
import style from "./LoginForm.style.js";
import { Link } from "components/Link/Link.js";
import { Divider } from "@mui/material";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [providers, setProviders] = useState({});
  const [loading, setLoading] = useState(false);
  const errorMessages = {
    username: "Este no es un nombre de usuario válido. Por favor, asegúrate que el email que introduces es correcto.",
    password:
      "Esta contraseña no es válida, por favor asegúrate de que tu contraseña tiene al menos un número, una letra mayúscula y minúscula, un carácter especial y tiene entre 6 y 20 carácteres.",
  };

  useEffect(() => {
    if (Object.keys(providers).length === 0) {
      getAllProviders();
    }
  }, []);

  const getAllProviders = async () => {
    const newProviders = await getProviders();

    setProviders(newProviders);
  };

  const hasErrors = () =>
    Object.values(errors).some((el) => el.length > 0) || Object.values(credentials).some((el) => el.length === 0);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    signIn("credentials", credentials);
  };

  return (
    <Paper elevation={10} sx={style.formContainer}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Typography variant="h3" sx={style.formTitle}>
          Accede a Lierno App
        </Typography>
        <TextField
          sx={style.formField}
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
          sx={style.formField}
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
          sx={{ display: "block", p: 1, maxWidth: "50%", margin: "1em auto" }}
          disabled={hasErrors() || loading}
        >
          {loading ? <CircularProgress size={25} /> : "Entrar"}
        </Button>
      </Box>
      <Box component="div" width="100%" mt="1em" mb="1em">
        <Divider>O</Divider>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        {Object.values(providers || {})
          .filter((provider) => provider.id !== "credentials")
          .map((provider) => (
            <Box component="div" key={provider.name} sx={{ margin: "1em 0" }}>
              <Button
                variant="outlined"
                onClick={() => signIn(provider.id)}
                sx={{ pt: ".15em", pb: ".15em", pl: ".15em" }}
                startIcon={<Box component="img" src={"icons/btn_google_light_normal_ios.svg"} />}
              >
                Accede con {provider.name}
              </Button>
            </Box>
          ))}
      </Box>
      <Box sx={style.formFooter}>
        <Link href="/register" color="primary" variant="body2">
          {"¿No tienes una cuenta?"}
        </Link>
      </Box>
    </Paper>
  );
};

export default LoginForm;
