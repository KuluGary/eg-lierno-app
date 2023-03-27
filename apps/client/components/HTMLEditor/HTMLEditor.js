import { Box, CircularProgress, TextField } from "@mui/material";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import style from "./HTMLEditor.style";

const CustomQuillEditor = dynamic(() => import("./QuillEditor/QuillEditor"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4, width: "100%" }}>
      <CircularProgress />
    </Box>
  ),
});

export function HTMLEditor({ value, onChange, placeholder = "", inputStyles = {}, ...other }) {
  const QuillEditor = forwardRef((props, ref) => <CustomQuillEditor {...props} editorRef={ref} />);

  return (
    <TextField
      {...other}
      sx={[style.container, inputStyles]}
      multiline
      fullWidth
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      InputProps={{ inputComponent: QuillEditor }}
      InputLabelProps={{ shrink: true }}
    />
  );
}
