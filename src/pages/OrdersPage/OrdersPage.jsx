import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import useActions from "./actions";
import { COLUMNS } from "./constants";

const OrderPage = () => {
  const { orders } = useActions();
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        rows={orders}
        columns={COLUMNS}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default OrderPage;
