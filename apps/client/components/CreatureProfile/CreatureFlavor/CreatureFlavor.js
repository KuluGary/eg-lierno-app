import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Router from "next/router";
import Image from "../../Image/Image";
import style from "./CreatureFlavor.style";
import { Container } from "components/Container/Container";
import HTMLContainer from "components/HTMLContainer/HTMLContainer";
import { useWidth } from "hooks/useWidth";
import { useTheme } from "@mui/material";

export default function CreatureFlavor({ Header, data }) {
  const { tier, image, sections } = data;
  const width = useWidth();
  const theme = useTheme();

  return (
    <Container
      header={!!Header && <Header />}
      sx={{
        height: width.down("tablet") ? "100%" : "90vh",
        overflowY: width.down("tablet") ? "no-scroll" : "scroll",
        ...theme.mixins.noScrollbar,
      }}
      noPadding
    >
      {tier?.length > 1 && (
        <Fragment>
          <Tabs value={data.tier.indexOf(data.id)} aria-label="tier tabs">
            {tier.map((t, i) => (
              <Tab
                key={`tier-tab-${i}`}
                label={`${data.type === "character" ? "Nivel" : "Tier"} ${i + 1}`}
                id={`tier-tab-${i}`}
                aria-controls={`$tier-tabpalen-${i}`}
                onClick={() => {
                  data.tier.indexOf(data.id) !== i && Router.push(`/${data.type}s/${t}`);
                }}
              />
            ))}
          </Tabs>
          <Divider />
        </Fragment>
      )}
      <Box id="creature-flavor" component="div" sx={style.flavorContainer}>
        {image && <Image src={data.image} sx={style.portrait} modal />}
        {sections?.map(({ title, content }) => {
          if (!content) return <Fragment key={title}></Fragment>;

          return (
            <Fragment key={title}>
              <Typography variant="h4">{title}</Typography>
              <HTMLContainer content={content} />
            </Fragment>
          );
        })}
      </Box>
    </Container>
  );
}
