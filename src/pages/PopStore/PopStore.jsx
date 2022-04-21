import React, {useEffect, useState} from "react";
import Loading from "../../components/Loading";
import {
    Grid,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import firebase, {collection, db, getDoc, doc, serverTimestamp, setDoc} from "../../service/firebase";
import { useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import sendMail from "../../service/email";

const PopStore = () => {
    const [store, setStore] = useState();
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState();
    const {ownerId, storeId } = useParams();
    const [order, setOrder] = useState([]);
    const MySwal = withReactContent(Swal)
    const [usercurrency,setUserCurrency] = React.useState();
    const [ip,setIP] = React.useState();
    const [usercountry,setUserCountry] = React.useState();
    const [storecurrency,setStoreCurrency] = React.useState();
    const [userdata,setUserData] = React.useState();
    const [convertedprice,setConvertedPrice] = React.useState();
    let total = 0;
  const eurocurrencies={
    'Albania': 'ALL',
    'Andorra': 'EUR',
    'Armenia': 'AMD',
    'Austria': 'EUR',
    'Azerbaijan': 'AZN',
    'Belarus': 'BYN',
    'Belgium': 'EUR',
    'Bosnia and Herzegovina': 'BAM',
    'Bulgaria': 'BGN',
    'Croatia': 'HRK',
    'Cyprus': 'EUR',
    'Czechia': 'CZK',
    'Denmark': 'DKK',
    'Estonia': 'EUR',
    'Finland': 'EUR',
    'France': 'EUR',
    'Georgia': 'GEL',
    'Germany': 'EUR',
    'Greece': 'EUR',
    'Hungary': 'HUF',
    'Iceland': 'ISK',
    'Ireland': 'EUR',
    'Italy': 'EUR',
    'Latvia': 'EUR',
    'Liechtenstein': 'CHF',
    'Lithuania': 'EUR',
    'Luxembourg': 'EUR',
    'Malta': 'EUR',
    'Moldova': 'MDL',
    'Monaco': 'EUR',
    'Montenegro': 'EUR',
    'Netherlands': 'EUR',
    'North Macedonia': 'MKD',
    'Norway': 'NOK',
    'Poland': 'PLN',
    'Portugal': 'EUR',
    'Romania': 'RON',
    'Russia': 'RUB',
    'San Marino': 'EUR',
    'Serbia': 'RSD',
    'Slovakia': 'EUR',
    'Slovenia': 'EUR',
    'Spain': 'EUR',
    'Sweden': 'SEK',
    'Switzerland': 'CHF',
    'Turkey': 'TRY',
    'Ukraine': 'UAH',
    'United Kingdom': 'GBP',
    'Vatican City': 'EUR',
    'Pakistan': 'PKR',
  }
  const getData = async () => {
    // const res = await axios.get('https://geolocation-db.com/json/').then(res => {
    //   setIP(res.data.IPv4)
    //   setUserData(res.data)
    //   setUserCountry(res.data.country_name)
    //   convertCurrency(res.data.country_name)
    // })

  }

  const convertCurrency =async(country)=>{
    // Object.keys(eurocurrencies).map(async(key)=>{
    //   if(key===country){
    //     setUserCurrency(eurocurrencies[key])
    //   }
    // });

  }
  const runconvertCurrency = async()=>{
    // if(usercurrency){
    //   const res = await axios.get('https://api.currencyapi.com/v3/latest?apikey='+process.env.REACT_APP_CURRENCY_API_KEY+'&value=1&base_currency='+storecurrency+'&currencies='+usercurrency).then(res => {
    //     setConvertedPrice(res.data.data[usercurrency].value)
    //   });
    // }
  }
  React.useEffect( () => {
    //passing getData method to the lifecycle method
    getData()
  }, [])
  React.useEffect( () => {
    //passing getData method to the lifecycle method
    runconvertCurrency()
  }, [storecurrency])
  React.useEffect( () => {
    //passing getData method to the lifecycle method
    runconvertCurrency()
  }, [usercurrency])
    useEffect(async () => {
        const storesRef = await collection(db, `/StoreOwners/${ownerId}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if(store.exists()){
            let data = store.data();
            data.columnsList = JSON.parse(data.columnsList);
            setStore(data);
            setStoreCurrency(data.currency)
            setLoading(false);
        }
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            }
        });
    }, []);

  const getTotal = () => {
      console.log(order);
  }

    const saveOrder = async () => {

        if(!isEmail(email) || email.trim() == ""){
            await MySwal.fire({
                title: 'Error',
                text: 'Please enter your email',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        if(!isMobilePhone(phone) || phone.trim() == ""){
            await MySwal.fire({
                title: 'Error',
                text: 'Please enter your phone number',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        if(order.length == 0){
            await MySwal.fire({
                title: 'Error',
                text: 'Please add some items to your order',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        // Check if a customer with this email already exists
        const customersRef = await collection(db, `/StoreOwners/${ownerId}/allStores/${storeId}/customers`);
        const customer = await getDoc(doc(customersRef, email));
        if(!customer.exists()){
            // Create a new customer
            const newCustomer = {
                uid: user.uid || null,
                email: email.toLowerCase(),
                phone: phone,
                name: "",
                createdAt: serverTimestamp()
            }
            let newCustomerRef = await doc(customersRef, email);
            await setDoc(newCustomerRef, newCustomer);
        }

        const Order = {
            uid: user ? user.uid : null,
            email: email.toLowerCase(),
            phone: phone,
            name: "",
            order: JSON.stringify(order),
            storeId: storeId,
            createdAt: serverTimestamp()
        }

        const ordersRef = await collection(db, `/StoreOwners/${ownerId}/allStores/${storeId}/Orders`);
        const orderRef = await doc(ordersRef);
        await setDoc(orderRef, Order);
        await MySwal.fire({
            title: 'Success',
            text: 'Your order has been placed',
            icon: 'success',
            confirmButtonText: 'Ok'
        })

        let storeLink = process.env.REACT_APP_STORE_LINK;

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
    }

  if (loading) return <Loading />;
  return (
    <div>
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <h1>PopStore</h1>
                    <h2>{store.storeName}</h2>
                    <p>{store.description}</p>
                </Grid>
            </Grid>
            <div style={{backgroundColor: "#fff", padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={3} md={6}>
                        <h4>Items</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Price</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Quantity</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Total</h4>
                    </Grid>
                </Grid>
                <div>
                    {store.columnsList?.map((column, index) => {
                        return <Grid container spacing={2} key={index} style={{marginBottom: "1rem"}}>
                            <Grid item xs={3} md={6}>
                                <p>{column[1]}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{parseInt(column[2])} {store.currency}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Quantity"
                                    helperText=""
                                    type="number"
                                    variant="outlined"
                                    value={order[index]?.quantity}
                                    defaultValue={0}
                                    disabled={store.locked}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        if(!e.target.value || Number(e.target.value) < 0){
                                            e.target.value = (0).toString();
                                            // set default value and value of TextField to 0
                                            order[index] = {
                                                ...order[index],
                                                quantity: 0,
                                                id: index
                                            }

                                        } else {
                                            let newOrder = [...order];
                                            newOrder[index] = {
                                                ...newOrder[index],
                                                quantity: Number(e.target.value) < 0 ? 0 : parseInt(e.target.value),
                                                id: index
                                            };
                                            setOrder(newOrder);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{Number(Number(column[2].replace(/,/, '')) * Number(Number(order[index]?.quantity) ? order[index]?.quantity : 0)).toFixed(2)} {store.currency}</p>
                            </Grid>
                        </Grid>
                    })}
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={8} textAlign="right">
                            <p>&nbsp;</p>
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <h4>Grand Total</h4>
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <h4>
                                {order?.map((item, index) => {
                                        if(item){
                                            total += (Number(item.quantity) * Number((store?.columnsList[item.id][2]).replace(/,/, '')));
                                        }
                                })} {Number(total).toFixed(2)} {store.currency}
                            </h4>
                        </Grid>
                    </Grid>
                </div>
            </div>
            { !store.locked && <div style={{padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={4} md={1} alignSelf="center">
                        <label>Email:</label>
                    </Grid>
                    <Grid item xs={8} md={3} alignSelf="center">
                        <TextField
                            id="outlined-basic"
                            label="Your Email"
                            helperText=""
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} md={1} alignSelf="center">
                        <label>Phone:</label>
                    </Grid>
                    <Grid item xs={8} md={3} alignSelf="center">
                        <TextField
                            id="outlined-basic"
                            label="Your Phone"
                            helperText=""
                            type="phone"
                            variant="outlined"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} alignSelf="center" textAlign="right">
                        <Button
                            style={{marginLeft: '1rem'}}
                            color="primary"
                            variant="contained"
                            onClick={saveOrder}
                            >
                            Order
                        </Button>
                    </Grid>
                </Grid>
            </div> }
        </Container>
    </div>
  );
};

export default PopStore;
