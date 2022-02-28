import { query, getDoc, doc } from "firebase/firestore";
import { db } from "../../service/firebase";

// const getStoresRef = ({ storeOwnerID, storeID }) =>
//   collection(db, "StoreOwners", storeOwnerID, "allStores");

const getStoreByID = async ({ storeOwnerID, storeID }) => {
  const docRef = doc(db, "StoreOwners", storeOwnerID, "allStores", storeID);
  const storeQuery = query(docRef);

  const storeSnapShot = await getDoc(storeQuery);

  return storeSnapShot.data();
};

export { getStoreByID };
