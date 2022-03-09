import React, {useEffect, useState} from "react";
import Loading from "../../components/Loading";
import {
    Grid,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import firebase, {collection, db, getDoc, doc, serverTimestamp, setDoc} from "../../service/firebase";
import { useNavigate, useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from 'axios';

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
    const res = await axios.get('https://geolocation-db.com/json/').then(res => {
      setIP(res.data.IPv4)
      setUserData(res.data)
      setUserCountry(res.data.country_name)
      console.log(res.data.country_name)
      console.log("usercountry")
      convertCurrency(res.data.country_name)
    })
    
  }
  
  const convertCurrency =async(country)=>{
    Object.keys(eurocurrencies).map(async(key)=>{
      console.log(country)
      if(key===country){
        setUserCurrency(eurocurrencies[key])
      }
    });
    
  }
  const runconvertCurrency = async()=>{
    if(usercurrency){
      const res = await axios.get('https://api.currencyapi.com/v3/latest?apikey='+process.env.REACT_APP_CURRENCY_API_KEY+'&value=10&base_currency='+storecurrency+'&currencies='+usercurrency).then(res => {
        console.log("result from currency")
        console.log(res)
      });
    }
  }
  React.useEffect( () => {
    //passing getData method to the lifecycle method
    getData()
  }, [])
  React.useEffect( () => {
    //passing getData method to the lifecycle method
    console.log("storecurrency")
    console.log(storecurrency)
    runconvertCurrency()
  }, [storecurrency])
  React.useEffect( () => {
    //passing getData method to the lifecycle method
    console.log("usercurrency")
    console.log(usercurrency)
    runconvertCurrency()
  }, [usercurrency])
    useEffect(async () => {
        const storesRef = await collection(db, `/StoreOwners/${ownerId}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if(store.exists()){
            let data = store.data();
            data.columnsList = JSON.parse(data.columnsList);
            console.log(data)
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

    const saveOrder = async () => {

        if(email.trim() == ""){
            await MySwal.fire({
                title: 'Error',
                text: 'Please enter your email',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        if(phone.trim() == ""){
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
            uid: user.uid || null,
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
                    <Grid item xs={6} md={6}>
                        <h4>Items</h4>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <h4>Price</h4>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <h4>Quantity</h4>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <h4>Total</h4>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {store.columnsList?.map((column, index) => {
                        return <>
                            <Grid item xs={6} md={6}>
                                <p>{column[1]}</p>
                            </Grid>
                            <Grid item xs={2} md={2}>
                                <p>{column[2]} {usercurrency}</p>
                            </Grid>
                            <Grid item xs={2} md={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Quantity"
                                    helperText=""
                                    type="number"
                                    variant="outlined"
                                    value={order[index]?.quantity}
                                    defaultValue={0}
                                    disabled={store.locked}
                                    onChange={(e) => {
                                        let newOrder = [...order];
                                        newOrder[index] = {...newOrder[index], quantity: e.target.value < 0 ? 0 : parseInt(e.target.value), id: index};
                                        setOrder(newOrder);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2} md={2}>
                                <p>{parseFloat(column[2]) * parseFloat(order[index]?.quantity ? order[index]?.quantity : 0)}</p>
                            </Grid>
                        </>
                    })}
                </Grid>
            </div>
            { !store.locked && <div style={{padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={1} md={1} alignSelf="center">
                        <label>Email:</label>
                    </Grid>
                    <Grid item xs={3} md={3} alignSelf="center">
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
                    <Grid item xs={1} md={1} alignSelf="center">
                        <label>Phone:</label>
                    </Grid>
                    <Grid item xs={3} md={3} alignSelf="center">
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
                    <Grid item xs={4} md={4} alignSelf="center" textAlign="right">
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
