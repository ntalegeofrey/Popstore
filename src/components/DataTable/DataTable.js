import React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import styles from "./Sheets.module.css";
import { alpha } from "@mui/material/styles";

const DataTable = ({ sheet }) => {
  return (
    <TableContainer
      sx={{ backgroundColor: (theme) => theme.palette.background2 }}
    >
      <Table>
        <TableBody>
          {sheet?.map((row, rowIndex) => {
            return (
              <TableRow
                key={`row-${rowIndex}`}
                sx={{
                  borderTop: "2px solid",
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                  "&:first-child": {
                    borderTop: "none",
                  },
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                {row.cells.map((cell, cellIndex) => (
                  <TableCell
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className={styles["cell"]}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
