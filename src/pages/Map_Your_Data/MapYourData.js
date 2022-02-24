import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import DataTable from "../../components/Data_Table/DataTable";
import firebase from "../../service/firebase";
import { InputLabel, OutlinedInput } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  updateDoc
} from "../../service/firebase";
import { signInWithGoogle } from "../../service/firebase";

const MapYourData = () => {
  const tableData = useSelector((state) => state.csvText.tableData);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeOwner, setStoreOwner] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("");

  const [userPhoto, setUserPhoto] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setUserPhoto(user.multiFactor.user.photoURL);
      }
    });
  }, [navigate]);

  const [data, setData] = useState(tableData);
  let temp = [];

  const handleChange = (event, ele, i) => {
    var newList = [];
    temp = data;
    temp.map((ele) => {
      var tempArray = [...ele];
      tempArray.splice(i, 1);
      newList.push(tempArray);
    });
    setData(newList);
  };

  const handleCreatePopstore = async () => {
    if (userData) {
      console.log(userData.email);
      var id;
      const userRef = collection(db, "StoreOwners");
      const q = query(userRef, where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        id = doc.id;
        localStorage.setItem("poolfarm_user_id", doc.id);
      });
      const allStores = collection(db, `/StoreOwners/${id}/allStores`);
      addDoc(allStores, {
        columnList: JSON.stringify(data),
        createAt: serverTimestamp(),
        currency,
        description,
        link: "",
        storeName,
        storeOwner,
        ownerID: id,
        storeID: ""
      }).then((data) => {
        updateDoc(data, {
          storeID: data.id,
          link: `https://bothofus-poolfarm-fe.herokuapp.com/${id}/${data.id}`
        });
      });
      navigate("/my-popstore", { state: id });
    } else {
      signInWithGoogle();
    }
  };

  useEffect(() => {
    tableData[0].map((ele) => {
      temp.push({
        name: ele,
        opt: "select"
      });
    });
    setOptions(temp);
  }, []);
  return (
    <Container maxWidth="lg">
      <Typography style={{ marginTop: "20px" }} variant="h4">
        Map your Data
      </Typography>
      <div style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Grid container>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                  >
                    <Typography align="left" mt={0} variant="p">
                      Store name
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput
                      onChange={(e) => setStoreName(e.target.value)}
                      variant="outlined"
                      id="store-name"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                    md={6}
                  >
                    Store owner
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput
                      onChange={(e) => setStoreOwner(e.target.value)}
                      variant="outlined"
                      id="store-owner"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{ marginTop: "20px" }} container>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                    md={6}
                  >
                    Description
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput
                      onChange={(e) => setDescription(e.target.value)}
                      variant="outlined"
                      id="description"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                    md={6}
                  >
                    Currency
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput
                      onChange={(e) => setCurrency(e.target.value)}
                      variant="outlined"
                      id="currency"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" item md={4}>
            {userPhoto ? <LogoutButton user={userPhoto} /> : null}
          </Grid>
        </Grid>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Grid justifyContent="center" container spacing={2}>
          {tableData[0].map((ele, i) => {
            return (
              <Grid key={i} item>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id={`${ele}-label`}>{ele}</InputLabel>
                  <Select
                    labelId={`${ele}-label`}
                    id={`${ele}`}
                    // value={ele}
                    label={ele}
                    onChange={(e) => handleChange(e, ele, i)}
                  >
                    <MenuItem value="select">Select</MenuItem>
                    <MenuItem value="ignore">Ignore</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            );
          })}
        </Grid>
        <DataTable data={data} />
      </div>
      <div style={{ marginTop: "20px", marginBottom: "20px", float: "right" }}>
        <Button onClick={() => navigate("/my-popstore")} variant="text">
          Cancel
        </Button>
        <Button onClick={handleCreatePopstore} variant="contained">
          Create Popstore
        </Button>
      </div>
    </Container>
  );
};

export default MapYourData;
