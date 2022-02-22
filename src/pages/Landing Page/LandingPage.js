import React, { useState, useEffect } from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import firebase from "../../service/firebase";

import "./styles.css";
const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  //   const handleLogin = () => {
  //     navigate("/login");
  //   };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      setUser(user);
      if (user.multiFactor.user) {
        setUser(user.multiFactor.user);
        navigate("/my-popstore");
      }
    });
  }, []);

  return (
    <Container maxWidth="lg">
      <CreateStoreForm />
      <div className="create-table-wrapper"></div>
      <Button className="go-button" variant="contained">
        Go
      </Button>
    </Container>
  );
};

export default LandingPage;
