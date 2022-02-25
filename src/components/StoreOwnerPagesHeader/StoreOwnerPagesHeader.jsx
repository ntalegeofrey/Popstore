import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import LogoutButton from "../../components/Logout Button/LogoutButton";
import useActions from "./actions";

const PageHeader = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "pageTitle",
})(({ pageTitle }) => ({
  textTransform: "capitalize",
  fontWeight: pageTitle ? "normal" : "600",
  fontSize: pageTitle ? 22 : 26,
  display: "inline-block",
  marginRight: "2rem",
}));

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  padding: "2rem",
});

const StoreOwnerPagesHeader = () => {
  const { pageTitle, storeName, userPhoto } = useActions();

  return (
    <Header>
      <Box>
        <PageHeader pageTitle={pageTitle} variant="h4">
          {pageTitle ? `${pageTitle} list` : "PopStore"}
        </PageHeader>
        {pageTitle && (
          <span>
            <Link to="/my-popstore">Close</Link>
          </span>
        )}
        <Typography variant={pageTitle ? "body1" : "h6"}>
          {storeName}
        </Typography>
      </Box>
      <LogoutButton user={userPhoto} />
    </Header>
  );
};

export default StoreOwnerPagesHeader;
