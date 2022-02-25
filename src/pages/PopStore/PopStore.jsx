import React from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as yup from "yup";

import Loading from "../../components/Loading";

import { db } from "../../service/firebase";

const Heading = styled(Typography)({
  fontWeight: 600,
});

const validationSchema = yup.object({
  name: yup
    .string("Enter your name")
    .min(2)
    .max(256)
    .required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string("Enter your phone")
    .min(10, "Phone should be of minimum 10 characters length")
    .max(15, "Phone should be of maximum 15 characters length")
    .required("Phone is required"),
});

const PopStore = () => {
  const matches = useMediaQuery("(min-width:600px)");
  const { storeOwnerID, storeID } = useParams();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // alert(JSON.stringify(values, null, 2));
      const orderPlaced = await handleOrder(values);
      if (orderPlaced) resetForm();
    },
  });

  const getProducts = async () => {
    setLoading(true);
    const productsRef = collection(
      db,
      "StoreOwners",
      storeOwnerID,
      "allStores",
      storeID,
      "Colums"
    );
    const productsSnapShot = await getDocs(productsRef);
    productsSnapShot.docs.forEach((product) =>
      console.table({ id: product.id, ...product.data() })
    );

    const productNames = productsSnapShot.docs
      .filter((product) => product.data().name.toLowerCase() === "name")[0]
      .data()["items"];

    const productPrices = productsSnapShot.docs
      .filter((product) => product.data().name.toLowerCase() === "price")[0]
      .data()["items"];

    console.log(productNames);
    console.log(productPrices);

    setProducts(
      productNames.map((name, index) => ({
        name,
        price: productPrices[index],
        quantity: 0,
      }))
    );
    setLoading(false);
  };

  const updateProductQuantity = (event, productName) => {
    console.log(event.target.value);
    setProducts(
      products.map((product) => {
        if (product.name === productName) {
          product.quantity = Number(event.target.value);
        }
        return product;
      })
    );
  };

  const getAddedProducts = () =>
    products.filter((product) => product.quantity !== 0);

  const resetProducts = () => {
    setProducts(
      products.map((product) => {
        product.quantity = 0;
        return product;
      })
    );
  };

  const handleOrder = async (customer) => {
    const OrderedProducts = getAddedProducts();
    if (!OrderedProducts.length) {
      toast.error("No items added!");
      return false;
    }
    const order = {
      OrderedProducts,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      storeID: storeID,
      orderedAt: serverTimestamp(),
    };
    console.log("order created", order);

    // Add a new document with a generated id.
    const allOrdersRef = collection(
      db,
      "StoreOwners",
      storeOwnerID,
      "AllOrders"
    );
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        const docRef = await addDoc(allOrdersRef, order);
        console.log("Document written with ID: ", docRef.id);
        resetProducts();
        resolve("");
      } catch (e) {
        reject("Could not place order, Try again later!!");
      }
    });
    toast.promise(myPromise, {
      loading: "placing order...",
      success: "Order placed successfully!!",
      error: (err) => err.message,
    });
    return true;
  };

  const getTotalOrderPrice = () => {
    return products.reduce((totalOrderPrice, currentOrderItem) => {
      return (
        totalOrderPrice +
        Number(currentOrderItem.quantity) * currentOrderItem.price
      );
    }, 0);
  };

  React.useEffect(() => {
    getProducts();
  }, []);

  React.useEffect(() => {
    console.log(products);
  }, [products]);

  if (loading) return <Loading />;
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3} md={6}>
          <Heading>Item</Heading>
        </Grid>
        <Grid item xs={3} md={2}>
          <Heading>Price</Heading>
        </Grid>
        <Grid item xs={3} md={2}>
          <Heading>Quantity</Heading>
        </Grid>
        <Grid item xs={3} md={2} container justifyContent={"flex-end"}>
          <Heading>Total</Heading>
        </Grid>
      </Grid>
      {products.map((product) => (
        <Grid
          container
          spacing={1}
          mt={3}
          alignItems="center"
          key={product.name}
        >
          <Grid item xs={3} md={6}>
            {product.name}
          </Grid>
          <Grid item xs={3} md={2}>
            {product.price} SEK
          </Grid>
          <Grid item xs={3} md={2}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="number"
              value={product.quantity.toString()}
              onChange={(event) => updateProductQuantity(event, product.name)}
            />
          </Grid>
          <Grid item xs={3} md={2} container justifyContent={"flex-end"}>
            {product.price * product.quantity} SEK
          </Grid>
        </Grid>
      ))}
      <Box sx={{ display: "flex", flexDirection: "row-reverse" }} mt={2}>
        <Typography>{getTotalOrderPrice()} SEK</Typography>
        <Heading mr={2}>Total</Heading>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: !matches ? "space-between" : "flex-start",
            alignItems: "center",
          }}
          mt={5}
        >
          <Typography mr={2}>Name:</Typography>
          <TextField
            name="name"
            variant="outlined"
            label="Name"
            size="small"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: !matches ? "space-between" : "flex-start",
            alignItems: "center",
          }}
          mt={2}
        >
          <Typography mr={2}>E-mail:</Typography>
          <TextField
            name="email"
            variant="outlined"
            label="Email"
            size="small"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: !matches ? "space-between" : "flex-start",
            alignItems: "center",
          }}
          mt={2}
        >
          <Typography mr={2}>Phone:</Typography>
          <TextField
            name="phone"
            variant="outlined"
            label="Phone"
            size="small"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          mt={3}
        >
          <Button type="submit" variant="contained">
            Order
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default PopStore;
