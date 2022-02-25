import React from "react";
import { useLocation, useParams } from "react-router-dom";
import firebase from "../../service/firebase";

import { getStoreName } from "../../api/stores";

export default function useActions() {
  const [storeName, setStoreName] = React.useState("");
  const { pathname } = useLocation();
  const { storeOwnerID, storeID } = useParams();
  const currentRouteName = pathname.split("/")[3];
  const [userPhoto, setUserPhoto] = React.useState(null);

  const updateStoreName = async () => {
    setStoreName(await getStoreName({ storeOwnerID, storeID }));
  };

  React.useEffect(() => {
    updateStoreName();
  }, []);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.multiFactor.user.photoURL);
      }
    });
  }, []);

  const pageTitle = currentRouteName?.substring(0, currentRouteName.length - 1);
  return { pageTitle, storeName, userPhoto };
}
