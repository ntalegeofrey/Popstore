import React, { useEffect } from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import firebase from "../../service/firebase";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../../redux/user";
const NewPopstore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   useEffect(() => {
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         console.log(user.multiFactor.user);
//         dispatch(addUserInfo(user.multiFactor.user));
//         navigate("/my-popstore");
//       } else {
//         navigate("/");
//       }
//     });
//   }, []);

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
