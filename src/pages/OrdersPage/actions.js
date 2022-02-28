import React from "react";
import { useParams } from "react-router-dom";

import { getAllOrdersByStore } from "../../api/orders";

export default function useActions() {
  const { storeOwnerID, storeID } = useParams();
  const [orders, setOrders] = React.useState([]);

  const getOrders = async () => {
    const orders = await getAllOrdersByStore({ storeOwnerID, storeID });

    const groupedOrders = groupOrderedProducts(orders.docs);

    setOrders(groupedOrders);
  };

  const groupOrderedProducts = (allOrders) => {
    let orderId = 0;
    const groupedOrders = allOrders.reduce(
      (allOrders, currentOrder) => {
        const orderedProducts = currentOrder
          .data()
          .OrderedProducts.map((orderedProduct, index) => {
            ++orderId;
            return {
              _id: currentOrder.id,
              id: orderId,
              ...orderedProduct,
            };
          });

        return allOrders.concat(orderedProducts);
      },

      []
    );
    return groupedOrders;
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  return { orders };
}
