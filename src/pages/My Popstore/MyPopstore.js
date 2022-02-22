import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./styles.css";
import LogoutButton from "../../components/Logout Button/LogoutButton";
const MyPopstore = () => {
  return (
    <Container maxWidth="lg">
      <div className="popstore-wrapper">
        <Typography style={{ marginBottom: "20px" }} variant="h6">
          My Popstore
        </Typography>
        <LogoutButton/>
      </div>
    </Container>
  );
};

export default MyPopstore;
