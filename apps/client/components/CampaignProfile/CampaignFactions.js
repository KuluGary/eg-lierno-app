import { getNestedKey } from "@lierno/core-helpers";
import { Grid } from "@mui/material";
import { Container } from "components/Container/Container";
import { PaginatedTable } from "components/Table/PaginatedTable";

export function CampaignFactions({ campaign }) {
  return (
    <Grid item laptop={12} container spacing={2}>
      <Grid item laptop={12}>
        <Container noPadding>
          <PaginatedTable
            getRowData={(element) => ({
              _id: getNestedKey("_id", element),
              name: getNestedKey("name", element),
              avatar: getNestedKey("image", element),
              description: getNestedKey("description", element),
              owner: getNestedKey("createdBy", element),
            })}
            fetchFrom={`/factions/campaigns/${campaign._id}`}
            src={"/factions/{ID}"}
          />
        </Container>
      </Grid>
    </Grid>
  );
}
