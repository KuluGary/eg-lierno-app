import { getSpellcastingName, getSpellStrings } from "@lierno/dnd-helpers";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import HTMLContainer from "components/HTMLContainer/HTMLContainer";
import ExpandedTableRow from "components/Table/ExpandedTableRow/ExpandedTableRow";

export default function Ability({ show, character, classes, dataClasses, title, content, index }) {
  if (title === "Hechizos") {
    const { characterSpells, spellData } = content;

    return (
      <Box component="div" role="tabpanel" id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
        <Table size="small">
          {show &&
            characterSpells.map((spells, index) => {
              console.log({ spells, spellData, character, dataClasses });
              return (
                <ExpandedTableRow
                  index={index}
                  title={getSpellcastingName(spells.caster, classes)}
                  content={<HTMLContainer content={getSpellStrings(spells, spellData, character, dataClasses)} />}
                />
              );
            })}
        </Table>
      </Box>
    );
  }

  return (
    <Table size="small" data-testid={`abilities-container-${index}`}>
      {show &&
        content
          ?.filter(({ name, description }) => !!name || !!description)
          .map(({ name, description }, index) => (
            <ExpandedTableRow index={index} title={name} content={<HTMLContainer content={description} />} />
          ))}
    </Table>
  );
}
