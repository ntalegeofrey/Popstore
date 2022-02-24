import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./styles.css";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import Grid from "@mui/material/Grid";
import ProductTable from "../../components/Product_Table/ProductTable";
import Button from "@mui/material/Button";
import firebase from "../../service/firebase";
import { db, collection, getDocs } from "../../service/firebase";
import { useNavigate, Link, useLocation } from "react-router-dom";

const MyPopstore = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userPhoto, setUserPhoto] = useState(null);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.multiFactor.user.photoURL);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(async () => {
    var temp = [];
    const allStores = collection(
      db,
      `/StoreOwners/${localStorage.getItem("poolfarm_user_id")}/allStores`
    );
    const querySnapshot = await getDocs(allStores);
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    console.log(temp);
    setTableData(temp);
  }, []);

  return (
    <Container maxWidth="lg">
      <div className="popstore-wrapper">
        <Grid className="pop-header-wrapper" container spacing={2}>
          <Grid item xs={10}>
            <Typography style={{ marginBottom: "20px" }} variant="h6">
              My Popstore
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <div className="logout-button">
              <LogoutButton user={userPhoto} />
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="new-popstore-button">
        <Button component={Link} to="/new-popstore" variant="contained">
          New Popstore
        </Button>
      </div>
      <ProductTable tableData={tableData} />
    </Container>
  );
};

export default MyPopstore;
