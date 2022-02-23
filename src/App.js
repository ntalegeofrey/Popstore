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

import theme from "./config/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/my-popstore" element={<MyPopstore />} />
           <Route path="/new-popstore" element={<NewPopstore />} />
          <Route path=":id/:storeName" element={<StoreOwnerPages />}>
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="packaging" element={<PackagingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App;
