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
import { useNavigate, useParams } from "react-router-dom";
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
import EditTable from "../../components/Data_Table/EditTable";

const EditPopstore = () => {
  const { storeOwnerID, storeID } = useParams();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [selectors, setSelectors] = useState([]);
  const [ids, setIds] = useState([]);
  const [userPhoto, setUserPhoto] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeOwner, setStoreOwner] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("");
  const [enableButton, setEnableButton] = useState(false);
  const [removedList, setRemovedList] = useState([]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.multiFactor.user.photoURL);
      }
    });
  }, [navigate]);

  const columns = collection(
    db,
    `/StoreOwners/${storeOwnerID}/allStores/${storeID}/Colums`
  );
  const store = collection(db, `/StoreOwners/${storeOwnerID}/allStores`);
  useEffect(async () => {
    var temp = [];
    var tempID = [];
    const querySnapshot = await getDocs(store);
    const querySnapshotColumns = await getDocs(columns);

    querySnapshot.forEach((doc) => {
      var data = doc.data();
      setStoreName(data.storeName);
      setStoreOwner(data.storeOwner);
      setDescription(data.description);
      setCurrency(data.currency);
    });
    querySnapshotColumns.forEach((doc) => {
      var data = doc.data();
      temp.push(data.items);
      tempID.push(doc.id);
    });
    setSelectors(temp);
    setIds(tempID);
  }, []);

  var removedArray = [];
  const handleChange = (event, ele, i) => {
    var data = selectors;
    var currIds = ids;
    console.log(i);
    if (event.target.value === "ignore") {
      var rmv = data.splice(i, 1);
      currIds.splice(i, 1);
      console.log(rmv[0][0]);
      removedArray.push({
        cols: rmv,
        name: rmv[0][0]
      });
      setRemovedList([...removedList, removedArray]);
    } else {
    }
    setSelectors([...data]);
    setIds(currIds);
    console.log(removedArray);
  };

  const handleEditPopstore = () => {
    removedList.map((ele) => {
      console.log(ele[0]);
      var columnID = collection(
        db,
        `/StoreOwners/${storeOwnerID}/allStores/${storeID}/Colums`
      );
      var q = query(columnID, where("name", "==", ele[0].name.toLowerCase()));
      updateDoc(q, {
        visibility: false
      });
    });
    // removedList.map((ele) => {
    //   var columnID = collection(
    //     db,
    //     `/StoreOwners/${storeOwnerID}/allStores/${storeID}/Colums`
    //   );
    //   var q = query(columnID, where("name" "==", ))
    //    updateDoc(columnID, {
    //     visibility: false
    //   });
    // });
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
        Edit your Data
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
                      value={storeName}
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
                      value={storeOwner}
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
                      value={description}
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
                      value={currency}
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
          {selectors.map((ele, i) => {
            return (
              <Grid key={i} item>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id={`${ele}-label`}>{ele[0]}</InputLabel>
                  <Select
                    labelId={`${ele[0]}-label`}
                    id={`${ele}`}
                    // value={ele}
                    defaultValue=""
                    label={ele[0]}
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
        {selectors.length > 0 ? <EditTable data={selectors} /> : null}
      </div>
      <div style={{ marginTop: "20px", marginBottom: "20px", float: "right" }}>
        <Button onClick={() => navigate("/my-popstore")} variant="text">
          Cancel
        </Button>
        <Button
          disabled={!enableButton}
          onClick={handleEditPopstore}
          variant="contained"
        >
          Edit Popstore
        </Button>
      </div>
    </Container>
  );
};

export default EditPopstore;
