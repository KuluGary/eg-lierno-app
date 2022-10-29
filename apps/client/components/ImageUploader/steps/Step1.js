import { isValidUrl } from "@lierno/core-helpers";
import { Box, TextField, useTheme } from "@mui/material";
import { Container } from "components";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

function Step1({ setUpImg, handleNext }) {
  const theme = useTheme();
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  const onPaste = useCallback((event) => {
    const item = event?.clipboardData?.files[0];

    if (item?.type?.indexOf("image") === 0) {
      const blob = new Blob([item]);

      setUpImg(blob);
      handleNext();
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const blob = new Blob([reader.result]);

        setUpImg(blob);
        handleNext();
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleLink = async (e) => {
    try {
      setUrlError(false);
      const url = e.target.value;

      if (!!url && isValidUrl(url)) {
        const response = await fetch(url);
        const imageBlob = await response.blob();

        setUpImg(imageBlob);
        handleNext();
      }
    } catch (error) {
      setUrlError(true);
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "image/jpeg, image/png", maxFiles: 1 });

  return (
    <section className="container">
      <Box component="div" {...getRootProps()}>
        <Container
          sx={{
            backgroundColor: theme.palette.background.main,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { "box-shadow": theme.shadows[1], backgroundColor: theme.palette.action.hover },
          }}
        >
          <Box component="input" {...getInputProps()} />
          <Box component="p">Elige, arrasta o pega una imagen.</Box>
        </Container>
      </Box>
      <TextField
        error={urlError}
        helperText={urlError ? "URL inválida" : ""}
        fullWidth
        sx={{ marginBlock: "1em" }}
        label={"O añade un enlace"}
        onChange={handleLink}
      />
    </section>
  );
}

export { Step1 };
