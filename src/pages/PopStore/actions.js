import React from "react";
import { useParams } from "react-router-dom";
import { db } from "../../service/firebase";
import {
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { validationSchema } from "./constants";

export default function useActions() {
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

  React.useEffect(() => {
    getProducts();
  }, []);

  return {
    loading,
    products,
    formik,
    updateProductQuantity,
  };
}
