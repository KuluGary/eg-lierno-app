import { Box, Divider, Typography } from "@mui/material";
import Container from "components/Container/Container";
import HTMLContainer from "components/HTMLContainer/HTMLContainer";
import Layout from "components/Layout/Layout";

import Metadata from "components/Metadata/Metadata";
import references from "helpers/json/references.json";

export default function Reference({ reference }) {
  return (
    <Layout>
      <Metadata title={`${reference.title} | Lierno App`} description={reference.description} />
      <Container sx={{ width: "60vw", m: "0 auto" }} noPadding>
        <Box sx={{ m: 2 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {reference.title}
          </Typography>
          <Typography variant="subtitle1">{reference.subtitle}</Typography>
        </Box>
        <Divider />
        <Box sx={{ m: 2 }}>
          <Box component="div">
            <HTMLContainer content={reference.description} />
          </Box>
          <Box component="ul">
            {reference.bullets?.map((bullet, index) => (
              <Box component="li" key={index}>
                <HTMLContainer content={bullet} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;

  let reference = null;

  Object.values(references).forEach((section) => {
    const ref = section.find((ref) => ref.title === query.id);

    if (!!ref) {
      reference = ref;
    }
  });

  return {
    props: {
      reference,
    },
  };
}
