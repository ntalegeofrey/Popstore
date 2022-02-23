import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route exact path="/my-popstore" element={<MyPopstore />} />
          <Route path="/new-popstore" element={<NewPopstore />} />
          <Route path="/map-your-data" element={<MapYourData />} />
          <Route path=":id/:storeName" element={<StoreOwnerPages />}>
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="packaging" element={<PackagingPage />} />
          </Route>
          <Route path=":storeOwnerId/:storeName" element={<PopStore />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
