import React from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
const NewPopstore = () => {
  return (
    <Container maxWidth="lg">
      <CreateStoreForm />
      <div className="create-table-wrapper"></div>
      <div className="go-button">
        <Button variant="contained">Go</Button>
      </div>
    </Container>
  );
};

export default NewPopstore;
