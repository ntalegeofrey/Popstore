import React from "react";

import { useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";

export default function useActions() {
  const [orders, setOrders] = React.useState([]);

  const { userInfo } = useSelector((state) => state.user);
  console.log(userInfo.id);

  const getOrders = async () => {
    const ordersRef = collection(db, "StoreOwners", userInfo.id, "AllOrders");

    const order = await getDocs(ordersRef);

    const allOrderedProducts = order.docs.reduce(
      (allOrders, currentOrder) => {
        let orderId = 0;

        const orderedProducts = currentOrder
          .data()
          .OrderedProducts.map((orderedProduct, index) => {
            ++orderId;
            return { _id: currentOrder.id, id: orderId, ...orderedProduct };
          });

        return allOrders.concat(orderedProducts);
      },

      []
    );
    setOrders(allOrderedProducts);
    console.log("reduced orders ------", allOrderedProducts);
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  return { orders };
}
