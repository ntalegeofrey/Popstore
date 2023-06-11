import DownloadIcon from "@mui/icons-material/Download";
import { Container, Typography } from "@mui/material";
import React from "react";

const DownloadedPage = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DownloadIcon fontSize="large" style={{ marginRight: "10px" }} />
        <Typography variant="h5" fontWeight={500} fontSize={32}>
          File has been downloaded
        </Typography>
      </div>
    </Container>
  );
};

export default DownloadedPage;
