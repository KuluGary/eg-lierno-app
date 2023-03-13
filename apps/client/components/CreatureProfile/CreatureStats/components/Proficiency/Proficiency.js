import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import style from "./Proficiency.style";

export default function Proficiency({ title, content }) {
  return (
    <Box component="li" sx={style.proficiencyElement}>
      <Box sx={style.proficiencyElementTextContainer}>
        <Typography
          variant="body1"
          data-testid={`${title.toLowerCase().replaceAll(" ", "-")}-title`}
          sx={style.proficiencyElementTitle}
        >
          {`${title}. `}
        </Typography>
        <Typography variant="body1">{content}</Typography>
      </Box>
    </Box>
  );
}
