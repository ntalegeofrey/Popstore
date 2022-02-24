import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import LogoutButton from "../../components/Logout Button/LogoutButton";
import useActions from "./actions";

const PageHeader = styled(Typography)({
  textTransform: "capitalize",
  fontWeight: 600,
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  padding: "2rem",
});

const StoreOwnerPagesHeader = () => {
  const { pageTitle, storeName } = useActions();

  return (
    <Header>
      <Box>
        <PageHeader variant="h4">{pageTitle} list</PageHeader>
        <Typography>{storeName}</Typography>
      </Box>
      <LogoutButton />
    </Header>
  );
};

export default StoreOwnerPagesHeader;
