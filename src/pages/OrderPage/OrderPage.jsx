import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import firebase, {doc, getDoc} from "../../service/firebase";
import { db, collection, getDocs, where, query } from "../../service/firebase";
import { useNavigate, Link, useParams } from "react-router-dom";

const OrderPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const { ownerId, storeId, orderId } = useParams();
    const [store, setStore] = useState({});
    const [order, setOrder] = useState({});
    useEffect(async () => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
            }
        });
        const storesRef = await collection(db, `/StoreOwners/${ownerId}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if (store.exists()) {
            let data = store.data();
            data.columnsList = JSON.parse(data.columnsList);
            setStore(data);
        }
        const orderRef = await collection(db, `/StoreOwners/${ownerId}/allStores/${storeId}/Orders`);
        const order = await getDoc(doc(orderRef, orderId));
        if (order.exists()) {
            let orderData = order.data();
            orderData.order = JSON.parse(orderData.order);
            let temp = [];
            orderData.order.forEach((p) => {
                if(p !== null){
                    if(p.quantity != 0) {
                        temp.push(p);
                    }
                }
            });
            orderData.order = temp;
            setOrder(orderData);
        }
    }, [navigate]);
    useEffect(async () => {
    }, []);

    return (
        <Container maxWidth="lg">
            <div className="popstore-wrapper">
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography style={{ marginBottom: "20px" }} variant="h3">
                            {store?.storeName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography style={{ marginBottom: "20px" }} variant="h4">
                            Order Information <small varient="small">({order?.email})</small>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
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
                    {order?.order?.map((product, index) => {
                        return <Grid container spacing={2} key={index} style={{marginBottom: "1rem"}}>
                            <Grid item xs={3} md={6}>
                                <p>{store?.columnsList[product.id][1]}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{store?.columnsList[product.id][2]} {store?.currency}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{product.quantity}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{Number(parseFloat((store?.columnsList[product.id][2]).replace(/,/, '')) * parseFloat(product?.quantity ? product?.quantity : 0)).toFixed(2)} {store?.currency}</p>
                            </Grid>
                        </Grid>
                    })}
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={8} textAlign="right">
                        <p>&nbsp;</p>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Grand Total</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>
                            {(order?.order?.reduce((prev, next) => {
                                return prev + parseFloat(store?.columnsList[next.id][2].replace(/,/, '')) * parseFloat(next.quantity)
                            }, 0))?.toFixed(2)} {store?.currency}
                        </h4>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default OrderPage;
