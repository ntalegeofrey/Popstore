import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Collapse, IconButton } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import firebase, {
  collection,
  db,
  doc,
  getDoc,
  getDocs,
} from "../../service/firebase";
import {
  CollapsibleContent,
  ItemContainer,
} from "../CustomersPage/CustomersPage";
import { BodyText, HeaderText } from "../OrdersPage/OrdersPage";

const PackingPage = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { storeId } = useParams();
  const [store, setStore] = useState({});
  const [product, setProduct] = useState({});
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerProducts, setCustomerProducts] = useState([]);
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
        const customersRef = collection(
          db,
          `/StoreOwners/${user.uid}/allStores/${storeId}/customers`
        );
        const Customers = await getDocs(customersRef);
        let tempCustomers = [];
        Customers.forEach((doc) => {
          tempCustomers.push(doc.data());
        });
        const ordersRef = collection(
          db,
          `/StoreOwners/${user.uid}/allStores/${storeId}/Orders`
        );
        const querySnapshot = await getDocs(ordersRef);
        let tempOrders = [];
        querySnapshot.forEach((doc, i) => {
          let d = doc.data();
          tempOrders.push(d);
        });
        let orders = [];
        tempOrders.forEach((o) => {
          JSON.parse(o.order).forEach((p) => {
            if (p !== null) {
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

        let tempCustomerProducts = [];
        tempCustomers.forEach((c) => {
          let customer = {
            email: c.email,
            name: c.name,
            phone: c.phone,
            comment: c.comment,
            products: [],
          };
          tempOrders.forEach((o) => {
            if (o.email === c.email) {
              JSON.parse(o.order).forEach((p) => {
                if (p !== null) {
                  let index = customer.products.findIndex((e) => e.id === p.id);
                  if (index === -1) {
                    customer.products.push({ id: p.id, quantity: p.quantity });
                  } else {
                    customer.products[index].quantity += p.quantity;
                  }
                }
              });
            }
          });
          tempCustomerProducts.push(customer);
        });

        let groupedCustomers = [];
        tempCustomerProducts.forEach((customer) => {
          let existingCustomer = groupedCustomers.find(
            (c) =>
              c.email === customer.email &&
              c.name === customer.name &&
              c.phone === customer.phone
          );
          if (existingCustomer) {
            existingCustomer.products = existingCustomer.products.concat(
              customer.products
            );
          } else {
            groupedCustomers.push(customer);
          }
        });

        setCustomerProducts(groupedCustomers);
        setCustomerProducts(tempCustomerProducts);
        setLoading(false);
      } else {
        navigate("/");
      }
    });
  }, [navigate, storeId]);

  const handleToggleCollapse = (rowIndex) => {
    if (expandedRow === rowIndex) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowIndex);
    }
  };
  if (loading) return <Loading />;
  return (
    <Container maxWidth="lg">
      {/* Top Header */}
      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.white.main,
          marginBottom: 3,
          minHeight: "10vh",
          alignItems: "center",
        }}
      >
        <Grid item xs={3} md={3} alignItems="center">
          <HeaderText variant="body1">Reference ID</HeaderText>
        </Grid>
        <Grid item xs={3} md={3} alignItems="center">
          <HeaderText variant="body1">Product</HeaderText>
        </Grid>
        <Grid item xs={3} md={3} alignItems="center">
          <HeaderText variant="body1">Quantity</HeaderText>
        </Grid>
        <Grid item xs={3} md={3} alignItems="center">
          &nbsp;
        </Grid>
      </Grid>
      {/* Table Content */}
      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: (theme) => theme.palette.white.main,
          spacing: 2,
        }}
      >
        {orders.map((order, rowIndex) => (
          <Grid
            item
            xs={12}
            key={rowIndex}
            spacing={2}
            sx={{
              marginTop: "5px",
              backgroundColor: (theme) => theme.palette.background2,
            }}
          >
            <ItemContainer>
              <Grid container>
                <Grid item xs={3} md={3}>
                  {order.id}
                </Grid>
                <Grid item xs={3} md={3}>
                  <p style={{ fontWeight: "1 rem" }}>
                    {store.columnsList[order.id][1]}
                  </p>
                </Grid>
                <Grid item xs={3} md={3}>
                  {order.quantity}
                </Grid>
                <Grid container item xs={3} md={3} justifyContent="flex-end">
                  <IconButton
                    onClick={() => handleToggleCollapse(rowIndex)}
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    {expandedRow === rowIndex ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </ItemContainer>
            <div style={{ marginTop: "5px" }}>
              <Collapse
                in={expandedRow === rowIndex}
                timeout="auto"
                unmountOnExit
              >
                <CollapsibleContent>
                  {customerProducts.map((customer, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        backgroundColor: "#f1f2f4",
                        borderBottom: "1px solid lightgray",
                        borderTop: "1px solid lightgray",
                      }}
                    >
                      {customer.products.map((product) => (
                        <div key={product.id}>
                          <Grid container>
                            <Grid item xs={3} md={3}>
                              <p>{customer.email}</p>
                              <p>{customer.name}</p>
                              <p>{customer.phone}</p>
                            </Grid>
                            <Grid item xs={3} md={3}>
                              &nbsp;
                            </Grid>
                            <Grid item xs={3} md={3}>
                              {product.quantity}
                            </Grid>
                            <Grid item xs={3} md={3}>
                              <BodyText
                                variant="footnote"
                                sx={{ marginBottom: 1, fontWeight: "light" }}
                              >
                                Notes / Comments
                              </BodyText>
                              <BodyText variant="body1">
                                {customer.comment}
                              </BodyText>
                            </Grid>
                          </Grid>
                        </div>
                      ))}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapse>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PackingPage;
