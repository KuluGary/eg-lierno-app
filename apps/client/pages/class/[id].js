import { Box, Divider, Typography } from "@mui/material";
import Container from "components/Container/Container";
import HTMLContainer from "components/HTMLContainer/HTMLContainer";
import Image from "components/Image/Image";
import Layout from "components/Layout/Layout";

import Metadata from "components/Metadata/Metadata";
import Api from "services/api";

export default function Item({ classes }) {
  return (
    <Layout>
      <Metadata title={`${classes.name} | Lierno App`} />
      <Container sx={style.container} noPadding>
        <Box sx={style.content}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {classes.name}
          </Typography>
          <Typography variant="subtitle1" sx={style.subtitle}>
            {classes.game}
          </Typography>
        </Box>
        <Divider sx={style.divider} />
        <Box component="div" sx={style.content}>
          {<Image src={classes.image} sx={style.image} />}
          <HTMLContainer content={classes.data.content} />
        </Box>
      </Container>
    </Layout>
  );
}

const style = {
  container: {
    width: "60vw",
    m: "0 auto",
    paddingTop: "1em",
  },
  content: {
    paddingInline: "1.5em",
  },
  subtitle: {
    fontStyle: "italic",
    marginBottom: "10px",
  },
  image: {
    float: "right",
    maxWidth: "25%",
    border: "none",
  },
  divider: {
    marginBlock: "1em 1.5em",
  },
};

export async function getServerSideProps(context) {
  const { query } = context;

  const classes = await Api.fetchInternal("/classes/" + query.id).catch(() => null);

  return {
    props: {
      classes,
    },
  };
}
