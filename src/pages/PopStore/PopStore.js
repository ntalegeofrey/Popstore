import CopyAllIcon from "@mui/icons-material/CopyAll";
import { Grid, TextField, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import Loading from "../../components/Loading";
import { StyledTextField } from "../../components/Styles/styledTextField";
import sendMail from "../../service/email";
import {
  collection,
  db,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "../../service/firebase";

const PopStore = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [store, setStore] = useState();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const { ownerId, storeId } = useParams();
  const [order, setOrder] = useState([]);
  const MySwal = withReactContent(Swal);
  const [usercurrency] = React.useState();
  const [storecurrency, setStoreCurrency] = React.useState();
  const [submitting, setSubmitting] = React.useState(false);
  const [storeLink, setStoreLink] = useState("");
  const [orderRef, setOrderRef] = useState(null);
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);
  const [lockedState, setLockedState] = useState();
  let total = 0;
  const getData = async () => {
    // const res = await axios.get('https://geolocation-db.com/json/').then(res => {
    //   setIP(res.data.IPv4)
    //   setUserData(res.data)
    //   setUserCountry(res.data.country_name)
    //   convertCurrency(res.data.country_name)
    // })
  };
  const runconvertCurrency = async () => {
    // if(usercurrency){
    //   const res = await axios.get('https://api.currencyapi.com/v3/latest?apikey='+process.env.REACT_APP_CURRENCY_API_KEY+'&value=1&base_currency='+storecurrency+'&currencies='+usercurrency).then(res => {
    //     setConvertedPrice(res.data.data[usercurrency].value)
    //   });
    // }
  };
  React.useEffect(() => {
    setStoreLink(process.env.REACT_APP_STORE_LINK); // Set the store link using environment variable
  }, []);
  React.useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);
  React.useEffect(() => {
    //passing getData method to the lifecycle method
    runconvertCurrency();
  }, [storecurrency]);
  React.useEffect(() => {
    //passing getData method to the lifecycle method
    runconvertCurrency();
  }, [usercurrency]);
  useEffect(() => {
    (async () => {
      const storesRef = await collection(
        db,
        `/StoreOwners/${ownerId}/allStores`
      );
      const store = await getDoc(doc(storesRef, storeId));
      if (store.exists()) {
        let data = store.data();
        data.columnsList = JSON.parse(data.columnsList);
        let lock = data.locked;
        setStore(data);
        setStoreCurrency(data.currency);
        setLockedState(lock);
        setLoading(false);
      }
    })();
  }, [ownerId, storeId]);

  const saveOrder = async () => {
    setSubmitting(true);

    if (!isEmail(email) || email.trim() === "") {
      await MySwal.fire({
        title: "Error",
        text: "Please enter your email",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setSubmitting(false);
      return;
    }

    if (!isMobilePhone(phone) || phone.trim() === "") {
      await MySwal.fire({
        title: "Error",
        text: "Please enter your phone number",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setSubmitting(false);
      return;
    }

    if (order.length === 0) {
      await MySwal.fire({
        title: "Error",
        text: "Please add some items to your order",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setSubmitting(false);
      return;
    }

    // Check if a customer with this email already exists
    const customersRef = await collection(
      db,
      `/StoreOwners/${ownerId}/allStores/${storeId}/customers`
    );
    const customer = await getDoc(doc(customersRef, email));
    if (!customer.exists()) {
      // Create a new customer
      const newCustomer = {
        uid: null,
        email: email.toLowerCase(),
        phone: phone,
        name: name,
        comment: comment,
        createdAt: serverTimestamp(),
      };
      let newCustomerRef = await doc(customersRef, email);
      await setDoc(newCustomerRef, newCustomer);
    }

    const Order = {
      uid: null,
      email: email.toLowerCase(),
      phone: phone,
      name: name,
      comment: comment,
      order: JSON.stringify(order),
      storeId: storeId,
      createdAt: serverTimestamp(),
    };

    const ordersRef = await collection(
      db,
      `/StoreOwners/${ownerId}/allStores/${storeId}/Orders`
    );
    const orderRef = await doc(ordersRef);
    await setDoc(orderRef, Order);
    setOrderRef(orderRef);
    console.log("order: ", orderRef);
    await MySwal.fire({
      title: "Success",
      text: "Your order has been placed",
      icon: "success",
      confirmButtonText: "Ok",
    });

    let orderConfirmationEmail = `
            <!doctype html>
            <html lang="en">
            <head>
            <style>
               body{
                    font-family: 'Arial', Helvetica, Arial, Lucida, sans-serif;
               }
            </style>
            <title>PopStore Order</title>
            </head>
            <body>
            <h1>Order Confirmation</h1>
            <p>Thank you for your order. Your order from <b>${store.storeName}</b> has been placed successfully. You can view your order by visiting the following link:</p>
            <p><a href="${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}">View Order</a></p>
            <p>&nbsp;</p>
            <p>Regards</p>
            <p>PopStore Team</p>
            </body>
            </html>
            `;
    sendMail(email, "PopStore Order Confirmation", orderConfirmationEmail);
    setOrder([]);
    setEmail("");
    setPhone("");
    setName("");
    setComment("");
    setSubmitting(false);

    let newOrderEmail = `
            <!doctype html>
            <html lang="en">
            <head>
            <style>
               body{
                    font-family: 'Arial', Helvetica, Arial, Lucida, sans-serif;
               }
            </style>
            <title>New PopStore Order</title>
            </head>
            <body>
            <h1>Order</h1>
            <p>A new order has been placed on <b>${store.storeName}</b>. You can view your order by visiting the following link:</p>
            <p><a href="${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}">View Order</a></p>
            <p>&nbsp;</p>
            <p>Regards</p>
            <p>PopStore Team</p>
            </body>
            </html>
            `;
    if (isEmail(store.storeOwner)) {
      sendMail(store.storeOwner, "New PopStore Order", newOrderEmail);
    }
  };

  const handleCopy = (e) => {
    const link = `${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}`;
    // Copy the link to clipboard
    navigator.clipboard.writeText(link);

    // Show snack bar
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <Loading />;
  return (
    <div>
      {lockedState ? (
        <Container
          maxWidth="lg"
          style={{
            width: "100%",
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "middle",
          }}
        >
          <div>
            <Typography
              variant="h5"
              align="center"
              fontWeight={500}
              fontSize="32px"
            >
              The Store is Currently closed.
            </Typography>
          </div>
        </Container>
      ) : (
        <Container maxWidth="lg">
          <Grid container paddingBottom="25px" alignItems="center" spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="h2">{store.storeName}</Typography>
            </Grid>
            <Grid item xs={6} md={5}>
              <Button
                variant="contained"
                startIcon={<CopyAllIcon />}
                onClick={() => handleCopy()}
              >
                Copy Link
              </Button>
              <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                  vertical: "bottom", // Position the Snackbar at the bottom
                  horizontal: "center", // Center the Snackbar horizontally
                }}
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
            </Grid>
            <Grid container item xs={6} md={4} justifyContent="flex-end">
              <Grid item>
                <Button
                  style={{ marginLeft: "1rem" }}
                  color="primary"
                  variant="contained"
                  disabled={submitting}
                  onClick={saveOrder}
                >
                  {isMobile ? "Order" : "Complete Order"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container paddingBottom="25px">
            <Grid item xs={12} md={3}>
              <Typography variant="h5" fontWeight="bold">
                <span>Contact: &nbsp;</span>
                {store.storeOwner}
              </Typography>
            </Grid>
          </Grid>
          <Grid container paddingBottom="25px">
            <Grid item xs={12} md={3}>
              <Typography variant="body">{store.description}</Typography>
            </Grid>
          </Grid>
          <Grid container paddingBottom="25px" spacing={2}>
            <Grid item xs={12} md={3}>
              <div>
                <Typography variant="body" color="text.main">
                  Name
                </Typography>
              </div>
              <StyledTextField
                fullWidth
                id="outlined-basic"
                label=""
                helperText=""
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div>
                <Typography variant="body" color="text.main">
                  Email Address
                </Typography>
              </div>
              <StyledTextField
                fullWidth
                id="outlined-basic"
                label=""
                helperText=""
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div>
                <Typography variant="body" color="text.main">
                  Phone Number
                </Typography>
              </div>
              <StyledTextField
                fullWidth
                id="outlined-basic"
                label=""
                helperText=""
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div>
                <Typography variant="body" color="text.main">
                  Would you like to add any note/ comment in your order?
                </Typography>
              </div>
              <StyledTextField
                multiline
                fullWidth
                id="outlined-basic"
                label=""
                helperText=""
                variant="outlined"
                inputProps={{
                  style: {
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  },
                }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>
          </Grid>
          <div>
            <Grid
              container
              sx={{
                backgroundColor: "primary.main",
                paddingLeft: isMobile ? "2px" : "50px",
              }}
              pt="9px"
              pb="9px"
            >
              <Grid item xs={2} md={3}>
                <Typography
                  variant={isMobile ? "body2" : "h5"}
                  color="white.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {isMobile ? "Ref ID" : "Reference ID"}
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <Typography
                  variant={isMobile ? "body2" : "h5"}
                  color="white.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Products
                </Typography>
              </Grid>
              <Grid item xs={2} md={2}>
                <Typography
                  variant={isMobile ? "body2" : "h5"}
                  color="white.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Price
                </Typography>
              </Grid>
              <Grid item xs={3} md={2}>
                <Typography
                  variant={isMobile ? "body2" : "h5"}
                  color="white.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Quantity
                </Typography>
              </Grid>
              <Grid item xs={1} md={2}>
                <Typography
                  variant={isMobile ? "body2" : "h5"}
                  color="white.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Amount
                </Typography>
              </Grid>
            </Grid>
            <div>
              {store.columnsList?.map((column, index) => {
                return (
                  <Grid
                    container
                    key={index}
                    sx={{
                      paddingLeft: isMobile ? "2px" : "50px",
                      backgroundColor: "background2",
                      borderBottom: "1px solid",
                      borderTop: "1px solid",
                      borderTopColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.3),
                      borderBottomColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.3),
                      paddingTop: "9px",
                      paddingBottom: "9px",
                      "&:first-child": {
                        borderTop: "none",
                      },
                      "&:nth-last-child(2)": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <Grid item xs={2} md={3}>
                      <p>{column[0]}</p>
                    </Grid>
                    <Grid item xs={3} md={3}>
                      <p>{column[1]}</p>
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <p>
                        {column[2]} {store.currency}
                      </p>
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <TextField
                        id="outlined-basic"
                        label=""
                        helperText=""
                        type="number"
                        variant="outlined"
                        value={order[index]?.quantity}
                        defaultValue={0}
                        disabled={store.locked}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: "50%",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid",
                            borderColor: "#353535",
                            borderRadius: "6px",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&:hover": {
                              borderColor: (theme) =>
                                theme.palette.primary.main,
                            },
                            "&:focused": {
                              borderColor: (theme) =>
                                theme.palette.primary.main,
                            },
                          },
                        }}
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) {
                            e.target.value = (0).toString();
                            // set default value and value of TextField to 0
                            order[index] = {
                              ...order[index],
                              quantity: 0,
                              id: index,
                            };
                          } else {
                            let newOrder = [...order];
                            newOrder[index] = {
                              ...newOrder[index],
                              quantity:
                                Number(e.target.value) < 0
                                  ? 0
                                  : parseInt(e.target.value),
                              id: index,
                            };
                            setOrder(newOrder);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <p>
                        {Number(
                          Number(column[2].replace(/,/, "")) *
                            Number(
                              Number(order[index]?.quantity)
                                ? order[index]?.quantity
                                : 0
                            )
                        ).toFixed(2)}{" "}
                        {store.currency}
                      </p>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={6} md={8} textAlign="right">
                  <p>&nbsp;</p>
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={2}
                  sx={{ backgroundColor: "greyBackground" }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "regular" }}>
                    Total
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={2}
                  sx={{ backgroundColor: "greyBackground" }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "regular" }}>
                    {order?.forEach((item, index) => {
                      if (item) {
                        total +=
                          Number(item.quantity) *
                          Number(
                            (store?.columnsList[item.id][2]).replace(/,/, "")
                          );
                      }
                    })}{" "}
                    {Number(total).toFixed(2)} {store.currency}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
          {!store.locked && (
            <div style={{ paddingTop: "10px" }}>
              <Grid container xs={12} md={12} justifyContent="flex-end">
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={submitting}
                    onClick={saveOrder}
                  >
                    {isMobile ? "Order" : "Complete Order"}
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

export default PopStore;
