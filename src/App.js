import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import MyPopstore from "./pages/MyPopstore/MyPopstore";
import NewPopstore from "./pages/NewPopstore/NewPopstore";
// import OrdersPage from "./pages/OrdersPage/OrdersPage";
import OrderPage from "./pages/OrderPage/OrderPage";
import QRPage from "./pages/QRPage/QRPage";
import CustomersPage from "./pages/CustomersPage/CustomersPage";
import PackagingPage from "./pages/PackingPage/PackingPage";
import PopStore from "./pages/PopStore/PopStore";
import NotFound from "./pages/NotFound/NotFound";
import EditPopstore from "./pages/EditPopstore/EditPopstore";
import ThemeCustomization from "./config/theme";
import Navigation from "./components/Navigation/Navigation";
import MainContainer from "./components/Styles/styledMainContainer";
import { Box } from "@mui/material";
import PopStoreOrders from "./pages/OrdersPage";
import PopStorePackings from "./pages/PackingPage";

function App() {
  return (
    <ThemeCustomization>
      <Toaster />
      <Navigation />
      <MainContainer component={"main"}>
        {/* puts content below appbar */}
        <Box sx={{ height: "45px" }}></Box>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route exact path="/popstore/all" element={<MyPopstore />} />
          <Route path="/popstore/create" element={<NewPopstore />} />
          <Route path="/store/:ownerId/:storeId" element={<PopStore />} />
          <Route
            path="/order/:ownerId/:storeId/:orderId"
            element={<OrderPage />}
          />
          <Route path="/QR/:qrCode" element={<QRPage />} />
          <Route path="/popstore/edit/:storeId" element={<EditPopstore />} />
          <Route
            path="/popstore/customers/:storeId"
            element={<CustomersPage />}
          />
          <Route path="/popstore/orders/:storeId" element={<PopStoreOrders />} />
          <Route
            path="/popstore/packaging/:storeId"
            element={<PopStorePackings />}
          />
          {/* <Route path="/popstore/orders" element={<PopStoreOrders />} /> */}
          {/* <Route path="/popstore/packing" element={<PopStorePackings />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContainer>
    </ThemeCustomization>
  );
}
export default App;
