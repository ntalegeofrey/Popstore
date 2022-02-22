import React, { useEffect } from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import firebase from "../../service/firebase";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../../redux/user";
import "./styles.css";
const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user.multiFactor.user) {
        console.log(JSON.stringify(user));
        dispatch(addUserInfo(user.multiFactor.user));
        navigate("/my-popstore");
      }
    });
  }, []);

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

export default LandingPage;
