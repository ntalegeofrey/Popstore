import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebase, { collection, db, doc, getDoc } from "../../service/firebase";
import CustomerOrders from "../CustomersPage/CustomersPage";
import EditPopstore from "../EditPopstore/EditPopstore";
import OrdersPage from "../OrdersPage/OrdersPage";
import PackingPage from "../PackingPage/PackingPage";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  minHeight: "100vh",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const LeftColumn = styled(Box)(({ theme }) => ({
  flex: "0 0 250px",
  padding: theme.spacing(2),
  backgroundColor: "#FFF",
  [theme.breakpoints.down("sm")]: {
    flex: "0 0 auto",
  },
}));

const RightColumn = styled(Box)(({ theme }) => ({
  flex: "1 1 0",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  backgroundColor: "#ffffff",
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const MainContent = styled(Box)(({ theme }) => ({
  width: "100%",
}));

const StyledButton = styled("div")(({ theme, selected }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  cursor: "pointer",
  height: "40px",
  width: "100%",
  paddingLeft: "15px",
  borderRadius: "6px",
  textAlign: "left",
  align: "center",
  marginTop: "2px",
  fontWeight: selected ? 500 : "regular",
  backgroundColor: selected ? theme.palette.background2 : "#FFF",
  color: selected ? theme.palette.text.dark : theme.palette.text.main,
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.greyBackground
      : theme.palette.greyBackground,
  },
}));

const tabs = [
  {
    label: "Visit/Edit Popstore",
    content: <EditPopstore />,
  },
  { label: "Orders", content: <OrdersPage /> },
  { label: "Customers", content: <CustomerOrders /> },
  { label: "Packing", content: <PackingPage /> },
];

const AnalyticsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [storeName, setStoreName] = useState();
  const [user, setUser] = useState();
  const [store, setStore] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUser(user);
        const storesRef = collection(db, `/StoreOwners/${user.uid}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if (store.exists()) {
          let data = store.data();
          data.columnsList = JSON.parse(data.columnsList);
          setStore(data);
          setLoading(false);
          setStoreName(data.storeName); // Set the storeName value
        }
      } else {
        navigate("/");
      }
      localStorage.setItem(
        "columns",
        JSON.stringify({
          Name: -1,
          "Reference ID": -1,
          Price: -1,
          Ignore: 9,
        })
      );
    };

    fetchStore(); // Call the fetchStore function immediately
  }, [navigate, storeId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem("columns");
    navigate("/");
  };

  return (
    <Container>
      <LeftColumn>
        <Grid container alignItems="center">
          <Grid item sx={2} md={3}>
            <BackButton onClick={cancelStore}>
              <ArrowBackIosIcon />
            </BackButton>
          </Grid>
          <Grid item xs={2} md={9} justifyContent="flex-start">
            <Typography variant="h5" fontWeight="bold">
              {storeName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          {tabs.map((tab, index) => (
            <>
              <Grid item xs={2} md={2}></Grid>
              <Grid item xs={2} md={9}>
                <StyledButton
                  key={index}
                  onClick={(event) => handleTabChange(event, index)}
                  selected={activeTab === index}
                >
                  {tab.label}
                </StyledButton>
              </Grid>
            </>
          ))}
        </Grid>
      </LeftColumn>
      <RightColumn>
        <MainContent>{tabs[activeTab].content}</MainContent>
      </RightColumn>
    </Container>
  );
};

export default AnalyticsPage;
