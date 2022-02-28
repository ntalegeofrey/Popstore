import React from "react";
import Grid from "@mui/material/Grid";
import Heading from "../../Heading";

const ListingHeader = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3} md={6}>
        <Heading>Item</Heading>
      </Grid>
      <Grid item xs={3} md={2}>
        <Heading>Price</Heading>
      </Grid>
      <Grid item xs={3} md={2}>
        <Heading>Quantity</Heading>
      </Grid>
      <Grid item xs={3} md={2} container justifyContent={"flex-end"}>
        <Heading>Total</Heading>
      </Grid>
    </Grid>
  );
};

export default ListingHeader;
