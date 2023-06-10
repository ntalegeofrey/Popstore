import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Grid from "@mui/material/Grid";
import firebase, { doc, getDoc } from "../../service/firebase";
import { db, collection, getDocs } from "../../service/firebase";
import { useNavigate, Link, useParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Loading from "../../components/Loading";

export const HeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "14px",
  color: "#fff",
}));
export const BodyText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "14px",
}));

const OrdersPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { storeId } = useParams();
  const [store, setStore] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const storesRef = await collection(
          db,
          `/StoreOwners/${user.uid}/allStores`
        );
        const store = await getDoc(doc(storesRef, storeId));
        if (store.exists()) {
          let data = store.data();
          data.columnsList = JSON.parse(data.columnsList);
          setStore(data);
        }
        const ordersRef = collection(
          db,
          `/StoreOwners/${user.uid}/allStores/${storeId}/Orders`
        );
        const querySnapshot = await getDocs(ordersRef);
        let temp = [];
        querySnapshot.forEach((doc) => {
          let d = doc.data();
          d.order = JSON.parse(d.order);
          temp.push(d);
        });
        let orders = [];
        temp.forEach((o) => {
          o.order.forEach((p) => {
            if (p !== null) {
              // check if order already exists
              let index = orders.findIndex((e) => e.id === p.id);
              if (index === -1) {
                orders.push(p);
              } else {
                orders[index].quantity += p.quantity;
              }
            }
          });
        });
        setOrders(orders);
        setLoading(false);
      } else {
        navigate("/");
      }
    });
  }, [navigate, storeId]);

  if (loading) return <Loading />;
  return (
    <Container maxWidth="lg">
      <div style={{ backgroundColor: "#fff", padding: "1rem" }}>
        <Grid
          container
          spacing={2}
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.white.main,
            marginBottom: 2,
            minHeight: "10vh",
          }}
        >
          <Grid item xs={5} md={5} alignItems="center">
            <HeaderText variant="body1">Product</HeaderText>
          </Grid>
          <Grid item md={2} alignItems="center">
            <HeaderText variant="body1">Price</HeaderText>
          </Grid>
          <Grid item xs={4} md={3} alignItems="center">
            <HeaderText variant="body1">Quantity</HeaderText>
          </Grid>
          <Grid item xs={3} md={2} alignItems="center">
            <HeaderText variant="body1">Total</HeaderText>
          </Grid>
        </Grid>
        {orders?.map((order, index) => {
          return (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{
                backgroundColor: (theme) => theme.palette.background2,
                borderTop: "2px solid",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                "&:first-child": {
                  borderTop: "none",
                },
                "&:last-child": {
                  borderBottom: "none",
                },
                minHeight: "12vh",
              }}
            >
              <Grid item xs={5} md={5}>
                <BodyText variant="body1">
                  {store.columnsList[order.id][1]}
                </BodyText>
              </Grid>
              <Grid item display={{ xs: "none", md: "grid" }} xs={0} md={2}>
                <BodyText variant="body1">
                  {store.columnsList[order.id][2]} {store?.currency}
                </BodyText>
              </Grid>
              <Grid item xs={4} md={3}>
                <BodyText variant="body1">{order.quantity}</BodyText>
              </Grid>
              <Grid item xs={3} md={2}>
                <BodyText variant="body1">
                  {(
                    parseFloat(store.columnsList[order.id][2]) *
                    parseFloat(order.quantity)
                  ).toFixed(2)}{" "}
                  {store?.currency}
                </BodyText>
              </Grid>
            </Grid>
          );
        })}
        <Grid
          container
          spacing={2}
          mt={1}
          justifyContent="flex-end"
          sx={{
            backgroundColor: (theme) => theme.palette.greyBackground,
            width: "50%",
            marginLeft: "auto",
          }}
        >
          <Grid item xs={5} md={5} textAlign="right">
            <p>&nbsp;</p>
          </Grid>
          <Grid item xs={4} md={3}>
            <h4>Grand Total</h4>
          </Grid>
          <Grid item xs={3} md={4}>
            <h4>
              {orders
                ?.reduce((prev, next) => {
                  return (
                    prev +
                    parseFloat(store.columnsList[next.id][2]) *
                      parseFloat(next.quantity)
                  );
                }, 0)
                .toFixed(2)}{" "}
              {store?.currency}
            </h4>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default OrdersPage;
