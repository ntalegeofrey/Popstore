import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing Page/LandingPage";
import MyPopstore from "./pages/My Popstore/MyPopstore";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/my-popstore" element={<MyPopstore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
