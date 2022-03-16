import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import Grid from "@mui/material/Grid";
import ProductTable from "../../components/Product_Table/ProductTable";
import Button from "@mui/material/Button";
import firebase, {doc, getDoc} from "../../service/firebase";
import { db, collection, getDocs, where, query } from "../../service/firebase";
import { useNavigate, Link, useParams } from "react-router-dom";
import {MenuItem, Select, TextField} from "@mui/material";

const OrdersPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const { storeId } = useParams();
    const [store, setStore] = useState({});
    const [customer, setCustomer] = useState({});
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
                const store = await getDoc(doc(storesRef, storeId));
                if(store.exists()){
                    let data = store.data();
                    data.columnsList = JSON.parse(data.columnsList);
                    setStore(data);
                }
                const ordersRef = collection(db, `/StoreOwners/${user.uid}/allStores/${storeId}/Orders`);
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
                        if(p !== null){
                            // check if order already exists
                            let index = orders.findIndex((e) => e.id == p.id);
                            if(index == -1){
                                orders.push(p);
                            } else {
                                orders[index].quantity += p.quantity;
                            }
                        }
                    });
                });
                setOrders(orders);
            } else {
                navigate("/");
            }
        });
    }, [navigate]);
    useEffect(async () => {
    }, []);

    return (
        <Container maxWidth="lg">
            <div className="popstore-wrapper">
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={4} md={4}>
                        <Typography style={{ marginBottom: "20px" }} variant="h4">
                            Orders List
                        </Typography>
                    </Grid>
                    <Grid item xs={4} md={4} alignSelf="center">
                        <Link to='/popstore/all'>
                            Close
                        </Link>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <div className="logout-button">
                            <LogoutButton user={user?.photoURL} />
                        </div>
                    </Grid>
                </Grid>
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography style={{ marginBottom: "1rem" }} variant="h6">
                            {store?.storeName}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <div style={{backgroundColor: "#fff", padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={5} md={5}>
                        <h4>Total</h4>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <h4>
                            {(orders.reduce((prev, next) => {
                                return prev + parseFloat(store.columnsList[next.id][2]) * parseFloat(next.quantity)
                            }, 0)).toFixed(2)} SEK
                        </h4>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={5} md={5}>
                        <h5>Product</h5>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <h5>Price</h5>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <h5>Quantity</h5>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <h5>Total</h5>
                    </Grid>
                </Grid>
                {orders?.map((order, index) => {
                    return (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={5} md={5}>
                                <p>{store.columnsList[order.id][1]}</p>
                            </Grid>
                            <Grid item xs={2} md={2}>
                                <p>{store.columnsList[order.id][2]} SEK</p>
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <p>{order.quantity}</p>
                            </Grid>
                            <Grid item xs={2} md={2}>
                                <p>{(parseFloat(store.columnsList[order.id][2]) * parseFloat(order.quantity)).toFixed(2)} SEK</p>
                            </Grid>
                        </Grid>
                    )
                })}
            </div>
        </Container>
    );
};

export default OrdersPage;
