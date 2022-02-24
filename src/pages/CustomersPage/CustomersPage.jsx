import React from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import Loading from "../../components/Loading";
import useActions from "./actions";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const CustomersPage = () => {
  const {
    customersByOrder,
    selectedCustomer,
    totalOrderPrice,
    updateSelectedCustomer,
  } = useActions();

  if (!selectedCustomer || !customersByOrder) return <Loading />;
  return (
    <Box>
      <Grid container my={3}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCustomer.customerEmail}
              label="Age"
              onChange={updateSelectedCustomer}
            >
              {customersByOrder.map((customerByOrder) => (
                <MenuItem
                  value={customerByOrder.customerEmail}
                  key={customerByOrder.customerEmail}
                >
                  {customerByOrder.customerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {customersByOrder
        .filter(
          (customerOrder) =>
            customerOrder.customerEmail === selectedCustomer.customerEmail
        )
        .map((customerOrder, index) => (
          <Grid container key={index} spacing={3} my={1}>
            <Grid item xs={4}>
              <Typography variant="h6">
                {customerOrder.customerName}'s orders
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                {customerOrder.customerEmail}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                {customerOrder.customerPhone}
              </Typography>
            </Grid>
          </Grid>
        ))}

      <Grid container>
        <Grid item xs={6}>
          <Item>
            <Typography variant="body1">Total</Typography>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>{totalOrderPrice} SEK</Item>
        </Grid>
      </Grid>

      {selectedCustomer.OrderedProducts.map((orderedProduct, index) => (
        <Grid container key={index} spacing={2}>
          <Grid item xs={3}>
            <Item>{orderedProduct.name}</Item>
          </Grid>
          <Grid item xs={3}>
            <Item>{orderedProduct.price}</Item>
          </Grid>
          <Grid item xs={3}>
            <Item>{orderedProduct.quantity}</Item>
          </Grid>
          <Grid item xs={3}>
            <Item>
              {Number(orderedProduct.quantity) * Number(orderedProduct.price)}{" "}
              SEK
            </Item>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default CustomersPage;
