import React from "react";

import { useParams } from "react-router-dom";

import { getStoreID } from "../../api/stores";
import { getAllOrdersByStore } from "../../api/orders";

export default function useActions() {
  const { storeOwnerID, storeName } = useParams();
  const [customersByOrder, setCustomersByOrder] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState();
  const [totalOrderPrice, setTotalOrderPrice] = React.useState(0);

  const getOrders = async () => {
    const storeID = await getStoreID({ storeOwnerID, storeName });

    return getAllOrdersByStore({ storeOwnerID, storeID });
  };

  const groupCustomersByOrder = async () => {
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
    groupCustomersByOrder();
  }, []);

  return {
    customersByOrder,
    selectedCustomer,
    updateSelectedCustomer,
    totalOrderPrice,
  };
}
