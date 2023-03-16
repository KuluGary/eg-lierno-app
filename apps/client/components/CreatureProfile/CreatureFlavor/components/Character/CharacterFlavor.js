import React, { useMemo } from "react";
import CreatureFlavor from "../../CreatureFlavor";
import Header from "./Header";

const CharacterFlavor = ({ character, tier }) => {
  const data = useMemo(
    () => ({
      id: character._id,
      sections: [
        {
          title: "Personalidad",
          content: character?.flavor.personality,
        },
        { title: "Apariencia", content: character?.flavor.appearance },
        { title: "Historia", content: character?.flavor.backstory },
      ],
      image: character?.flavor.portrait?.original,
      tier,
      type: "character",
    }),
    [character]
  );

  return <CreatureFlavor data={data} Header={() => <Header character={character} />} />;
};

export default CharacterFlavor;
