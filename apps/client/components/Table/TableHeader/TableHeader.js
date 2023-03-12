import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { Box, Collapse, IconButton, InputAdornment, TextField } from "@mui/material";
import { Container } from "components/Container/Container";
import { useState } from "react";
import style from "./TableHeader.style";

const TableHeader = ({ onSearch, querySearch, Filters, onAdd, onUpload }) => {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <Container noPadding>
      <Box sx={style.searchInputContainer}>
        <Box component="span">
          {!!onSearch && (
            <TextField
              size="small"
              placeholder={"Buscar por nombre..."}
              sx={style.searchInput}
              value={querySearch}
              onChange={onSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>
        <Box sx={style.filterButtonContainer}>
          {!!Filters && (
            <IconButton onClick={() => setOpenFilter(!openFilter)} sx={style.filterButton}>
              <FilterListIcon color="primary" fontSize="small" />
            </IconButton>
          )}
          {!!onUpload && (
            <IconButton onClick={onUpload} sx={style.filterButton}>
              <UploadFileIcon color="primary" fontSize="small" />
            </IconButton>
          )}
          {!!onAdd && (
            <IconButton onClick={onAdd} sx={style.filterButton}>
              <AddIcon color="primary" fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      {!!Filters && (
        <Collapse in={openFilter}>
          <Box sx={[style.filterContainer, openFilter ? { opacity: 1 } : {}]}>{Filters}</Box>
        </Collapse>
      )}
    </Container>
  );
};

export { TableHeader };
