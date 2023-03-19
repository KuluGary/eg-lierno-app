import Grid from "@mui/material/Grid";
import Layout from "components/Layout/Layout";
import Metadata from "components/Metadata/Metadata";
import serialize from "helpers/serializeJson";
import useCreatureData from "hooks/useCreatureData";
import { useWidth } from "hooks/useWidth";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Api from "services/api";

const CharacterStats = dynamic(() =>
  import("components/CreatureProfile/CreatureStats/components/CharacterStats/CharacterStats")
);

const CharacterFlavor = dynamic(() =>
  import("components/CreatureProfile/CreatureFlavor/components/Character/CharacterFlavor")
);

export default function CharacterProfile({ character = null }) {
  const router = useRouter();
  const width = useWidth();
  const [currentCharacter, setCurrentCharacter] = useState(character);
  const { loadingData, spells, items, tier, classes } = useCreatureData(currentCharacter, "character");

  useEffect(() => {
    if (router.query.id && !character) {
      Api.fetchInternal(`/characters/${router.query.id}`)
        .then(setCurrentCharacter)
        .catch(() => null);
    }
  }, [router.query]);

  return (
    <Layout>
      <Metadata
        title={(currentCharacter?.name ?? "") + " | Lierno App"}
        image={currentCharacter?.flavor.portrait?.avatar}
        description={currentCharacter?.flavor.personality}
      />
      <Grid container spacing={1} sx={{ height: "100%" }}>
        <Grid item laptop={6} mobile={12}>
          {currentCharacter && !loadingData && <CharacterFlavor character={currentCharacter} tier={tier} />}
        </Grid>
        <Grid item laptop={6} mobile={12} sx={{ paddingBottom: width.down("tablet") ? "1em" : 0 }}>
          {currentCharacter && !loadingData && (
            <CharacterStats
              character={currentCharacter}
              setCurrentCharacter={setCurrentCharacter}
              spells={spells}
              items={items}
              classes={classes}
            />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
