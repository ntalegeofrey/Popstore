import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Heading from "../../Heading";

const TotalCost = ({ total }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row-reverse" }} mt={2}>
      <Typography>{total} SEK</Typography>
      <Heading mr={2}>Total</Heading>
    </Box>
  );
};

export default TotalCost;
