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

const PopStore = () => {
    const [store, setStore] = useState();
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [user, setUser] = useState();
    const {ownerId, storeId } = useParams();
    const [order, setOrder] = useState([]);
    const MySwal = withReactContent(Swal)
    useEffect(async () => {
        const storesRef = await collection(db, `/StoreOwners/${ownerId}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if(store.exists()){
            let data = store.data();
            data.columnsList = JSON.parse(data.columnsList);
            setStore(data);
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

        if(order.length == 0){
            await MySwal.fire({
                title: 'Error',
                text: 'Please add some items to your order',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        const Order = {
            uid: user.uid || null,
            email: email,
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
                                <p>{column[2]}</p>
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
                                    onChange={(e) => {
                                        let newOrder = [...order];
                                        newOrder[index] = {...newOrder[index], quantity: e.target.value < 0 ? 0 : parseInt(e.target.value)};
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
            <div style={{padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2} md={2} alignSelf="center">
                        <label>Email:</label>
                    </Grid>
                    <Grid item xs={7} md={7} alignSelf="center">
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
                    <Grid item xs={3} md={3} alignSelf="center" textAlign="right">
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
            </div>
        </Container>
    </div>
  );
};

export default PopStore;
