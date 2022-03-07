import React from "react";

import useActions from "./actions";
import Loading from "../../components/Loading";
import OrderForm from "../../components/forms/OrderForm";
import PopStoreProductsListing from "../../components/PopStoreProductsListing/PopStoreProductsListing";

const PopStore = () => {
  const { loading, products, formik, updateProductQuantity } = useActions();

  if (loading) return <Loading />;
  return (
    <div>
      <PopStoreProductsListing
        products={products}
        onUpdateProductQuantity={(event, productName) =>
          updateProductQuantity(event, productName)
        }
      />
      <OrderForm formik={formik} />
    </div>
  );
};

export default PopStore;
