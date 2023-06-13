import React from "react";
import { styled } from "@mui/material/styles";
import { Icon, Typography } from "@mui/material";

// Styled components for the text and icon
const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const NoOrdersText = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
}));

const NotAvailableComponent = ({ icon, heading, subtext }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        width: "100%",
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <NoOrdersText>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {heading}
        </Typography>
        <br />
        <Typography variant="body1" sx={{ fontWeight: 400 }}>
          {subtext}
        </Typography>
      </NoOrdersText>
    </Container>
  );
};

export default NotAvailableComponent;
