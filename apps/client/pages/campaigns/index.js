import { getNestedKey } from "@lierno/core-helpers";
import { Box, Typography } from "@mui/material";
import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import { Table } from "components/Table/Table";
import Head from "next/head";
import Router from "next/router";
import Api from "services/api";

export default function Campaigns({ campaigns }) {
  return (
    <Layout>
      <Head>
        <title>Lierno App | Mis campañas</title>
      </Head>
      <Container
        noPadding
        header={
          <Box sx={{ p: "1em" }}>
            <Typography variant="h3">Campañas</Typography>
          </Box>
        }
      >
        <Table
          getRowData={(element) => ({
            _id: getNestedKey("_id", element),
            subtitle: getNestedKey("flavor.game", element),
            name: getNestedKey("name", element),
            owner: getNestedKey("dm", element),
            description: getNestedKey("flavor.synopsis", element),
            avatar: null,
          })}
          data={campaigns}
          src={"/campaigns/{ID}"}
          onEdit={(id) => Router.push(`/campaigns/add/${id}`)}
        />
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const campaigns = await Api.fetchInternal("/campaigns").catch((_) => null);

  return {
    props: {
      campaigns,
    },
  };
}
