import React from "react";
import { TableFooter as MuiTableFooter, TablePagination, TableRow } from "@mui/material";
import style from "./TableFooter.style";

export function TableFooter({ total, page, handleChangePage, rowsPerPage, onChangeRowsPerPage }) {
  return (
    <MuiTableFooter>
      <TableRow sx={style.noBorder}>
        <TablePagination
          sx={style.noBorder}
          count={total}
          onPageChange={handleChangePage}
          page={page}
          rowsPerPageOptions={[5, 10, 15]}
          rowsPerPage={rowsPerPage}
          colSpan={12}
          labelRowsPerPage={"Filas por página: "}
          labelDisplayedRows={({ from, to, count }) => "" + from + "-" + to + " de " + count}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </TableRow>
    </MuiTableFooter>
  );
}
