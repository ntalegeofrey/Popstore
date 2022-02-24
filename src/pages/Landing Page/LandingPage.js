import React, { useEffect, useState } from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";
import firebase from "../../service/firebase";
import { useDispatch } from "react-redux";
import user, { addUserInfo } from "../../redux/user";
import { updateTableData } from "../../redux/csvText";
import { useSelector } from "react-redux";
import DataTable from "../../components/Data_Table/DataTable";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  setDoc,
  updateDoc
} from "../../service/firebase";
import "./styles.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const text = useSelector((state) => state.csvText.text);

  var rows = [];

  // const sampledata= `
  // Reference, Name, Price, Quantity
  // 1, Wine 1, 12, 2
  // 2, Wine 2, 21, 7
  // 3, Wine 3, 12, 9
  // 4, Wine 4, 12, 12
  // 5, Wine 5, 12, 8
  // `

  const handleCSV = (data) => {
    if (data) {
      data
        .trim()
        .split("\n")
        .map((ele) => {
          var elem = ele.split(",");
          rows.push(elem);
        });
      setTableData(rows);
      dispatch(updateTableData(rows));
    }
  };

  useEffect(() => {
    handleCSV(text);
  }, [text]);

  useEffect(async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.multiFactor.user);
        dispatch(addUserInfo(user.multiFactor.user));
        localStorage.setItem(
          "popstore_user_token",
          user.multiFactor.user.accessToken
        );
        checkIfExists(user.multiFactor.user);
        navigate("/my-popstore");
      } else {
        navigate("/");
      }
    });
  }, [navigate, dispatch]);

  const checkIfExists = async (userData) => {
    const storeOwners = collection(db, "StoreOwners");
    console.log("store", storeOwners);
    const q = query(storeOwners, where("email", "==", userData.email));
    var queryUser;
    var tempId;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      queryUser = doc.data();
      tempId = doc.id;
      localStorage.setItem("poolfarm_user_id", doc.id);
    });
    console.log(queryUser);
    // await updateDoc(queryUser, { ID: tempId });

    if (queryUser === undefined) {
      addDoc(storeOwners, {
        id: "",
        createTime: serverTimestamp(),
        image: userData.photoURL,
        name: userData.displayName,
        phone: userData.phoneNumber,
        email: userData.email
      }).then((data) =>
        updateDoc(data, {
          id: data.id
        })
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <CreateStoreForm />
      <div className="create-table-wrapper">
        <DataTable data={tableData} />
      </div>
      <div className="go-button">
        <Button component={Link} to="/map-your-data" variant="contained">
          Go
        </Button>
      </div>
    </Container>
  );
};

export default LandingPage;
