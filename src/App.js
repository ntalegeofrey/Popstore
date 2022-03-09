import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import "./App.css";
import LandingPage from "./pages/Landing Page/LandingPage";
import MyPopstore from "./pages/My Popstore/MyPopstore";
import NewPopstore from "./pages/New_Popstore/NewPopstore";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import PackagingPage from "./pages/PackagingPage";
import StoreOwnerPages from "./pages/StoreOwnerPages";
import PopStore from "./pages/PopStore";
import NotFound from "./pages/NotFound";

import theme from "./config/theme";
import MapYourData from "./pages/Map_Your_Data/MapYourData";
import EditPopstore from "./pages/EditPopstore/EditPopstore";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route exact path="/popstore/all" element={<MyPopstore />} />
          <Route path="/popstore/create" element={<NewPopstore />} />
          <Route path="/store/:ownerId/:storeId" element={<PopStore />} />
          <Route path="/popstore/edit/:storeId" element={<EditPopstore />} />
          <Route path="/popstore/customers/:storeId" element={<CustomersPage />} />

          <Route path=":storeOwnerID/:storeID" element={<StoreOwnerPages />}>
            <Route index element={<PopStore />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="packagings" element={<PackagingPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
