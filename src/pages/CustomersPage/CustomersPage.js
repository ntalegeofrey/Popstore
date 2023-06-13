import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Grid, IconButton, Collapse, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import firebase, { doc, getDoc } from "../../service/firebase";
import { db, collection, getDocs, where, query } from "../../service/firebase";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { alpha } from "@mui/material/styles";
import { BodyText } from "../OrdersPage/OrdersPage";
import Loading from "../../components/Loading";
import NotAvailableComponent from "../../components/NotAvailableComponent/NotAvailableComponent";

export const ItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
}));

export const CollapsibleContent = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  marginTop: "5px",
  transition: "height 0.3s ease-in-out",
  overflow: "hidden",
  width: "100%",
}));

const CustomerOrders = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { storeId } = useParams();
  const [store, setStore] = useState({});
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        let temp = [];
        const allStores = collection(db, `/StoreOwners/${user.uid}/allStores`);
        const querySnapshot = await getDocs(allStores);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
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
        const customersRef = collection(
          db,
          `/StoreOwners/${user.uid}/allStores/${storeId}/customers`
        );
        const Customers = await getDocs(customersRef);
        temp = [];
        Customers.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
        setCustomers(temp);
        setLoading(false);
      } else {
        navigate("/");
      }
    });
  }, [navigate, storeId]);

  const getCustomoerOrders = async (c) => {
    const ordersRef = collection(
      db,
      `/StoreOwners/${user.uid}/allStores/${storeId}/Orders`
    );
    const q = query(ordersRef, where("email", "==", c.email));
    const querySnapshot = await getDocs(q);
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
    return orders;
  };

  const handleToggleCollapse = (rowIndex, customer) => {
    if (expandedRow === rowIndex) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowIndex);
      getCustomoerOrders(customer).then((o) => {
        setOrders(o);
        document.getElementById("customer").textContent = customer.email;
      });
    }
  };

  if (loading) return <Loading />;
  // Check if there are no orders
  const noCustomers = customers.length === 0;
  return (
    <>
      {noCustomers ? (
        <div>
          <NotAvailableComponent
            heading="No Customers Yet"
            subtext="Looks like there are no customers yet for this store."
          />{" "}
        </div>
      ) : (
        <Grid container spacing={2}>
          {customers.map((customer, index) => (
            <Grid item xs={12} key={index}>
              <ItemContainer
                sx={{
                  backgroundColor: (theme) => theme.palette.background2,
                }}
              >
                <div style={{ width: "100%" }}>
                  <Typography
                    variant="body"
                    align="left"
                    sx={{ fontWeight: 400 }}
                  >
                    {customer.name}
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <Typography
                    variant="body"
                    align="left"
                    sx={{ fontWeight: 400 }}
                  >
                    {customer.email}
                  </Typography>
                </div>
                <div style={{ width: "100%" }}>
                  <Typography
                    variant="body"
                    align="left"
                    sx={{ fontWeight: 400 }}
                  >
                    {customer.phone}
                  </Typography>
                </div>
                <IconButton
                  onClick={() => handleToggleCollapse(index, customer)}
                  sx={{ color: (theme) => theme.palette.primary.main }}
                >
                  {expandedRow === index ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </ItemContainer>
              {expandedRow === index && (
                <Collapse
                  in={expandedRow === index}
                  timeout={300}
                  sx={{
                    padding: (theme) => theme.spacing(1),
                  }}
                >
                  <CollapsibleContent>
                    <div>
                      <Typography
                        variant="body1"
                        align="left"
                        fontSize={"14px"}
                        mb={1}
                      >
                        Note /Comments
                      </Typography>
                      <Typography variant="body1" align="left" fontWeight={400}>
                        {customer.comment}
                      </Typography>
                    </div>
                    {/* Display Order for each Customer */}
                    <div>
                      <Grid
                        container
                        spacing={2}
                        key="titles"
                        alignItems="center"
                        sx={{
                          minHeight: "12vh",
                          marginTop: 2,
                          backgroundColor: (theme) =>
                            theme.palette.primary.main,
                          padding: 1,
                        }}
                      >
                        <Grid item xs={3} md={5}>
                          <Typography
                            variant="subtitle1"
                            align="left"
                            sx={{
                              color: (theme) => theme.palette.white.main,
                              fontWeight: 400,
                              fontSize: "14px",
                            }}
                          >
                            Reference ID
                          </Typography>
                        </Grid>
                        <Grid item xs={3} md={2}>
                          <Typography
                            variant="subtitle1"
                            align="left"
                            sx={{
                              color: (theme) => theme.palette.white.main,
                              fontWeight: 400,
                              fontSize: "14px",
                            }}
                          >
                            Product
                          </Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                          <div>
                            <Typography
                              variant="subtitle1"
                              align="left"
                              sx={{
                                color: (theme) => theme.palette.white.main,
                                fontWeight: 400,
                                fontSize: "14px",
                              }}
                            >
                              Quantity
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={3} md={2}>
                          <div>
                            <Typography
                              variant="subtitle1"
                              align="left"
                              sx={{
                                color: (theme) => theme.palette.white.main,
                                fontWeight: 400,
                                fontSize: "14px",
                              }}
                            >
                              Amount
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                      {orders?.map((order, index) => {
                        return (
                          <Grid
                            container
                            spacing={2}
                            key={index}
                            pb={1}
                            pl={1}
                            sx={{
                              backgroundColor: (theme) =>
                                theme.palette.background2,
                              borderTop: "2px solid",
                              borderColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.3),
                              "&:first-child": {
                                borderTop: "none",
                              },
                              "&:last-child": {
                                borderBottom: "none",
                              },
                              minHeight: "12vh",
                            }}
                          >
                            <Grid item xs={3} md={5}>
                              <BodyText variant="body1">
                                {store.columnsList[order.id][1]}
                              </BodyText>
                            </Grid>
                            <Grid item xs={3} md={2}>
                              <BodyText variant="body1">
                                {store.columnsList[order.id][2]}{" "}
                                {store?.currency}
                              </BodyText>
                            </Grid>
                            <Grid item xs={3} md={3}>
                              <BodyText variant="body1">
                                {order.quantity}
                              </BodyText>
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
                      <div>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="flex-end"
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.greyBackground,
                            marginTop: 1,
                            marginLeft: "auto",
                            width: "50%",
                          }}
                        >
                          <Grid
                            container
                            item
                            xs={3}
                            md={6}
                            justifyContent="center"
                          >
                            <h4>Grand Total</h4>
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            md={6}
                            container
                            justifyContent="center"
                          >
                            <h4 styles={{ marginLeft: "10px" }}>
                              {orders
                                .reduce((prev, next) => {
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
                    </div>
                  </CollapsibleContent>
                </Collapse>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default CustomerOrders;
