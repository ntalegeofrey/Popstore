import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

function createData(name, link, edit, orders, customers, packaging) {
  return { name, link, edit, orders, customers, packaging };
}

const rows = [
  createData(
    "Best wines from Italy",
    "Link",
    "Edit",
    "Orders",
    "Customers",
    "Packaging"
  ),
  createData("Popstore 2", "Link", "Edit", "Orders", "Customers", "Packaging"),
  createData("Popstore 3", "Link", "Edit", "Orders", "Customers", "Packaging"),
  createData("Popstore 4", "Link", "Edit", "Orders", "Customers", "Packaging"),
  createData("Popstore 5", "Link", "Edit", "Orders", "Customers", "Packaging"),
  createData("Popstore 6", "Link", "Edit", "Orders", "Customers", "Packaging"),
  createData("Popstore 7", "Link", "Edit", "Orders", "Customers", "Packaging")
];
const ProductTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <Link to="/">{row.link}</Link>
              </TableCell>
              <TableCell align="right">
                <Link to="/">{row.edit}</Link>
              </TableCell>
              <TableCell align="right">
                <Link to="/">{row.orders}</Link>
              </TableCell>
              <TableCell align="right">
                <Link to="/">{row.customers}</Link>
              </TableCell>
              <TableCell align="right">
                <Link to="/">{row.packaging}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
