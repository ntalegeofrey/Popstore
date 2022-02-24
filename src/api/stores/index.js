import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";

const getStoresRef = ({ storeOwnerID }) =>
  collection(db, "StoreOwners", storeOwnerID, "allStores");

const getStoreID = async ({ storeOwnerID, storeName }) => {
  const storeQuery = query(
    getStoresRef({ storeOwnerID }),
    where("name", "==", storeName)
  );

  const storeSnapShot = await getDocs(storeQuery);

  const [{ id: storeID }] = storeSnapShot.docs;
  return storeID;
};

export { getStoreID };
