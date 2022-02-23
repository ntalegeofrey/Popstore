import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { db } from "../../service/firebase";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Product name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 150,
    type: "number",
    valueGetter: (params) => `${params.row.price} SEK`,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    width: 150,
  },
  {
    field: "total",
    headerName: "Total",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    type: "number",
    width: 170,
    valueGetter: (params) => `${params.row.quantity * params.row.price} SEK`,
  },
];

const OrderPage = () => {
  const [orders, setOrders] = React.useState([]);
  const getOrders = async () => {
    const ordersRef = collection(
      db,
      "StoreOwners",
      "tD4KfLi7mKakIAl3wvcQuBR1Wyw2",
      "AllOrders"
    );

    const order = await getDocs(ordersRef);

    const allOrderedProducts = order.docs.reduce(
      (allOrders, currentOrder) => {
        let orderId = 0;

        const orderedProducts = currentOrder
          .data()
          .OrderedProducts.map((orderedProduct, index) => {
            ++orderId;
            return { _id: currentOrder.id, id: orderId, ...orderedProduct };
          });

        return allOrders.concat(orderedProducts);
      },

      []
    );
    setOrders(allOrderedProducts);
    console.log("reduced orders ------", allOrderedProducts);
  };
  React.useEffect(() => {
    getOrders();
  }, []);

  React.useEffect(() => {
    console.log(orders);
  }, [orders]);
  return (
    <div style={{ height: 400, width: "100%" }}>
      {/* {orders.map((order) => (
        <Grid container key={order.id}>
          <Grid xs={3} item>
            <Typography>{order.name}</Typography>
          </Grid>
          <Grid xs={3} item>
            <Typography>{order["quantity "]}</Typography>
          </Grid>
          <Grid xs={3} item>
            <Typography>{order.price}</Typography>
          </Grid>
          <Grid xs={3} item>
            <Typography>
              {Number(order["quantity "]) * Number(order.price)}
            </Typography>
          </Grid>
        </Grid>
      ))} */}
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        rows={orders}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default OrderPage;
