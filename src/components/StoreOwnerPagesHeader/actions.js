import React from "react";
import { useLocation, useParams } from "react-router-dom";

export default function useActions() {
  const { pathname } = useLocation();
  const { storeName } = useParams();
  const currentRouteName = pathname.split("/")[3];

  const pageTitle = currentRouteName.substring(0, currentRouteName.length - 1);
  return { pageTitle, storeName };
}
