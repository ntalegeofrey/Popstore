import CopyAllIcon from "@mui/icons-material/CopyAll";
import { Button, Card, Grid, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebase, {
  collection,
  db,
  getDocs,
  orderBy,
  query,
} from "../../service/firebase";
import Loading from "../Loading";

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
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("sm")]: { marginTop: theme.spacing(2) },
}));

const CardComponent = () => {
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
  if (loading) return <Loading />;
  return (
    <>
      {productList.map((row, i) => (
        <div key={i}>
          <CardContainer>
            <Grid id="step5" container alignItems="center">
              <Grid
                item
                xs={12}
                md={6}
                sx={{ cursor: "pointer" }}
                onClick={(e) =>
                  navigate(`/popstore/analytics/${tableData[i].storeID}`)
                }
              >
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/popstore/analytics/${tableData[i].storeID}`}
                  sx={{
                    flexGrow: 1,
                    fontWeight: "regular",
                    textDecoration: "none !important",
                  }}
                >
                  {row.name}
                </Typography>
              </Grid>
              <ButtonContainer container item spacing={2} xs={12} md={6}>
                <Grid item xs={12} sm={4} alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "100%" }}
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
                    sx={{ width: "100%" }}
                    component={Link}
                    to={`/popstore/edit/${tableData[i].storeID}`}
                  >
                    Duplicate Store
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    id="step4"
                    variant="contained"
                    startIcon={<CopyAllIcon />}
                    sx={{ width: "100%" }}
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

export default CardComponent;
