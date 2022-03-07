import React from "react";
import { Outlet } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

import StoreOwnerPagesHeader from "../../components/StoreOwnerPagesHeader";

const PageContent = styled(Paper)({
  padding: "3rem",
});

const StoreOwnerPages = () => {
  return (
    <Container>
      <StoreOwnerPagesHeader />
      <PageContent elevation={0}>
        <Outlet />
      </PageContent>
    </Container>
  );
};

export default StoreOwnerPages;
