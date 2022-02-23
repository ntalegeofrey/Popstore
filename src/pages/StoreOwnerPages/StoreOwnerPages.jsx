import React from "react";
import { Outlet } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const PageContent = styled(Paper)({
  padding: "3rem",
});

const StoreOwnerPages = () => (
  <Container>
    <Typography variant="h4">Dynamic page header component</Typography>
    <PageContent elevation={0}>
      <Outlet />
    </PageContent>
  </Container>
);

export default StoreOwnerPages;
