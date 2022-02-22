import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/Landing Page/LandingPage";
import Login from "./pages/Login/Login";
import MyPopstore from "./pages/My Popstore/MyPopstore";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/my-popstore" element={<MyPopstore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
