import React from "react";
import { useLocation, useParams } from "react-router-dom";
import firebase from "../../service/firebase";

import { getStoreByID } from "../../api/stores";

export default function useActions() {
  const [store, setStore] = React.useState("");
  const { pathname } = useLocation();
  const { storeOwnerID, storeID } = useParams();
  const currentRouteName = pathname.split("/")[3];
  const [userPhoto, setUserPhoto] = React.useState(null);

  const updateStore = async () => {
    const store = await getStoreByID({ storeOwnerID, storeID });
    setStore(store);
  };

  React.useEffect(() => {
    updateStore();
  }, []);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.multiFactor.user.photoURL);
      }
    });
  }, []);

  const pageTitle = currentRouteName?.substring(0, currentRouteName.length - 1);
  return { pageTitle, store, userPhoto };
}
