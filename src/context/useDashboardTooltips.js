import { createContext, useContext } from "react";

export const titles = [
  "Paste the data you copied from a spreedsheet here",
  "Click “Create PopStore” to convert your data into a PopStore",
  "View analytics about your PopStores",
  "Copy the link of your PopStore to share it your customers",
  "Click on your PopStore to view & edit your store, order, customers and packing",
];

const addTooltipRef = (el, index) => ({})

export const DashboardTooltipsContext = createContext({ refs: [], addTooltipRef,titles });

export const useDashboardTooltips = () => useContext(DashboardTooltipsContext);
