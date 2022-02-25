import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";


const ProductTable = ({ tableData }) => {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    var rows = [];
    tableData.map((element) => {
      rows.push({
        name: element.storeName,
        link: "Link",
        edit: "Edit",
        orders: "Orders",
        customers: "Customers",
        packaging: "Packaging"
      });
    });
    setProductList(rows);
  }, [tableData]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {productList.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <Link to={`${tableData[i].ownerID}/${tableData[i].storeID}`}>
                  {row.link}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link to="/edit">{row.edit}</Link>
              </TableCell>
              <TableCell align="right">
                <Link to={`${tableData[i].ownerID}/${row.name}/orders`}>
                  {row.orders}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link to={`${tableData[i].ownerID}/${row.name}/customers`}>
                  {row.customers}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link to={`${tableData[i].ownerID}/${row.name}/packing`}>
                  {row.packaging}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
