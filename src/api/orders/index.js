import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";

const getOrdersRef = ({ storeOwnerID }) =>
  collection(db, "StoreOwners", storeOwnerID, "AllOrders");

const getAllOrdersByStore = ({ storeOwnerID, storeID }) => {
  const ordersQuery = query(
    getOrdersRef({ storeOwnerID }),
    where("storeID", "==", storeID)
  );

  return getDocs(ordersQuery);
};

export { getAllOrdersByStore };
