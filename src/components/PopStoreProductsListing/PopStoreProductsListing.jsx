import React from "react";

import ListingHeader from "./ListingHeader";
import TotalCost from "./TotalCost";
import ListItem from "./ListItem";
import useActions from "./actions";

const PopStoreProductsListing = ({ products, onUpdateProductQuantity }) => {
  const { getTotalOrderPrice } = useActions({ products });
  return (
    <>
      <ListingHeader />
      {products.map((product) => (
        <ListItem
          product={product}
          onUpdateProductQuantity={onUpdateProductQuantity}
        />
      ))}
      <TotalCost total={getTotalOrderPrice()} />
    </>
  );
};

export default PopStoreProductsListing;
