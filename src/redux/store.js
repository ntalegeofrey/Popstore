import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import csvTextReducer from "./csvText";
export const store = configureStore({
  reducer: {
    user: userReducer,
    csvText: csvTextReducer
  }
});
