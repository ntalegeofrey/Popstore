import React from "react";

export default function useActions({ products }) {
  const getTotalOrderPrice = () => {
    return products.reduce((totalOrderPrice, currentOrderItem) => {
      return (
        totalOrderPrice +
        Number(currentOrderItem.quantity) * currentOrderItem.price
      );
    }, 0);
  };
  return { getTotalOrderPrice };
}
