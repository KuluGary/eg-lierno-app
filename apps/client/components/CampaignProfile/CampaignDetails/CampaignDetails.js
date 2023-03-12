import { Box, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Avatar } from "components/Avatar/Avatar";
import { Container } from "components/Container/Container";
import { HTMLContainer } from "components/HTMLContainer/HTMLContainer";
import { Link } from "components/Link/Link";
import style from "./CampaignDetails.style";

export function CampaignDetails({ campaign, dm, players, characters }) {
  return (
    <Grid item laptop={12} container spacing={2}>
      <Grid item laptop={4}>
        <Container sx={style.container} noPadding>
          <Table>
            <TableBody>
              {!!dm && (
                <TableRow>
                  <TableCell sx={style.smallCell}>
                    <Box sx={style.avatarContainer}>
                      <Avatar src={dm.metadata?.avatar} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">Dungeon Master</Typography>
                    <Typography variant="caption">{dm.name}</Typography>
                  </TableCell>
                </TableRow>
              )}
              {players?.map(({ name, id }) => {
                const character = characters?.find((character) => character["createdBy"] === id);

                return (
                  <TableRow key={id}>
                    <TableCell sx={style.smallCell}>
                      <Box sx={style.avatarContainer}>
                        <Avatar src={character?.flavor?.portrait?.avatar} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Link href={`/characters/${id}`}>
                        <Typography variant="body1" sx={{ "&:hover": { textDecoration: "underline" } }}>
                          {character?.name}
                        </Typography>
                      </Link>
                      <Typography variant="caption">{name}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Container>
      </Grid>
      <Grid item laptop={8}>
        <Container sx={style.container}>
          <HTMLContainer content={campaign?.flavor?.synopsis} />
        </Container>
      </Grid>
    </Grid>
  );
}
