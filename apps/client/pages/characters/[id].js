import Grid from "@mui/material/Grid";
import Layout from "components/Layout/Layout";
import Metadata from "components/Metadata/Metadata";
import useCreatureData from "hooks/useCreatureData";
import { useWidth } from "hooks/useWidth";
import dynamic from "next/dynamic";
import { useState } from "react";
import Api from "services/api";

const CharacterStats = dynamic(() =>
  import("components/CreatureProfile/CreatureStats/components/CharacterStats/CharacterStats")
);

const CharacterFlavor = dynamic(() =>
  import("components/CreatureProfile/CreatureFlavor/components/Character/CharacterFlavor")
);

export default function CharacterProfile({ character }) {
  const width = useWidth();
  const [currentCharacter, setCurrentCharacter] = useState(character);
  const { spells, items, tier, classes } = useCreatureData(character, "character");

  return (
    <Layout>
      <Metadata
        title={(currentCharacter?.name ?? "") + " | Lierno App"}
        image={currentCharacter?.flavor.portrait?.avatar}
        description={currentCharacter?.flavor.personality}
      />
      <Grid container spacing={1} sx={{ height: "100%" }}>
        <Grid item laptop={6} mobile={12}>
          <CharacterFlavor character={currentCharacter} tier={tier} />
        </Grid>
        <Grid item laptop={6} mobile={12} sx={{ paddingBottom: width.down("tablet") ? "1em" : 0 }}>
          <CharacterStats
            character={character}
            setCurrentCharacter={setCurrentCharacter}
            spells={spells}
            items={items}
            classes={classes}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const character = await Api.fetchInternal(`/characters/${query.id}`).catch(() => null);

  return {
    props: {
      key: character._id,
      character,
    },
  };
}
