import React from "react";

import { useSelector } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";

export default function useActions() {
  const [customersByOrder, setCustomersByOrder] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState();
  const [totalOrderPrice, setTotalOrderPrice] = React.useState(0);

  const { userInfo } = useSelector((state) => state.user);
  const storeID = "YcgLsohfAT8ZLZkVdcPK";

  const getOrders = () => {
    const ordersRef = collection(db, "StoreOwners", userInfo.id, "AllOrders");

    const q = query(ordersRef, where("storeID", "==", storeID));

    return getDocs(q);
  };

  const updateCustomersByOrder = async () => {
    const querySnapShot = await getOrders();

    const customerByOrderedProducts = querySnapShot.docs.reduce(
      (allCustomers, currentCustomer) => {
        const existingCustomer = allCustomers.find(
          (customer) =>
            customer.customerEmail === currentCustomer.data().customerEmail
        );

        if (existingCustomer) {
          existingCustomer.OrderedProducts = [
            ...existingCustomer.OrderedProducts,
            ...currentCustomer.data().OrderedProducts,
          ];
        } else {
          allCustomers.push(currentCustomer.data());
        }
        return allCustomers;
      },
      []
    );

    setCustomersByOrder(customerByOrderedProducts);
  };

  const updateSelectedCustomer = (event) => {
    setSelectedCustomer(
      customersByOrder.filter(
        (customer) => customer.customerEmail === event.target.value
      )[0]
    );
  };

  const calculateTotalOrderPrice = () => {
    const totalPrice = selectedCustomer.OrderedProducts.reduce(
      (totalPrice, currentOrder) => {
        return totalPrice + Number(currentOrder.price);
      },
      0
    );

    setTotalOrderPrice(totalPrice);
  };

  React.useEffect(() => {
    const [firstCustomer] = customersByOrder;
    setSelectedCustomer(firstCustomer);
  }, [customersByOrder]);

  React.useEffect(() => {
    if (selectedCustomer) calculateTotalOrderPrice();
  }, [selectedCustomer]);

  React.useEffect(() => {
    updateCustomersByOrder();
  }, []);

  return {
    customersByOrder,
    selectedCustomer,
    updateSelectedCustomer,
    totalOrderPrice,
  };
}
