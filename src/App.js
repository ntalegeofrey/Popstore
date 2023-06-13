import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import OnboardingTooltip from "./components/ReactJoyride/ReactJoyride";
import MainContainer from "./components/Styles/styledMainContainer";
import ThemeCustomization from "./config/theme";
import AnalyticsPage from "./pages/Analytics/Analytics";
import CustomersPage from "./pages/CustomersPage/CustomersPage";
import DownloadedPage from "./pages/DownloadedPage";
import EditPopstore from "./pages/EditPopstore/EditPopstore";
import LandingPage from "./pages/LandingPage/LandingPage";
import MyPopstore from "./pages/MyPopstore/MyPopstore";
import NewPopstore from "./pages/NewPopstore/NewPopstore";
import NotFound from "./pages/NotFound/NotFound";
import OrderPage from "./pages/OrderPage/OrderPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import PackingPage from "./pages/PackingPage/PackingPage";
import PopStore from "./pages/PopStore/PopStore";
import QRPage from "./pages/QRPage/QRPage";
import { steps } from "./utils/onboardingSteps";

function App() {
  return (
    <ThemeCustomization>
      <OnboardingTooltip steps={steps} />
      <Toaster />
      <Navigation />
      <MainContainer component={"main"}>
        {/* puts content below appbar */}
        <Box sx={{ height: "45px", mt: 4 }}></Box>
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
          <Route path="/popstore/orders/:storeId" element={<OrdersPage />} />
          <Route
            path="/popstore/packaging/:storeId"
            element={<PackingPage />}
          />
          <Route
            path="/popstore/analytics/:storeId"
            element={<AnalyticsPage />}
          />
          <Route path="/popstore/downloaded" element={<DownloadedPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContainer>
    </ThemeCustomization>
  );
}
export default App;
