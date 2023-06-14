import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "200px", // Set a minimum height for the container
        boxSizing: "border-box",
        padding: "16px", // Add padding to maintain spacing
        boxSizing: "border-box",
        position: "absolute",
      }}
    >
      <CircularProgress />
      <Typography ml={1}>Loading...</Typography>
    </Box>
  );
};

export default Loading;
