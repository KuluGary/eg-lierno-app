import { getCharacterSubtitle } from "@lierno/dnd-helpers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import Api from "services/api";
import download from "downloadjs";
import { toast } from "react-toastify";

const CreatureMenu = dynamic(() => import("components/CreatureMenu/CreatureMenu"));

function Header({ character }) {
  const { data: session } = useSession();

  const downloadPdf = () => {
    Api.fetchInternal("/characters/sheet/pdf/" + character["_id"])
      .then((base64Url) => download(base64Url, `${character["name"]}.pdf`, "application/pdf"))
      .catch((err) => toast.error(err));
  };

  return (
    <Box
      data-testid="creature-header"
      component="main"
      sx={{
        display: "flex",
        gap: "1em",
        justifyContent: "space-between",
        alignItems: "center",
        p: "1em 1.2em",
      }}
    >
      <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h3">{character?.name}</Typography>
          <Typography variant="subtitle1">{getCharacterSubtitle(character)}</Typography>
        </Box>
      </Box>
      {!!session && session?.userId === character.createdBy && (
        <CreatureMenu creature={character} type="character" downloadPdf={downloadPdf} />
      )}
    </Box>
  );
}

export default React.memo(Header);
