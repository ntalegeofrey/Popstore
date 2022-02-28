import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const ListItem = ({ product, onUpdateProductQuantity }) => {
  return (
    <Grid container spacing={1} mt={3} alignItems="center" key={product.name}>
      <Grid item xs={3} md={6}>
        {product.name}
      </Grid>
      <Grid item xs={3} md={2}>
        {product.price} SEK
      </Grid>
      <Grid item xs={3} md={2}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          inputProps={{ min: 0 }}
          type="number"
          value={product.quantity.toString()}
          onChange={(event) => onUpdateProductQuantity(event, product.name)}
        />
      </Grid>
      <Grid item xs={3} md={2} container justifyContent={"flex-end"}>
        {product.price * product.quantity} SEK
      </Grid>
    </Grid>
  );
};

export default ListItem;
