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
import { useNavigate } from "react-router-dom";
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
  const [storeName, setStoreName] = useState("");
  const [storeOwner, setStoreOwner] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("");
  const [enableButton, setEnableButton] = useState(false);
  const [userID, setUserID] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userData, setUserData] = useState(null);
  const [priceColumn, setPriceColumn] = useState([]);
  const [nameColumn, setNameColumn] = useState([]);
  const [oColumns, setOColumns] = useState([]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setUserID(user.multiFactor.user.uid);
        setUserPhoto(user.multiFactor.user.photoURL);
      }
    });
  }, [navigate]);

  const [data, setData] = useState(tableData);
  var otherColumns = [];
  const handleChange = (event, ele, i) => {
    console.log(oColumns);
    if (event.target.value === "ignore") {
      oColumns.forEach((elem) => {
        if (elem.name.toLowerCase() === ele.toLowerCase()) {
          ele.visibility = false;
        }
      });
    } else {
      oColumns.forEach((elem) => {
        if (elem.name.toLowerCase() === ele.toLowerCase()) {
          ele.visibility = true;
        }
      });
    }
  };

  useEffect(() => {
    tableData[0].forEach((ele) => {
      if (ele.toLowerCase() === "price") {
        var index = tableData[0].indexOf(ele);
        let temp = [];
        let colArray = [];
        temp = data;
        temp.forEach((elem) => {
          colArray.push(elem[index]);
        });
        setPriceColumn(colArray);
      } else if (ele.toLowerCase() === "name") {
        var index = tableData[0].indexOf(ele);
        let temp = [];
        let colArray = [];
        temp = data;
        temp.forEach((elem) => {
          colArray.push(elem[index]);
        });
        setNameColumn(colArray);
      } else {
        var index = tableData[0].indexOf(ele);
        let temp = [];
        let colArray = [];
        temp = data;
        temp.forEach((elem) => {
          colArray.push(elem[index]);
        });
        otherColumns.push({
          name: ele,
          cols: colArray,
          visibility: true
        });
      }
    });
    setOColumns(otherColumns);
    console.log("other", otherColumns);
  }, []);

  const handleCreatePopstore = async () => {
    if (userData) {
      console.log(userID);
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
        createAt: serverTimestamp(),
        currency,
        description,
        link: "",
        storeName,
        storeOwner,
        ownerID: id,
        // ownerID: userID,
        storeID: ""
      }).then((data) => {
        var columnRef = collection(
          db,
          `/StoreOwners/${id}/allStores/${data.id}/Colums`
        );
        updateDoc(data, {
          storeID: data.id,
          link: `https://bothofus-poolfarm-fe.herokuapp.com/${id}/${data.id}`
        });
        addDoc(columnRef, {
          items: priceColumn,
          name: "Price",
          visibility: true
        });
        addDoc(columnRef, {
          items: nameColumn,
          name: "Name",
          visibility: true
        });
        oColumns.forEach((ele) => {
          addDoc(columnRef, {
            items: ele.cols,
            name: ele.name,
            visibility: ele.visibility
          });
        });
      });
      navigate("/my-popstore", { state: id });
    } else {
      signInWithGoogle();
    }
  };
  useEffect(() => {
    if (
      storeName.length > 3 &&
      storeOwner.length > 3 &&
      description.length > 3 &&
      currency.length > 1
    ) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  }, [storeName, storeOwner, description, currency]);

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
        <Button
          disabled={!enableButton}
          onClick={handleCreatePopstore}
          variant="contained"
        >
          Create Popstore
        </Button>
      </div>
    </Container>
  );
};

export default MapYourData;
