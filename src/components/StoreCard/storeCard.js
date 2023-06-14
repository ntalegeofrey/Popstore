import { Button, Card, Grid, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CopyIcon from "../../icons/copyIcon";
import firebase, {
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "../../service/firebase";
import Loading from "../Loading";
import LockIcon from "../../icons/lockIcon";

const styles = `
  .lock-icon {
    display: inline-flex;
    vertical-align: middle;
  }
`;

const CardContainer = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background2,
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  borderRadius: "4px",
  marginTop: theme.spacing(1),
  textDecoration: "none",
  width: "100%",
  height: "72px",
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("sm")]: { marginTop: theme.spacing(2) },
}));

const StoreCardComponent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [tableData, setTableData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const handleOrderClick = (storeID) => {
    navigate(`/popstore/orders/${storeID}`);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        let temp = [];
        const allStores = query(
          collection(db, `/StoreOwners/${user.uid}/allStores`),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(allStores);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
        setTableData(temp);
        setLoading(false);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(() => {
    var rows = [];
    tableData.forEach((element) => {
      rows.push({
        name: element.storeName,
        link: "Link",
        edit: "Edit",
        orders: "Orders",
        customers: "Customers",
        packaging: "Packing",
      });
    });
    setProductList(rows);
  }, [tableData]);

  const handleCopy = (link) => {
    const url = `${window.location.origin}${link}`;
    // Copy the URL to the clipboard
    navigator.clipboard.writeText(url);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDuplicateStore = async (storeID) => {
    try {
      setLoading(true);

      // Retrieve the details of the store to be duplicated
      const storeRef = doc(db, `/StoreOwners/${user.uid}/allStores/${storeID}`);
      const storeSnapshot = await getDoc(storeRef);
      const storeData = storeSnapshot.data();

      // Create a new store with auto-generated ID and the same details as the original store
      const newStoreRef = doc(
        collection(db, `/StoreOwners/${user.uid}/allStores`)
      );
      const newStoreID = newStoreRef.id;
      const newStoreData = { ...storeData }; // Create a fresh copy of the store data
      newStoreData.storeID = newStoreID; // Modify storeID to the new ID
      await setDoc(newStoreRef, newStoreData);

      // Fetch all the store data
      const allStoresRef = query(
        collection(db, `/StoreOwners/${user.uid}/allStores`),
        orderBy("createAt", "desc")
      );
      const querySnapshot = await getDocs(allStoresRef);
      const allStoresData = [];
      querySnapshot.forEach((doc) => {
        allStoresData.push(doc.data());
      });

      // Update the table data with all the store data
      setTableData(allStoresData);
      setLoading(false);

      // Retrieve the ID of the newly duplicated store
      console.log("Duplicated store ID:", newStoreID);

      // Perform any additional actions with the duplicated store ID here
    } catch (error) {
      console.error("Error duplicating store:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      {loading && <Loading />}
      {productList.map((row, i) => (
        <div key={i}>
          <CardContainer>
            <Grid id="step5" container alignItems="center">
              <Grid
                item
                xs={6}
                md={6}
                sx={{ cursor: "pointer" }}
                onClick={(e) =>
                  navigate(`/popstore/analytics/${tableData[i].storeID}`)
                }
              >
                <Typography
                  variant="body3"
                  component={Link}
                  color="majorBlack"
                  to={`/popstore/analytics/${tableData[i].storeID}`}
                  sx={{
                    flexGrow: 1,
                    fontWeight: "regular",
                    textDecoration: "none !important",
                  }}
                >
                  {row.name}
                  &nbsp; &nbsp; &nbsp;
                  {tableData[i].locked && (
                    <span className="lock-icon">
                      <LockIcon style={{ color: "#4c8991" }} />
                    </span>
                  )}
                </Typography>
              </Grid>
              <ButtonContainer container item spacing={2} xs={12} md={6}>
                <Grid item xs={12} sm={4} alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "139px", height: "40px" }}
                    component={Link}
                    to={`/popstore/orders/${tableData[i].storeID}`}
                  >
                    Orders
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "139px", height: "40px" }}
                    onClick={() => handleDuplicateStore(tableData[i].storeID)}
                  >
                    Duplicate Store
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    id="step4"
                    variant="contained"
                    startIcon={<CopyIcon />}
                    sx={{ width: "139px", height: "40px" }}
                    onClick={() =>
                      handleCopy(
                        `/store/${tableData[i].ownerID}/${tableData[i].storeID}`
                      )
                    }
                  >
                    Copy Link
                  </Button>
                </Grid>
              </ButtonContainer>
            </Grid>
          </CardContainer>
        </div>
      ))}{" "}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            backgroundColor: "#656f71",
            color: "#FFF",
            "& .MuiAlert-icon": {
              color: "#FFF",
            },
          }}
        >
          Link Copied!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default StoreCardComponent;
